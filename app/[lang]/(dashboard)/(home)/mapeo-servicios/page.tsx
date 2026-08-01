"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClientGet } from "@/services/api-client.service";
import Link from "next/link";
import {
  RefreshCw,
  Search,
  Car,
  Clock,
  CheckCircle2,
  AlertCircle,
  XCircle,
  MapPin,
  Phone,
} from "lucide-react";

export default function MapeoServiciosPage() {
  const [trips, setTrips] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const loadDailyTrips = useCallback(async () => {
    try {
      setLoading(true);
      const res: any = await apiClientGet("/trip/history", {
        params: {
          role: "driver",
          page: 1,
          limit: 200,
        },
      });

      const rawList =
        res?.data?.trips || res?.trips || (Array.isArray(res) ? res : []);

      setTrips(Array.isArray(rawList) ? rawList : []);
    } catch (err) {
      console.error("Error al cargar mapeo de servicios:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDailyTrips();
  }, [loadDailyTrips, selectedDate]);

  useEffect(() => {
    if (!autoRefresh) return;
    const interval = setInterval(() => {
      loadDailyTrips();
    }, 10000);
    return () => clearInterval(interval);
  }, [autoRefresh, loadDailyTrips]);

  const filteredTrips = trips.filter((t) => {
    const tripDate = t.createdAt
      ? new Date(t.createdAt).toISOString().split("T")[0]
      : "";
    const matchesDate = !selectedDate || tripDate === selectedDate;

    const state = (t.tripState || t.state || "").toUpperCase();
    const matchesStatus =
      statusFilter === "ALL" ||
      (statusFilter === "SEARCHING" && (state === "SEARCHING" || state === "CREATED")) ||
      (statusFilter === "ACCEPTED" && (state === "ACCEPTED" || state === "ON_THE_WAY")) ||
      (statusFilter === "IN_TRIP" && (state === "ARRIVED_AT_PICKUP" || state === "IN_PROGRESS")) ||
      (statusFilter === "COMPLETED" && (state === "ARRIVED_AT_DESTINATION" || state === "FINISHED" || state === "COMPLETED")) ||
      (statusFilter === "CANCELLED" && (state === "CANCELLED" || state === "REJECTED"));

    const searchLower = searchTerm.toLowerCase().trim();
    const passengerName = `${t.user?.firstName || ""} ${t.user?.lastName || ""}`.toLowerCase();
    const driverName = `${t.driverUser?.firstName || t.vehicle?.user?.firstName || ""} ${t.driverUser?.lastName || ""}`.toLowerCase();
    const pickupName = (t.pickupLocation?.name || "").toLowerCase();
    const dropoffName = (t.dropoffLocations?.[0]?.name || "").toLowerCase();
    const tripIdStr = String(t.id || "");

    const matchesSearch =
      !searchLower ||
      passengerName.includes(searchLower) ||
      driverName.includes(searchLower) ||
      pickupName.includes(searchLower) ||
      dropoffName.includes(searchLower) ||
      tripIdStr.includes(searchLower);

    return matchesDate && matchesStatus && matchesSearch;
  });

  const totalCount = filteredTrips.length;
  const searchingCount = filteredTrips.filter((t) => {
    const s = (t.tripState || "").toUpperCase();
    return s === "SEARCHING" || s === "CREATED";
  }).length;
  const acceptedCount = filteredTrips.filter((t) => {
    const s = (t.tripState || "").toUpperCase();
    return s === "ACCEPTED" || s === "ON_THE_WAY" || s === "IN_PROGRESS" || s === "ARRIVED_AT_PICKUP";
  }).length;
  const completedCount = filteredTrips.filter((t) => {
    const s = (t.tripState || "").toUpperCase();
    return s === "ARRIVED_AT_DESTINATION" || s === "FINISHED" || s === "COMPLETED";
  }).length;
  const cancelledCount = filteredTrips.filter((t) => {
    const s = (t.tripState || "").toUpperCase();
    return s === "CANCELLED" || s === "REJECTED";
  }).length;

  const renderStatusBadge = (stateRaw: string) => {
    const s = (stateRaw || "").toUpperCase();
    if (s === "SEARCHING" || s === "CREATED") {
      return (
        <Badge variant="soft" color="warning" className="animate-pulse">
          🔍 Buscando Conductor
        </Badge>
      );
    }
    if (s === "ACCEPTED" || s === "ON_THE_WAY") {
      return (
        <Badge variant="soft" color="info">
          🚗 Aceptado (En Camino)
        </Badge>
      );
    }
    if (s === "ARRIVED_AT_PICKUP" || s === "IN_PROGRESS") {
      return (
        <Badge variant="soft" color="info">
          🚕 En Viaje
        </Badge>
      );
    }
    if (s === "ARRIVED_AT_DESTINATION" || s === "FINISHED" || s === "COMPLETED") {
      return (
        <Badge variant="soft" color="success">
          ✅ Completado
        </Badge>
      );
    }
    if (s === "CANCELLED" || s === "REJECTED") {
      return (
        <Badge variant="soft" color="destructive">
          ❌ Cancelado
        </Badge>
      );
    }
    return <Badge variant="outline">{s || "Pendiente"}</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-foreground">
            Mapeo & Monitoreo de Servicios
          </h1>
          <p className="text-sm text-muted-foreground">
            Control de llamadas e ingresos de carreras en tiempo real. Visualiza qué servicios entraron, si fueron tomados y por quién.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant={autoRefresh ? "soft" : "outline"}
            color={autoRefresh ? "primary" : "secondary"}
            size="sm"
            onClick={() => setAutoRefresh(!autoRefresh)}
            className="flex items-center gap-2 text-xs"
          >
            <RefreshCw className={`h-4 w-4 ${autoRefresh ? "animate-spin" : ""}`} />
            {autoRefresh ? "Auto-refresco (10s ON)" : "Auto-refresco OFF"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={loadDailyTrips}
            disabled={loading}
            className="flex items-center gap-2 text-xs"
          >
            <RefreshCw className="h-4 w-4" />
            Refrescar Ahora
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Total Servicios</p>
              <h3 className="text-2xl font-bold text-foreground">{totalCount}</h3>
            </div>
            <Clock className="h-8 w-8 text-primary/40" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Sin Conductor</p>
              <h3 className="text-2xl font-bold text-warning">{searchingCount}</h3>
            </div>
            <AlertCircle className="h-8 w-8 text-warning/40" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-info">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Aceptados / En Ruta</p>
              <h3 className="text-2xl font-bold text-info">{acceptedCount}</h3>
            </div>
            <Car className="h-8 w-8 text-info/40" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Completados</p>
              <h3 className="text-2xl font-bold text-success">{completedCount}</h3>
            </div>
            <CheckCircle2 className="h-8 w-8 text-success/40" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-destructive">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Cancelados</p>
              <h3 className="text-2xl font-bold text-destructive">{cancelledCount}</h3>
            </div>
            <XCircle className="h-8 w-8 text-destructive/40" />
          </div>
        </Card>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Buscar por cliente, conductor, dirección..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex items-center gap-1 text-xs">
              <span className="text-muted-foreground">Fecha:</span>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="h-9 text-xs w-36"
              />
              {selectedDate && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedDate("")}
                  className="h-9 text-xs px-2"
                >
                  Todas
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {["ALL", "SEARCHING", "ACCEPTED", "IN_TRIP", "COMPLETED", "CANCELLED"].map(
              (st) => (
                <Button
                  key={st}
                  variant={statusFilter === st ? "soft" : "outline"}
                  color={statusFilter === st ? "primary" : "secondary"}
                  size="sm"
                  onClick={() => setStatusFilter(st)}
                  className="text-xs h-8 px-3"
                >
                  {st === "ALL"
                    ? "Todos"
                    : st === "SEARCHING"
                    ? "Buscando"
                    : st === "ACCEPTED"
                    ? "Aceptados"
                    : st === "IN_TRIP"
                    ? "En Viaje"
                    : st === "COMPLETED"
                    ? "Completados"
                    : "Cancelados"}
                </Button>
              )
            )}
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID / Hora</TableHead>
              <TableHead>Pasajero (Cliente)</TableHead>
              <TableHead>Origen → Destino</TableHead>
              <TableHead>Monto Oferta</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Conductor Asignado</TableHead>
              <TableHead className="text-right">Acción</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  Cargando monitoreo de servicios...
                </TableCell>
              </TableRow>
            ) : filteredTrips.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                  No se encontraron servicios registrados para el filtro seleccionado.
                </TableCell>
              </TableRow>
            ) : (
              filteredTrips.map((item: any) => {
                const timeCreated = item.createdAt
                  ? new Date(item.createdAt).toLocaleTimeString("es-PE", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  : "N/A";
                const passengerName =
                  `${item.user?.firstName || "Pasajero"} ${item.user?.lastName || ""}`.trim();
                const passengerMobile = item.user?.mobile || item.senderMobile || "Sin teléfono";

                const driverName = item.driverUser
                  ? `${item.driverUser.firstName} ${item.driverUser.lastName}`
                  : item.vehicle?.user
                  ? `${item.vehicle.user.firstName} ${item.vehicle.user.lastName}`
                  : null;

                const driverMobile = item.driverUser?.mobile || item.vehicle?.user?.mobile;
                const vehiclePlate = item.vehicle?.plateNumber;

                const offerAmount = item.offer || item.amount || 0;

                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-semibold text-xs">
                      <div className="flex flex-col">
                        <span className="text-foreground">#{item.id?.toString().slice(0, 8)}</span>
                        <span className="text-[11px] text-muted-foreground">{timeCreated}</span>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">{passengerName}</span>
                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                          <Phone className="h-3 w-3 inline" /> {passengerMobile}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="max-w-xs">
                      <div className="flex flex-col text-xs gap-0.5">
                        <span className="truncate font-medium text-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-success shrink-0" />
                          {item.pickupLocation?.name || "Origen no especificado"}
                        </span>
                        <span className="truncate text-muted-foreground flex items-center gap-1">
                          <MapPin className="h-3 w-3 text-destructive shrink-0" />
                          {item.dropoffLocations?.[0]?.name || "Destino no especificado"}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="font-bold text-xs">
                      S/ {parseFloat(offerAmount).toFixed(2)}
                    </TableCell>

                    <TableCell>{renderStatusBadge(item.tripState || item.state)}</TableCell>

                    <TableCell>
                      {driverName ? (
                        <div className="flex flex-col text-xs">
                          <span className="font-semibold text-foreground">{driverName}</span>
                          <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                            <Car className="h-3 w-3 inline" /> {vehiclePlate ? `[${vehiclePlate}]` : ""} {driverMobile || ""}
                          </span>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground italic">
                          Esperando aceptación...
                        </span>
                      )}
                    </TableCell>

                    <TableCell className="text-right">
                      <Link href={`/viajes/${item.id}`}>
                        <Button size="sm" variant="outline" className="h-7 text-xs px-2.5">
                          Ver Detalle
                        </Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
