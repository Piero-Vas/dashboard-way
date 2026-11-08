"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DashboardData } from "@/hooks/use-fetch-dashboard";

interface RecentRechargesProps {
  data: DashboardData;
  loading: boolean;
  errors: Record<string, string>;
}

const RecentRecharges = ({ data, loading, errors }: RecentRechargesProps) => {
  const items = data.recharges?.data ?? [];

  return (
    <Card>
      <CardHeader className="border-none mb-0 pb-0">
        <CardTitle className="text-lg font-medium text-default-900">
          Recargas recientes
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        {loading ? (
          <div className="animate-pulse space-y-3">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="h-5 bg-default-100 rounded" />
            ))}
          </div>
        ) : !data.recharges ? (
          <div className="text-sm text-destructive">
            {errors.recharges ? "No se pudieron cargar las recargas" : "Sin datos"}
          </div>
        ) : items.length === 0 ? (
          <div className="text-sm text-default-600">
            No hay recargas registradas.
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Usuario</TableHead>
                <TableHead>Celular</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((r) => {
                const name = r.user
                  ? [r.user.firstName, r.user.lastName].filter(Boolean).join(" ")
                  : "";
                return (
                  <TableRow key={r.id}>
                    <TableCell>
                      {new Date(r.createdAt).toLocaleString("es-PE", {
                        timeZone: "America/Lima",
                        dateStyle: "short",
                        timeStyle: "short",
                      })}
                    </TableCell>
                    <TableCell>
                      {name || (r.userId != null ? `Usuario #${r.userId}` : "-")}
                    </TableCell>
                    <TableCell>{r.user?.mobile || "-"}</TableCell>
                    <TableCell className="text-right font-medium">
                      S/ {Number(r.amount).toFixed(2)}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};

export default RecentRecharges;
