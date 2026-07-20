/**
 * Módulo de Registro y Consulta del Historial de Auditoría en Dashboard
 */

export interface AuditEntry {
  id: string;
  action: string;
  admin: string;
  targetUser: string;
  role: string;
  reason: string;
  date: string;
  type: "delete" | "edit" | "disable" | "recharge";
}

const initialMockLogs: AuditEntry[] = [
  {
    id: "101",
    action: "Inhabilitar Conductor",
    admin: "Admin Principal",
    targetUser: "Juan Pérez (#12)",
    role: "Driver",
    reason: "Documentación de SOAT vencida",
    date: "2026-07-20 11:20",
    type: "disable",
  },
  {
    id: "102",
    action: "Recarga Manual Billetera",
    admin: "Admin Principal",
    targetUser: "María Gómez (#45)",
    role: "Passenger",
    reason: "Recarga abonada por Yape fuera de App (S/ 50.00)",
    date: "2026-07-20 10:45",
    type: "recharge",
  },
  {
    id: "103",
    action: "Edición de Perfil",
    admin: "Admin Soporte",
    targetUser: "Carlos López (#88)",
    role: "Driver",
    reason: "Actualización de correo electrónico a solicitud del cliente",
    date: "2026-07-19 16:30",
    type: "edit",
  },
  {
    id: "104",
    action: "Eliminación de Usuario",
    admin: "Admin Principal",
    targetUser: "Roberto Diaz (#103)",
    role: "Passenger",
    reason: "Solicitud explícita de eliminación de cuenta por privacidad",
    date: "2026-07-18 14:15",
    type: "delete",
  },
];

export function getAuditLogs(): AuditEntry[] {
  if (typeof window === "undefined") return initialMockLogs;
  try {
    const saved = localStorage.getItem("way_audit_logs");
    if (saved) {
      const parsed = JSON.parse(saved);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Error reading audit logs:", e);
  }
  return initialMockLogs;
}

export function logAuditEvent(entry: Omit<AuditEntry, "id" | "date">) {
  if (typeof window === "undefined") return;
  try {
    const current = getAuditLogs();
    const newEntry: AuditEntry = {
      ...entry,
      id: String(Date.now()),
      date: new Date().toLocaleString("es-PE", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
    const updated = [newEntry, ...current];
    localStorage.setItem("way_audit_logs", JSON.stringify(updated));
  } catch (e) {
    console.error("Error writing audit log:", e);
  }
}
