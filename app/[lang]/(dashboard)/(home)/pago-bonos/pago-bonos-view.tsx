"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "@/components/ui/use-toast";
import {
  BonusListMeta,
  BonusStatus,
  DriverBonus,
  bonusErrorMessage,
  fetchDriverBonuses,
  payDriverBonus,
} from "@/services/driver-bonus.service";

const LIMIT = 15;
const MAX_FILE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

const TABS = [
  { value: "PAYOUT_REQUESTED", label: "En espera" },
  { value: "PENDING", label: "Pendientes" },
  { value: "IN_WALLET", label: "En wallet" },
  { value: "PAID", label: "Pagados" },
  { value: "ALL", label: "Todos" },
];

const STATUS_LABEL: Record<BonusStatus, { label: string; color: any }> = {
  PENDING: { label: "Pendiente", color: "secondary" },
  IN_WALLET: { label: "En wallet", color: "info" },
  PAYOUT_REQUESTED: { label: "En espera", color: "warning" },
  PAID: { label: "Pagado", color: "success" },
};

const money = (v: any) => `S/ ${Number(v ?? 0).toFixed(2)}`;

const fmtDate = (v?: string | null) => {
  if (!v) return "-";
  const d = new Date(v);
  if (isNaN(d.getTime())) return "-";
  const p = (n: number) => String(n).padStart(2, "0");
  return `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
};

const driverName = (b: DriverBonus) =>
  [b.driver?.firstName, b.driver?.lastName].filter(Boolean).join(" ") ||
  `Conductor #${b.driverUserId}`;

const StatusBadge = ({ status }: { status: BonusStatus }) => {
  const s = STATUS_LABEL[status] ?? { label: status, color: "secondary" };
  return (
    <Badge variant="soft" color={s.color}>
      {s.label}
    </Badge>
  );
};

const Field = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div>
    <div className="text-xs text-muted-foreground">{label}</div>
    <div className="text-sm font-medium break-words">{children || "-"}</div>
  </div>
);

