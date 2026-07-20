"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActionModalDialog } from "@/lib/enums";
import { getIconModalDialog } from "@/lib/utils";
import { UserRequestsTableProps } from "@/types/user-request.table-props.interface";
import { User } from "@/types/user.interface";
import { Icon } from "@iconify/react";
import Link from "next/link";
import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { exportToCSV } from "@/lib/export-utils";
import DialogConfirm from "../../components/dialog-basic";
import {
  fetchDeleteDataUserById,
  fetchAdminRechargeWallet,
} from "@/services/driver-requirement.service";
import { logAuditEvent } from "@/lib/audit-logger";
import { Wallet } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "react-hot-toast";

const UserTableStatus: React.FC<
  UserRequestsTableProps & { refreshUsers: () => void }
> = ({ users: users, refreshUsers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 15;

  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeDescription, setRechargeDescription] = useState(
    "Recarga por Plin / Yape (Fuera de App)"
  );
  const [isRecharging, setIsRecharging] = useState(false);

  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase().trim();
    if (!term) return true;
    const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
    const email = (u.email || "").toLowerCase();
    const mobile = (u.mobile || "").toLowerCase();
    const idStr = String(u.id || "");
    return (
      fullName.includes(term) ||
      email.includes(term) ||
      mobile.includes(term) ||
      idStr.includes(term)
    );
  });

  const totalPages = Math.ceil(filteredUsers.length / pageSize) || 1;
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + pageSize);

  const columns: { key: string; label: string }[] = [
    { key: "index", label: "N°" },
    { key: "Conductor", label: "Usuario" },
    { key: "Telefono", label: "Teléfono" },
    { key: "createdAt", label: "Fecha Afiliación" },
    { key: "status", label: "Estado" },
    { key: "action", label: "Acciones" },
  ];

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async (reasonDetail?: string) => {
    if (selectedUserId !== null) {
      const u = users.find((item) => item.id === selectedUserId);
      const targetName = u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : `ID #${selectedUserId}`;
      try {
        await fetchDeleteDataUserById(selectedUserId, "passenger", reasonDetail);
        logAuditEvent({
          action: "Eliminación de Usuario",
          admin: "Administrador",
          targetUser: `${targetName} (#${selectedUserId})`,
          role: "Passenger",
          reason: reasonDetail || "Eliminación administrativa desde Dashboard",
          type: "delete",
        });
        refreshUsers();
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
      const u = users.find((item) => item.id === selectedUserId);
      const targetName = u ? `${u.firstName || ""} ${u.lastName || ""}`.trim() : `ID #${selectedUserId}`;
      setIsRecharging(true);
      try {
        await fetchAdminRechargeWallet(
          selectedUserId,
          parseFloat(rechargeAmount),
          rechargeDescription
        );
        logAuditEvent({
          action: "Recarga Manual Billetera",
          admin: "Administrador",
          targetUser: `${targetName} (#${selectedUserId})`,
          role: "Passenger",
          reason: `${rechargeDescription} (S/ ${parseFloat(rechargeAmount).toFixed(2)})`,
          type: "recharge",
        });
        setOpenRechargeDialog(false);
        setSelectedUserId(null);
        refreshUsers();
      } catch (error) {
        console.error("Error recharging:", error);
      } finally {
        setIsRecharging(false);
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(
      filteredUsers,
      [
        { key: "id", label: "ID" },
        { label: "Nombre Completo", key: "fullName", transform: (u) => `${u.firstName || ""} ${u.lastName || ""}` },
        { key: "email", label: "Email" },
        { key: "mobile", label: "Teléfono" },
        { key: "state", label: "Estado", transform: (u) => (u.state === "INACTIVE" ? "Inactivo" : "Activo") },
        { key: "createdAt", label: "Fecha Afiliación", transform: (u) => {
          const d = u.createdAt || (u as any).created_at;
          return d ? new Date(d).toLocaleDateString("es-PE") : "N/A";
        } },
      ],
      "clientes_way"
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
              placeholder="Buscar cliente por nombre, email o teléfono..."
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
                Encontrados: <span className="font-semibold text-foreground">{filteredUsers.length}</span>
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
                <TableHead key={column.key}> {column.label}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedUsers.map((item: User, idx: number) => {
              const createdDate = item.createdAt || (item as any).created_at;
              return (
              <TableRow key={item.id || item.email || idx} className="hover:bg-default-100">
                <TableCell className="font-semibold text-default-600">
                  {startIndex + idx + 1}
                </TableCell>
                <TableCell className=" font-medium  text-card-foreground/80">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-lg h-9 w-9 border border-border">
                      <AvatarImage src={item.profilePictureUrl || ""} alt={`${item.firstName} ${item.lastName}`} />
                      <AvatarFallback className="bg-primary/10 text-primary font-bold">
                        {item.firstName?.charAt(0)?.toUpperCase() || "U"}
                        {item.lastName?.charAt(0)?.toUpperCase() || ""}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col items-start">
                      <span className="text-sm text-default-600 font-medium">
                        {item.firstName} {item.lastName}
                      </span>
                      <p className="text-xs text-default-400">{item.email}</p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>{item.mobile || "N/A"}</TableCell>
                <TableCell className="text-sm text-default-600">
                  {createdDate ? new Date(createdDate).toLocaleDateString("es-PE", { year: "numeric", month: "short", day: "numeric" }) : "N/A"}
                </TableCell>

                <TableCell>
                  <Badge
                    variant="soft"
                    color={item.state === "INACTIVE" ? "destructive" : "success"}
                    className="capitalize rounded-md"
                  >
                    {item.state === "INACTIVE" ? "Inactivo" : "Activo"}
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

                      <Link href={`/clientes/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.VIEW)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.VIEW}
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/clientes/editar/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.EDIT)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.EDIT}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        preventClose
                        onClick={() => handleOpenRechargeDialog(item.id)}
                      >
                        <Wallet className=" h-4 w-4 mr-2 " />
                        Recargar Saldo
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        preventClose
                        onClick={() => handleOpenDialog(item.id)}
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
            Mostrando <span className="font-semibold text-foreground">{filteredUsers.length > 0 ? startIndex + 1 : 0}</span> a{" "}
            <span className="font-semibold text-foreground">{Math.min(startIndex + pageSize, filteredUsers.length)}</span> de{" "}
            <span className="font-semibold text-foreground">{filteredUsers.length}</span> registros
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
        reasonPlaceholder="Describe por qué deseas eliminar a este usuario..."
        confirmText="Eliminar Usuario"
        onSave={(reason) => handleConfirmDelete(reason)}
        descripcion="Al eliminar un pasajero, se eliminarán sus datos asociados y viajes. Por favor ingresa el motivo obligatorio para la auditoría."
      />
      <Dialog open={openRechargeDialog} onOpenChange={setOpenRechargeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Recargar Billetera del Cliente</DialogTitle>
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

export default UserTableStatus;
