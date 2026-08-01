"use client";
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { fetchDriverWalletTransactions } from "@/services/driver-requirement.service";

interface UserRetirtosTableProps {
  userId?: number;
}

const UserRetirtosTable: React.FC<UserRetirtosTableProps> = ({ userId }) => {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!userId) return;
    const loadTransactions = async () => {
      setLoading(true);
      try {
        const res: any = await fetchDriverWalletTransactions(userId);
        const dataList = res?.data?.data || res?.data || (Array.isArray(res) ? res : []);
        setTransactions(Array.isArray(dataList) ? dataList : []);
      } catch (err) {
        console.error("Error cargando transacciones de billetera:", err);
      } finally {
        setLoading(false);
      }
    };
    loadTransactions();
  }, [userId]);

  const columns: { key: string; label: string }[] = [
    { key: "fecha", label: "Fecha Recarga" },
    { key: "descripcion", label: "Descripción / Método" },
    { key: "monto", label: "Monto (S/)" },
  ];

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                Cargando recargas...
              </TableCell>
            </TableRow>
          ) : transactions.length === 0 ? (
            <TableRow>
              <TableCell colSpan={3} className="text-center py-4 text-muted-foreground">
                No se registraron recargas para este conductor.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map((item: any, idx: number) => {
              const formattedDate = item.createdAt
                ? new Date(item.createdAt).toLocaleString("es-PE")
                : "N/A";
              const amountVal = item.amount ? parseFloat(item.amount).toFixed(2) : "0.00";
              const isCredit = item.type === "RECHARGE" || item.type === "CREDIT" || parseFloat(item.amount || 0) >= 0;

              return (
                <TableRow key={item.id || idx}>
                  <TableCell className="font-medium text-card-foreground/80">
                    {formattedDate}
                  </TableCell>
                  <TableCell>
                    {item.description || item.type || "Recarga Manual"}
                  </TableCell>
                  <TableCell className="font-semibold">
                    <Badge variant={isCredit ? "soft" : "outline"} color={isCredit ? "success" : "destructive"}>
                      {isCredit ? `+ S/ ${amountVal}` : `- S/ ${amountVal}`}
                    </Badge>
                  </TableCell>
                </TableRow>
              );
            })
          )}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserRetirtosTable;
