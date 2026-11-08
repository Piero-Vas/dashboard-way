import { apiClientGet } from "@/services/api-client.service";

const PAGE_LIMIT = 200;
const MAX_PAGES = 500;

const fmtDate = (v: any) =>
  v
    ? new Date(v).toLocaleString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      })
    : "";

const STATE_LABELS: Record<string, string> = {
  CREATED: "Buscando conductor",
  SEARCHING: "Buscando conductor",
  ACCEPTED: "Aceptado",
  ON_THE_WAY: "En camino",
  ARRIVED_AT_PICKUP: "En viaje (llego al origen)",
  IN_PROGRESS: "En viaje",
  ARRIVED_AT_DESTINATION: "Completado",
  FINISHED: "Completado",
  COMPLETED: "Completado",
  CANCELLED: "Cancelado",
  REJECTED: "Rechazado",
};

const csvCell = (value: any): string => {
  if (value === null || value === undefined) return "";
  let s = String(value);
  // Evita inyeccion de formulas en Excel
  if (/^[=@\t\r]/.test(s)) s = `'${s}`;
  if (/[",\n\r]/.test(s)) s = `"${s.replace(/"/g, '""')}"`;
  return s;
};

const locLabel = (l: any): string => {
  if (!l) return "";
  if (l.name) return String(l.name);
  if (l.lat != null && l.lng != null) return `${l.lat},${l.lng}`;
  return "";
};

const num = (v: any): string => {
  if (v === null || v === undefined || v === "") return "";
  const n = Number(v);
  return isNaN(n) ? "" : n.toFixed(2);
};

const personName = (u: any) =>
  u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : "";

export const TRIP_CSV_HEADERS = [
  "ID",
  "Fecha y hora",
  "Estado",
  "Pasajero",
  "Telefono pasajero",
  "Conductor",
  "Telefono conductor",
  "Vehiculo / Placa",
  "Origen",
  "Paradas",
  "Destino",
  "Distancia (km)",
  "Metodo de pago",
  "Monto total",
  "Bono primer viaje",
  "Monto pagado por pasajero",
  "Tipo / Clase",
];

export const tripToCsvRow = (t: any): string[] => {
  const driver = t.driverUser || t.vehicle?.user;
  const drops: any[] = Array.isArray(t.dropoffLocations) ? t.dropoffLocations : [];
  const stops = drops.slice(0, -1).map(locLabel).filter(Boolean).join(" | ");
  const dest = drops.length ? locLabel(drops[drops.length - 1]) : "";
  const state = String(t.tripState || t.state || "").toUpperCase();
  const vehicle = t.vehicle
    ? [t.vehicle.vehicleMake?.name, t.vehicle.vehicleModel?.name, t.vehicle.plateNumber]
        .filter(Boolean)
        .join(" ")
    : "";
  const amount = t.amount ?? t.offer;
  const bonus = Number(t.bonusAmount ?? 0) || 0;
  const passengerAmount =
    t.passengerAmount ?? (amount != null ? Math.max(0, Number(amount) - bonus) : null);

  return [
    t.id,
    fmtDate(t.createdAt),
    STATE_LABELS[state] || state,
    personName(t.user),
    t.user?.mobile || t.senderMobile || "",
    personName(driver),
    driver?.mobile || "",
    vehicle,
    locLabel(t.pickupLocation),
    stops,
    dest,
    num(t.distance),
    t.paymentMethod || "",
    num(amount),
    num(bonus),
    num(passengerAmount),
    [t.tripType, t.tripClass].filter(Boolean).join(" / "),
  ].map(csvCell);
};

export interface ExportTripsOptions {
  /** yyyy-mm-dd (hora local), inclusive */
  dateFrom?: string;
  dateTo?: string;
  onProgress?: (fetched: number, total: number) => void;
}

/** Descarga todos los viajes paginando /trip/history y genera el CSV (UTF-8 con BOM). */
export async function exportTripsCsv(opts: ExportTripsOptions = {}): Promise<number> {
  const from = opts.dateFrom ? new Date(`${opts.dateFrom}T00:00:00`).getTime() : null;
  const to = opts.dateTo ? new Date(`${opts.dateTo}T23:59:59.999`).getTime() : null;

  const byId = new Map<string, any>();
  let total = 0;

  for (let page = 1; page <= MAX_PAGES; page++) {
    const res: any = await apiClientGet("/trip/history", {
      params: {
        role: "driver",
        page,
        limit: PAGE_LIMIT,
        // Filtro en servidor (si el backend es viejo lo ignora; abajo se filtra en cliente igual)
        ...(from !== null ? { from: new Date(from).toISOString() } : {}),
        ...(to !== null ? { to: new Date(to).toISOString() } : {}),
      },
    });
    const list: any[] = res?.data?.trips || res?.trips || (Array.isArray(res) ? res : []);
    total = res?.data?.total ?? res?.total ?? total;
    if (!list.length) break;

    let oldest = Infinity;
    for (const t of list) {
      const ts = t.createdAt ? new Date(t.createdAt).getTime() : NaN;
      if (!isNaN(ts)) oldest = Math.min(oldest, ts);
      if (from !== null && !isNaN(ts) && ts < from) continue;
      if (to !== null && !isNaN(ts) && ts > to) continue;
      if (t.id != null) byId.set(String(t.id), t);
    }
    opts.onProgress?.(page * PAGE_LIMIT, total);

    // El historial viene ordenado por fecha desc: si ya pasamos el inicio del rango, se corta
    if (from !== null && oldest < from) break;
    if (list.length < PAGE_LIMIT) break;
    if (total && page * PAGE_LIMIT >= total) break;
  }

  const rows = Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
  );

  const lines = [TRIP_CSV_HEADERS.map(csvCell).join(",")];
  rows.forEach((t) => lines.push(tripToCsvRow(t).join(",")));
  const csv = "﻿" + lines.join("\r\n");

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `backup-servicios-${opts.dateFrom || "inicio"}_${opts.dateTo || stamp}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return rows.length;
}
