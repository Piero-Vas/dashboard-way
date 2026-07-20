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
import { Icon } from "@iconify/react";
import { ShieldCheck, Download, RefreshCw } from "lucide-react";
import { exportToCSV } from "@/lib/export-utils";
import { getAuditLogs, AuditEntry } from "@/lib/audit-logger";

export default function AuditLogsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [logs, setLogs] = useState<AuditEntry[]>([]);

  const reloadLogs = () => {
    setLogs(getAuditLogs());
  };

  useEffect(() => {
    reloadLogs();
  }, []);

  const filteredLogs = logs.filter((log) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    return (
      log.action.toLowerCase().includes(term) ||
      log.admin.toLowerCase().includes(term) ||
      log.targetUser.toLowerCase().includes(term) ||
      log.reason.toLowerCase().includes(term)
    );
  });

  const handleExportCSV = () => {
    exportToCSV(
      filteredLogs,
      [
        { key: "id", label: "ID" },
        { key: "action", label: "Acción" },
        { key: "admin", label: "Administrador" },
        { key: "targetUser", label: "Usuario Afectado" },
        { key: "role", label: "Rol" },
        { key: "reason", label: "Motivo / Justificación" },
        { key: "date", label: "Fecha y Hora" },
      ],
      "historial_auditoria_way"
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
            Historial de Auditoría y Cambios
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Registro inmutable de justificaciones y motivos de modificaciones, inhabilitaciones y recargas manuales.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={reloadLogs} className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4" />
            Actualizar
          </Button>
          <Button variant="outline" size="sm" onClick={handleExportCSV} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Exportar Auditoría CSV
          </Button>
        </div>
      </div>

      <Card>
        <div className="p-4 border-b border-border flex items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Icon
              icon="heroicons:magnifying-glass-16-solid"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Buscar por usuario, acción o motivo..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 h-9 text-xs sm:text-sm"
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>N°</TableHead>
              <TableHead>Acción</TableHead>
              <TableHead>Usuario Afectado</TableHead>
              <TableHead>Ejecutado Por</TableHead>
              <TableHead>Motivo Obligatorio / Justificación</TableHead>
              <TableHead>Fecha</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredLogs.map((item, idx) => (
              <TableRow key={item.id} className="hover:bg-muted/50">
                <TableCell className="font-semibold text-xs">{idx + 1}</TableCell>
                <TableCell>
                  <Badge variant="soft" color={getBadgeColor(item.type)} className="capitalize rounded-md text-xs">
                    {item.action}
                  </Badge>
                </TableCell>
                <TableCell className="font-medium text-xs text-foreground">{item.targetUser}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.admin}</TableCell>
                <TableCell className="text-xs max-w-xs truncate text-foreground">{item.reason}</TableCell>
                <TableCell className="text-xs text-muted-foreground">{item.date}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
}
