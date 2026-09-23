"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Icon } from "@iconify/react";
import { ShieldCheck, Download, RefreshCw, Wallet, UserX, AlertTriangle, Eye } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";
import { getAuditLogs, AuditEntry } from "@/lib/audit-logger";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [activeTab, setActiveTab] = useState<"all" | "recharge" | "disable" | "delete" | "edit">("all");
  const [logs, setLogs] = useState<AuditEntry[]>([]);
  const [selectedLog, setSelectedLog] = useState<AuditEntry | null>(null);
  const [detailModalOpen, setDetailModalOpen] = useState(false);

  const reloadLogs = () => {
    setLogs(getAuditLogs());
  };

  useEffect(() => {
    reloadLogs();
  }, []);

  const extractAmount = (log: AuditEntry): string | null => {
    if (log.amount) return String(log.amount);
    const match = log.reason.match(/S\/\s*([0-9]+(?:\.[0-9]{1,2})?)/i);
    return match ? match[1] : null;
  };

  const filteredLogs = logs.filter((log) => {
    // Tab filter
    if (activeTab !== "all" && log.type !== activeTab) {
      return false;
    }

    // Text search
    const term = searchTerm.toLowerCase().trim();
    if (term) {
      const match =
        log.action.toLowerCase().includes(term) ||
        log.admin.toLowerCase().includes(term) ||
        log.targetUser.toLowerCase().includes(term) ||
        log.reason.toLowerCase().includes(term);
      if (!match) return false;
    }

    // Date range
    if (log.date) {
      const logTime = new Date(log.date.replace(/(\d{2})\/(\d{2})\/(\d{4})/, "$3-$2-$1")).getTime();
      if (!isNaN(logTime)) {
        if (startDate) {
          const sTime = new Date(startDate).getTime();
          if (logTime < sTime) return false;
        }
        if (endDate) {
          const eTime = new Date(endDate).setHours(23, 59, 59, 999);
          if (logTime > eTime) return false;
        }
      }
    }

    return true;
  });

  const rechargeLogs = logs.filter((l) => l.type === "recharge");
  const totalRecharged = rechargeLogs.reduce((acc, l) => {
    const amt = parseFloat(extractAmount(l) || "0");
    return acc + (isNaN(amt) ? 0 : amt);
  }, 0);

  const handleExportCSV = () => {
    exportToCSV(
      filteredLogs,
      [
        { key: "id", label: "ID Auditoría" },
        { key: "action", label: "Acción" },
        { key: "admin", label: "Administrador" },
        { key: "targetUser", label: "Usuario Destino" },
        { key: "role", label: "Rol" },
        { key: "amount", label: "Monto (S/)", transform: (l) => extractAmount(l) ? `S/ ${parseFloat(extractAmount(l)!).toFixed(2)}` : "N/A" },
        { key: "reason", label: "Motivo / Justificación Completa" },
        { key: "date", label: "Fecha y Hora" },
      ],
      "auditoria_recargas_y_acciones"
    );
  };

  const getBadgeColor = (type: AuditEntry["type"]) => {
    switch (type) {
      case "delete":
        return "destructive";
      case "disable":
        return "warning";
      case "recharge":
        return "success";
      default:
        return "info";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-primary" />
            Auditoría de Recargas y Operaciones
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro transparente de recargas manuales de saldo, inhabilitaciones y modificaciones operativas.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reloadLogs} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar CSV
          </Button>
        </div>
      </div>

      {/* Tarjetas de Métricas Rápidas */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4 border-l-4 border-l-success">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Total Recargas Registradas</p>
              <h3 className="text-2xl font-bold text-success">
                S/ {totalRecharged.toFixed(2)}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">{rechargeLogs.length} recargas realizadas</p>
            </div>
            <Wallet className="h-8 w-8 text-success/30" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-warning">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Inhabilitaciones / Bloqueos</p>
              <h3 className="text-2xl font-bold text-warning">
                {logs.filter((l) => l.type === "disable").length}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Conductores o usuarios restringidos</p>
            </div>
            <AlertTriangle className="h-8 w-8 text-warning/30" />
          </div>
        </Card>

        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-muted-foreground font-semibold">Total Eventos Auditados</p>
              <h3 className="text-2xl font-bold text-primary">
                {logs.length}
              </h3>
              <p className="text-[11px] text-muted-foreground mt-0.5">Historial total en sistema</p>
            </div>
            <ShieldCheck className="h-8 w-8 text-primary/30" />
          </div>
        </Card>
      </div>

      <Card>
        {/* Barra de Filtros y Pestañas */}
        <div className="p-4 border-b border-border flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: "Todas las Operaciones" },
              { id: "recharge", label: "💰 Recargas de Billetera" },
              { id: "disable", label: "⚠️ Inhabilitaciones" },
              { id: "delete", label: "❌ Eliminaciones" },
              { id: "edit", label: "✏️ Modificaciones" },
            ].map((t) => (
              <Button
                key={t.id}
                variant={activeTab === t.id ? "soft" : "outline"}
                color={activeTab === t.id ? "primary" : "secondary"}
                size="sm"
                className="text-xs h-8"
                onClick={() => setActiveTab(t.id as any)}
              >
                {t.label}
              </Button>
            ))}
          </div>

          <div className="flex flex-col md:flex-row items-center justify-between gap-3 pt-2">
            <div className="relative w-full md:w-80">
              <Icon
                icon="heroicons:magnifying-glass-16-solid"
                className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
              />
              <Input
                type="text"
                placeholder="Buscar por usuario, admin, motivo o ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 h-9 text-xs"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto">
              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Desde:</span>
                <Input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="h-9 text-xs w-32"
                />
              </div>

              <div className="flex items-center gap-1 text-xs">
                <span className="text-muted-foreground">Hasta:</span>
                <Input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="h-9 text-xs w-32"
                />
              </div>

              {(searchTerm || startDate || endDate || activeTab !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setStartDate("");
                    setEndDate("");
                    setActiveTab("all");
                  }}
                  className="text-xs h-9 text-primary px-2"
                >
                  Limpiar filtros
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabla de Auditoría */}
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">N°</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Monto (S/)</TableHead>
              <TableHead>Usuario Afectado</TableHead>
              <TableHead>Ejecutado Por</TableHead>
              <TableHead className="min-w-[280px]">Motivo / Justificación Completa</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Detalle</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                  No se encontraron registros de auditoría para los filtros aplicados.
                </TableCell>
              </TableRow>
            ) : (
              filteredLogs.map((item, idx) => {
                const amountVal = extractAmount(item);
                return (
                  <TableRow key={item.id} className="hover:bg-muted/50 transition-colors">
                    <TableCell className="font-semibold text-xs text-muted-foreground">{idx + 1}</TableCell>
                    
                    <TableCell>
                      <Badge variant="soft" color={getBadgeColor(item.type)} className="capitalize rounded-md text-xs font-semibold">
                        {item.action}
                      </Badge>
                    </TableCell>

                    <TableCell>
                      {item.type === "recharge" && amountVal ? (
                        <span className="font-bold text-success text-xs bg-success/10 px-2 py-0.5 rounded border border-success/20">
                          + S/ {parseFloat(amountVal).toFixed(2)}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-semibold text-xs text-foreground">{item.targetUser}</span>
                        <span className="text-[10px] text-muted-foreground font-mono">Rol: {item.role}</span>
                      </div>
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground">
                      {item.admin}
                    </TableCell>

                    <TableCell className="text-xs text-foreground whitespace-normal leading-relaxed">
                      {item.reason}
                    </TableCell>

                    <TableCell className="text-xs text-muted-foreground whitespace-nowrap">
                      {item.date}
                    </TableCell>

                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 px-2 text-xs flex items-center gap-1"
                        onClick={() => {
                          setSelectedLog(item);
                          setDetailModalOpen(true);
                        }}
                      >
                        <Eye className="h-3.5 w-3.5" />
                        Ver
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </Card>

      {/* Modal de Detalle Completo de Auditoría */}
      <Dialog open={detailModalOpen} onOpenChange={setDetailModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <ShieldCheck className="h-5 w-5 text-primary" />
              Detalle de Auditoría #{selectedLog?.id}
            </DialogTitle>
          </DialogHeader>
          {selectedLog && (
            <div className="space-y-4 py-2 text-sm">
              <div className="grid grid-cols-2 gap-3 p-3 bg-muted/40 rounded-lg text-xs border border-border">
                <div>
                  <span className="text-muted-foreground block">Acción Realizada:</span>
                  <span className="font-semibold text-foreground">{selectedLog.action}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Tipo de Evento:</span>
                  <Badge variant="soft" color={getBadgeColor(selectedLog.type)} className="capitalize text-[10px] mt-0.5">
                    {selectedLog.type}
                  </Badge>
                </div>
                <div>
                  <span className="text-muted-foreground block">Usuario Destino:</span>
                  <span className="font-semibold text-foreground">{selectedLog.targetUser}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Rol del Usuario:</span>
                  <span className="font-mono text-foreground">{selectedLog.role}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Ejecutado Por:</span>
                  <span className="font-semibold text-foreground">{selectedLog.admin}</span>
                </div>
                <div>
                  <span className="text-muted-foreground block">Fecha y Hora:</span>
                  <span className="text-foreground">{selectedLog.date}</span>
                </div>
              </div>

              {selectedLog.type === "recharge" && (
                <div className="p-3 bg-success/10 rounded-lg border border-success/20 flex items-center justify-between">
                  <span className="text-xs font-semibold text-success">Monto Acreditado a Billetera:</span>
                  <span className="text-lg font-bold text-success">
                    S/ {parseFloat(extractAmount(selectedLog) || "0").toFixed(2)}
                  </span>
                </div>
              )}

              <div className="space-y-1">
                <span className="text-xs font-semibold text-muted-foreground block">
                  Motivo Completo / Justificación Registrada:
                </span>
                <div className="p-3 bg-card rounded-md border border-border text-xs leading-relaxed text-foreground whitespace-pre-wrap">
                  {selectedLog.reason}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" size="sm" onClick={() => setDetailModalOpen(false)}>
              Cerrar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
