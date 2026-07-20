"use client";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataRows, users } from "./data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { DriverAllTableProps } from "@/types/driver-request-table-props.interface";
import { Driver } from "@/types/user.interface";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { fetchAdminRechargeWallet } from "@/services/driver-requirement.service";
import { getIconModalDialog } from "@/lib/utils";
import { ActionModalDialog } from "@/lib/enums";
import React, { useState } from "react";
import DialogConfirm from "../../components/dialog-basic";
import { Car, Wallet } from "lucide-react";
import { fetchDeleteDataUserById } from "@/services/driver-requirement.service";
import { exportToCSV } from "@/lib/export-utils";
import { logAuditEvent } from "@/lib/audit-logger";

const DriverAllTable: React.FC<
  DriverAllTableProps & { refreshDrivers: () => void }
> = ({ drivers, refreshDrivers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeDescription, setRechargeDescription] = useState("Recarga por Plin / Yape (Fuera de App)");
  const [isRecharging, setIsRecharging] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const filteredDrivers = drivers.filter((d) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const fullName = `${d.user?.firstName || ""} ${d.user?.lastName || ""}`.toLowerCase();
    const state = (d.state || "").toLowerCase();
    const userIdStr = String(d.userId || d.id || "");
    return (
      fullName.includes(term) ||
      state.includes(term) ||
      userIdStr.includes(term)
    );
  });

  const totalPages = Math.ceil(filteredDrivers.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedDrivers = filteredDrivers.slice(startIndex, startIndex + pageSize);

  const columns: { key: string; label: string }[] = [
    { key: "index", label: "N°" },
    { key: "driver", label: "Conductor" },
    { key: "createdAt", label: "Fecha Ingreso" },
    { key: "status", label: "Estado" },
    { key: "action", label: "Acciones" },
  ];

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async (reasonDetail?: string) => {
    if (selectedUserId !== null) {
      const d = drivers.find((item) => item.id === selectedUserId || item.userId === selectedUserId);
      const targetName = d ? `${d.user?.firstName || ""} ${d.user?.lastName || ""}`.trim() : `ID #${selectedUserId}`;
      try {
        await fetchDeleteDataUserById(selectedUserId, "driver", reasonDetail);
        logAuditEvent({
          action: "Eliminación de Conductor",
          admin: "Administrador",
          targetUser: `${targetName} (#${selectedUserId})`,
          role: "Driver",
          reason: reasonDetail || "Eliminación administrativa desde Dashboard",
          type: "delete",
        });
        refreshDrivers();
        setOpenDialog(false);
        setSelectedUserId(null);
      } catch (error) {
        console.error("Error deleting user:", error);
      }
    }
  };

  const handleOpenRechargeDialog = (id: number) => {
    setSelectedUserId(id);
    setRechargeAmount("");
    setRechargeDescription("Recarga por Plin / Yape (Fuera de App)");
    setOpenRechargeDialog(true);
  };

  const handleConfirmRecharge = async () => {
    if (selectedUserId !== null && rechargeAmount) {
      const d = drivers.find((item) => item.id === selectedUserId || item.userId === selectedUserId);
      const targetName = d ? `${d.user?.firstName || ""} ${d.user?.lastName || ""}`.trim() : `ID #${selectedUserId}`;
      setIsRecharging(true);
      try {
        await fetchAdminRechargeWallet(selectedUserId, parseFloat(rechargeAmount), rechargeDescription);
        logAuditEvent({
          action: "Recarga Manual Billetera",
          admin: "Administrador",
          targetUser: `${targetName} (#${selectedUserId})`,
          role: "Driver",
          reason: `${rechargeDescription} (S/ ${parseFloat(rechargeAmount).toFixed(2)})`,
          type: "recharge",
        });
        setOpenRechargeDialog(false);
        setSelectedUserId(null);
        refreshDrivers();
      } catch (error) {
        console.error("Error recharging:", error);
      } finally {
        setIsRecharging(false);
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredDrivers,
      [
        { key: "id", label: "ID Conductor" },
        { key: "userId", label: "ID Usuario" },
        { label: "Nombre Completo", key: "fullName", transform: (d) => `${d.user?.firstName || ""} ${d.user?.lastName || ""}` },
        { label: "Email", key: "email", transform: (d) => d.user?.email || "N/A" },
        { label: "Teléfono", key: "mobile", transform: (d) => d.user?.mobile || "N/A" },
        { key: "state", label: "Estado", transform: (d) => d.state || "Activo" },
        { key: "createdAt", label: "Fecha Ingreso", transform: (d) => {
          const dateVal = d.createdAt || d.user?.createdAt || (d as any).created_at || (d.user as any)?.created_at;
          return dateVal ? new Date(dateVal).toLocaleDateString("es-PE") : "N/A";
        } },
      ],
      "conductores_way"
    );
  };

  return (
    <>
      <Card>
        <div className="p-4 border-b border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-full max-w-md">
            <Icon
              icon="heroicons:magnifying-glass-16-solid"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground"
            />
            <Input
              type="text"
              placeholder="Buscar conductor por nombre, ID o estado..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-9 h-9 text-xs sm:text-sm"
            />
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            {searchTerm && (
              <div className="text-xs text-muted-foreground hidden sm:block">
                Encontrados: <span className="font-semibold text-foreground">{filteredDrivers.length}</span>
              </div>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={handleExportCSV}
              className="flex items-center gap-2 text-xs"
            >
              <Icon icon="heroicons:arrow-down-tray-16-solid" className="h-4 w-4" />
              Exportar CSV
            </Button>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedDrivers.map((item: Driver, idx: number) => {
              const dateVal = item.createdAt || item.user?.createdAt || (item as any).created_at || (item.user as any)?.created_at;
              return (
              <TableRow key={item.id || item.userId || idx} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-semibold text-default-600">
                  {startIndex + idx + 1}
                </TableCell>
                <TableCell className="font-medium text-card-foreground/80">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-lg h-10 w-10 border border-border">
                      <AvatarImage src={item.user?.profilePictureUrl || ""} alt={`${item.user?.firstName} ${item.user?.lastName}`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {item.user?.firstName?.charAt(0)?.toUpperCase() || "C"}
                        {item.user?.lastName?.charAt(0)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm font-semibold text-foreground">
                        {item.user?.firstName} {item.user?.lastName}
                      </span>
                      <span className="text-xs text-muted-foreground">ID: #{item.userId}</span>
                    </div>
                  </div>
                </TableCell>

                <TableCell className="text-sm text-default-600">
                  {dateVal ? new Date(dateVal).toLocaleDateString("es-PE", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="soft"
                    color={item.state === "INACTIVE" || item.state === "REJECTED" ? "destructive" : "success"}
                    className="capitalize rounded-md"
                  >
                    {item.state || "Activo"}
                  </Badge>
                </TableCell>

                <TableCell className="ltr:pr-5 rtl:pl-5">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        size="icon"
                        color="secondary"
                        className=" h-7 rounded-full bg-transparent w-7 data-[state=open]:bg-primary data-[state=open]:text-primary-foreground  "
                      >
                        <Icon
                          icon="heroicons:ellipsis-horizontal"
                          className=" h-6 w-6 "
                        />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" avoidCollisions>
                      <DropdownMenuLabel>Acciones</DropdownMenuLabel>
                      <DropdownMenuSeparator />

                      <Link href={`/conductores/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.VIEW)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.VIEW}
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/conductores/editar/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.EDIT)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.EDIT}
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/vehiculos/editar/${item.vehicleId}`}>
                        <DropdownMenuItem preventClose>
                          <Car className=" h-4 w-4 mr-2 " />
                          Editar Vehiculo
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        preventClose
                        onClick={() => {
                          handleOpenRechargeDialog(item.id);
                        }}
                      >
                        <Wallet className=" h-4 w-4 mr-2 " />
                        Recargar Saldo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        preventClose
                        onClick={() => {
                          handleOpenDialog(item.id);
                        }}
                      >
                        <Icon
                          icon={getIconModalDialog(ActionModalDialog.DELETE)}
                          className=" h-4 w-4 mr-2 "
                        />
                        {ActionModalDialog.DELETE}
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
            })}
          </TableBody>
        </Table>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-border text-sm">
          <div className="text-muted-foreground text-xs sm:text-sm">
            Mostrando <span className="font-semibold text-foreground">{filteredDrivers.length > 0 ? startIndex + 1 : 0}</span> a{" "}
            <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, filteredDrivers.length)}</span> de{" "}
            <span className="font-semibold text-foreground">{filteredDrivers.length}</span> registros
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            >
              Anterior
            </Button>
            <span className="text-xs font-semibold px-2">
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            >
              Siguiente
            </Button>
          </div>
        </div>
      </Card>
      <DialogConfirm
        open={openDialog}
        onOpenChange={setOpenDialog}
        requireReason={true}
        reasonPlaceholder="Describe por qué deseas eliminar a este conductor..."
        confirmText="Eliminar Conductor"
        onSave={(reason) => handleConfirmDelete(reason)}
        descripcion="Al eliminar un conductor, también se eliminarán sus vehículos y perfil de pasajero. Por favor ingresa el motivo obligatorio para la auditoría."
      />
      <Dialog open={openRechargeDialog} onOpenChange={setOpenRechargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recargar Billetera</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Monto a recargar (S/)</Label>
              <Input
                type="number"
                value={rechargeAmount}
                onChange={(e) => setRechargeAmount(e.target.value)}
                placeholder="Ej: 50.00"
              />
            </div>
            <div className="space-y-2">
              <Label>Motivo de la recarga</Label>
              <Select value={rechargeDescription} onValueChange={setRechargeDescription}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un motivo" />
                </SelectTrigger>
                <SelectContent className="z-[9999]">
                  <SelectItem value="Recarga por Plin / Yape (Fuera de App)">Recarga por Plin / Yape (Fuera de App)</SelectItem>
                  <SelectItem value="Bono promocional o compensación">Bono promocional o compensación</SelectItem>
                  <SelectItem value="Ajuste manual a favor">Ajuste manual a favor</SelectItem>
                  <SelectItem value="Devolución por error de cobro">Devolución por error de cobro</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setOpenRechargeDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              disabled={isRecharging || !rechargeAmount}
              onClick={handleConfirmRecharge}
            >
              {isRecharging ? "Recargando..." : "Confirmar Recarga"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DriverAllTable;