const PagoBonosView = () => {
  const [status, setStatus] = useState("PAYOUT_REQUESTED");
  const [page, setPage] = useState(1);
  const [items, setItems] = useState<DriverBonus[]>([]);
  const [meta, setMeta] = useState<BonusListMeta | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [detail, setDetail] = useState<DriverBonus | null>(null);
  const [payTarget, setPayTarget] = useState<DriverBonus | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetchDriverBonuses(status, page, LIMIT);
      setItems(res.data);
      setMeta(res.meta);
    } catch (e) {
      setError(bonusErrorMessage(e));
    } finally {
      setLoading(false);
    }
  }, [status, page]);

  useEffect(() => {
    load();
  }, [load]);

  const lastPage = Math.max(1, Number(meta?.lastPage ?? 1));

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="text-2xl font-medium">Pago de bonos</div>
        <div className="text-sm text-muted-foreground">
          Monto total de la vista:{" "}
          <span className="font-semibold text-default-900">
            {money(meta?.totalAmount)}
          </span>{" "}
          ({meta?.total ?? 0} bonos)
        </div>
      </div>

      <Tabs
        value={status}
        onValueChange={(v) => {
          setStatus(v);
          setPage(1);
        }}
        className="mt-4"
      >
        <TabsList>
          {TABS.map((t) => (
            <TabsTrigger key={t.value} value={t.value}>
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <Card className="mt-4">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Conductor</TableHead>
              <TableHead>Monto</TableHead>
              <TableHead>Yape solicitado</TableHead>
              <TableHead>Fecha de solicitud</TableHead>
              <TableHead>Viaje</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  Cargando bonos...
                </TableCell>
              </TableRow>
            ) : error ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-destructive">
                  {error}
                </TableCell>
              </TableRow>
            ) : items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No hay bonos en esta categoría.
                </TableCell>
              </TableRow>
            ) : (
              items.map((b) => (
                <TableRow
                  key={b.id}
                  className="cursor-pointer"
                  onClick={() => setDetail(b)}
                >
                  <TableCell>
                    <div className="font-medium">{driverName(b)}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.driver?.mobile || "-"}
                    </div>
                  </TableCell>
                  <TableCell className="font-semibold">{money(b.amount)}</TableCell>
                  <TableCell>
                    <div>{b.requestedYapeNumber || "-"}</div>
                    <div className="text-xs text-muted-foreground">
                      {b.requestedYapeName || ""}
                    </div>
                  </TableCell>
                  <TableCell>{fmtDate(b.requestedAt)}</TableCell>
                  <TableCell className="max-w-[260px]">
                    <div className="truncate">
                      {b.pickupName || "-"} → {b.dropoffName || "-"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      Total {money(b.tripTotal)} · {b.passengerName || "Pasajero"}
                    </div>
                  </TableCell>
                  <TableCell>
                    <StatusBadge status={b.status} />
                  </TableCell>
                  <TableCell className="text-right">
                    <div
                      className="flex justify-end gap-2"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button size="sm" variant="outline" onClick={() => setDetail(b)}>
                        Ver
                      </Button>
                      {b.status === "PAYOUT_REQUESTED" && (
                        <Button size="sm" onClick={() => setPayTarget(b)}>
                          Pagar
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between p-3 text-sm">
          <span className="text-muted-foreground">
            Página {page} de {lastPage}
          </span>
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Anterior
            </Button>
            <Button
              size="sm"
              variant="outline"
              disabled={page >= lastPage || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>

      <DetailDialog
        bonus={detail}
        onClose={() => setDetail(null)}
        onPay={(b) => {
          setDetail(null);
          setPayTarget(b);
        }}
      />
      <PayDialog
        bonus={payTarget}
        onClose={() => setPayTarget(null)}
        onPaid={() => {
          setPayTarget(null);
          load();
        }}
      />
    </div>
  );
};

const DetailDialog = ({
  bonus,
  onClose,
  onPay,
}: {
  bonus: DriverBonus | null;
  onClose: () => void;
  onPay: (b: DriverBonus) => void;
}) => (
  <Dialog open={!!bonus} onOpenChange={(o) => !o && onClose()}>
    <DialogContent size="2xl" className="max-h-[90vh] overflow-y-auto">
      {bonus && (
        <>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Bono {money(bonus.amount)} <StatusBadge status={bonus.status} />
            </DialogTitle>
            <DialogDescription>Detalle del bono y del viaje</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Conductor">{driverName(bonus)}</Field>
            <Field label="Teléfono del conductor">{bonus.driver?.mobile}</Field>
            <Field label="Pasajero">{bonus.passengerName}</Field>
            <Field label="Total del viaje">{money(bonus.tripTotal)}</Field>
            <Field label="Origen">{bonus.pickupName}</Field>
            <Field label="Destino">{bonus.dropoffName}</Field>
            <Field label="ID del viaje">{bonus.tripId}</Field>
            <Field label="Bono generado">{fmtDate(bonus.createdAt)}</Field>
            <Field label="Pasado a wallet">{fmtDate(bonus.movedToWalletAt)}</Field>
            <Field label="Pago solicitado">{fmtDate(bonus.requestedAt)}</Field>
            <Field label="Yape solicitado">{bonus.requestedYapeNumber}</Field>
            <Field label="Nombre Yape">{bonus.requestedYapeName}</Field>
          </div>
          {bonus.status === "PAID" && (
            <div className="border-t pt-3">
              <div className="font-semibold mb-2">Pago realizado</div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <Field label="Fecha de pago">{fmtDate(bonus.paidAt)}</Field>
                <Field label="Número yapeado">{bonus.paidToNumber}</Field>
                <Field label="Monto pagado">{money(bonus.paidAmount)}</Field>
              </div>
              {bonus.receiptUrl && (
                <a
                  href={bonus.receiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 block"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={bonus.receiptUrl}
                    alt="Captura del pago"
                    className="max-h-72 rounded border object-contain"
                  />
                  <span className="text-xs text-primary">Abrir en tamaño completo</span>
                </a>
              )}
            </div>
          )}
          <DialogFooter>
            {bonus.status === "PAYOUT_REQUESTED" && (
              <Button onClick={() => onPay(bonus)}>Pagar</Button>
            )}
            <Button variant="outline" onClick={onClose}>
              Cerrar
            </Button>
          </DialogFooter>
        </>
      )}
    </DialogContent>
  </Dialog>
);

const PayDialog = ({
  bonus,
  onClose,
  onPaid,
}: {
  bonus: DriverBonus | null;
  onClose: () => void;
  onPaid: () => void;
}) => {
  const [number, setNumber] = useState("");
  const [amount, setAmount] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (bonus) {
      setNumber(bonus.requestedYapeNumber || "");
      setAmount(Number(bonus.amount ?? 0).toFixed(2));
      setFile(null);
      setErrors({});
    }
  }, [bonus]);

  useEffect(() => {
    if (!file) {
      setPreview(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const onFile = (f: File | null) => {
    if (!f) {
      setFile(null);
      return;
    }
    if (!ALLOWED.includes(f.type)) {
      setErrors((e) => ({ ...e, receipt: "Solo se permiten imágenes JPG, PNG o WEBP." }));
      setFile(null);
      return;
    }
    if (f.size > MAX_FILE) {
      setErrors((e) => ({ ...e, receipt: "La imagen supera los 5 MB." }));
      setFile(null);
      return;
    }
    setErrors((e) => ({ ...e, receipt: "" }));
    setFile(f);
  };

  const submit = async () => {
    if (!bonus) return;
    const errs: Record<string, string> = {};
    if (!/^9\d{8}$/.test(number.trim())) errs.number = "Debe tener 9 dígitos y empezar con 9.";
    if (!/^\d+(\.\d{1,2})?$/.test(amount.trim()) || Number(amount) <= 0)
      errs.amount = "Monto mayor a 0 con máximo 2 decimales.";
    if (!file) errs.receipt = "Adjunta la captura del pago.";
    setErrors(errs);
    if (Object.values(errs).some(Boolean) || !file) return;

    setSubmitting(true);
    try {
      await payDriverBonus(bonus.id, {
        paidToNumber: number.trim(),
        paidAmount: amount.trim(),
        receipt: file,
      });
      toast({ title: "Bono pagado", description: "El pago se registró correctamente." });
      onPaid();
    } catch (e) {
      toast({
        title: "No se pudo registrar el pago",
        description: bonusErrorMessage(e),
        variant: "destructive",
      } as any);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={!!bonus} onOpenChange={(o) => !o && !submitting && onClose()}>
      <DialogContent size="lg" className="max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Pagar bono</DialogTitle>
          <DialogDescription>
            {bonus ? `${driverName(bonus)} · bono de ${money(bonus.amount)}` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-3">
          <div>
            <Label htmlFor="bonus-number">Número yapeado</Label>
            <Input
              id="bonus-number"
              inputMode="numeric"
              maxLength={9}
              value={number}
              onChange={(e) => setNumber(e.target.value.replace(/\D/g, ""))}
            />
            {errors.number && <p className="text-xs text-destructive mt-1">{errors.number}</p>}
          </div>
          <div>
            <Label htmlFor="bonus-amount">Monto (S/)</Label>
            <Input
              id="bonus-amount"
              inputMode="decimal"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            {errors.amount && <p className="text-xs text-destructive mt-1">{errors.amount}</p>}
          </div>
          <div>
            <Label htmlFor="bonus-receipt">Captura del pago</Label>
            <Input
              id="bonus-receipt"
              type="file"
              accept="image/jpeg,image/png,image/webp"
              onChange={(e) => onFile(e.target.files?.[0] ?? null)}
            />
            {errors.receipt && <p className="text-xs text-destructive mt-1">{errors.receipt}</p>}
            {preview && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={preview}
                alt="Vista previa"
                className="mt-2 max-h-64 rounded border object-contain"
              />
            )}
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={submitting}>
            Cancelar
          </Button>
          <Button onClick={submit} disabled={submitting}>
            {submitting ? "Registrando..." : "Confirmar pago"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PagoBonosView;
