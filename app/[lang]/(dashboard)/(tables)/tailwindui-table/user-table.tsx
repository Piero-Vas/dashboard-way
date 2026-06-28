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
import { useState } from "react";
import DialogConfirm from "../../components/dialog-basic";
import { Car, Wallet } from "lucide-react";
import { fetchDeleteDataUserById } from "@/services/driver-requirement.service";
const DriverAllTable: React.FC<
  DriverAllTableProps & { refreshDrivers: () => void }
> = ({ drivers, refreshDrivers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  
  const [openRechargeDialog, setOpenRechargeDialog] = useState(false);
  const [rechargeAmount, setRechargeAmount] = useState("");
  const [rechargeDescription, setRechargeDescription] = useState("Recarga por Plin / Yape (Fuera de App)");
  const [isRecharging, setIsRecharging] = useState(false);

  const columns: { key: string; label: string }[] = [
    { key: "driver", label: "Conductor" },
    { key: "status", label: "Estado" },
    { key: "action", label: "Acciones" },
  ];

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
      try {
        await fetchDeleteDataUserById(selectedUserId, "driver");
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
      setIsRecharging(true);
      try {
        await fetchAdminRechargeWallet(selectedUserId, parseFloat(rechargeAmount), rechargeDescription);
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

  return (
    <>
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
            {drivers.map((item: Driver) => (
              <TableRow key={item.userId} className="hover:bg-muted/50 transition-colors">
                <TableCell className="font-medium text-card-foreground/80">
                  <div className="flex gap-3 items-center">
                    <Avatar className="rounded-lg h-10 w-10 border border-border">
                      <AvatarImage src={item.user?.profilePictureUrl ?? ""} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {item.user?.firstName?.charAt(0) || ""}
                        {item.user?.lastName?.charAt(0) || ""}
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

                <TableCell>
                  <Badge
                    variant="soft"
                    color="success"
                    className="capitalize rounded-md"
                  >
                    Activo
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
            ))}
          </TableBody>
        </Table>
      </Card>
      <DialogConfirm
        open={openDialog}
        onOpenChange={setOpenDialog}
        onSave={handleConfirmDelete}
        descripcion="Al eliminar un conductor, también se eliminarán todos los datos asociados a él, incluyendo sus vehículos, registros de viajes y su perfil de pasajero. ¿Estás seguro de que deseas continuar?"
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
