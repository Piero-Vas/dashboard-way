"use client";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DataRows, users } from "./data";
import { Icon } from "@iconify/react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UserRequestsTableProps } from "@/types/user-request.table-props.interface";
import Link from "next/link";
import { useState } from "react";

const UserTableStatus: React.FC<UserRequestsTableProps> = ({
  drivers: drivers,
}) => {
  const columns: { key: string; label: string }[] = [
    {
      key: "Conductor",
      label: "Usuario",
    },
    {
      key: "fecha",
      label: "Fecha de registro",
    },

    {
      key: "status",
      label: "Estado",
    },
    {
      key: "action",
      label: "Acciones",
    },
  ];

  return (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}> {column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {drivers.map((item) => (
            <TableRow key={item.email + ""} className="hover:bg-default-100">
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-lg">
                    <AvatarImage src={item.profilePictureUrl ?? ""} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col   items-start">
                    <span className="text-sm  text-default-600">
                      {item.firstName} {item.lastName}
                    </span>
                    <p className="text-xs  text-default-400">{item.email}</p>
                  </div>
                </div>
              </TableCell>
              <TableCell>{"28/12/2024"}</TableCell>

              <TableCell>
                <Badge
                  variant="soft"
                  color={"success"}
                  className="capitalize rounded-md"
                >
                  {"Activo"}
                </Badge>
              </TableCell>

              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <BalanceModal />
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserTableStatus;

const viajes = [
  {
    id: 1,
    origen: "Av. Arequipa 123",
    destino: "Jr. Lima 456",
    precio: 25.0,
    metodoPago: "Tarjeta",
  },
  {
    id: 2,
    origen: "Av. Universitaria 789",
    destino: "Jr. Cusco 321",
    precio: 15.0,
    metodoPago: "Efectivo",
  },
  {
    id: 3,
    origen: "Calle Los Olivos 654",
    destino: "Av. Brasil 987",
    precio: 30.0,
    metodoPago: "Tarjeta",
  },
  {
    id: 4,
    origen: "Av. Javier Prado 159",
    destino: "Jr. Amazonas 753",
    precio: 20.0,
    metodoPago: "Efectivo",
  },
];

const calcularBalance = () => {
  const totalTarjeta = viajes
    .filter((v) => v.metodoPago === "Tarjeta")
    .reduce((acc, v) => acc + v.precio, 0);
  const totalEfectivo = viajes
    .filter((v) => v.metodoPago === "Efectivo")
    .reduce((acc, v) => acc + v.precio, 0);
  const gananciaTarjeta = totalTarjeta * 0.9;
  const gananciaEfectivo = totalEfectivo * 0.1;
  return { totalTarjeta, totalEfectivo, gananciaTarjeta, gananciaEfectivo };
};
const BalanceModal = () => {
  const [open, setOpen] = useState(false);
  const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
  const { totalTarjeta, totalEfectivo, gananciaEfectivo, gananciaTarjeta } =
    calcularBalance();

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Link href={"/clientes/1"}>
          <Button size="icon" variant="outline" className="h-7 w-7">
            <Icon icon="heroicons:eye" className="h-4 w-4" />
          </Button></Link>
        </DialogTrigger>

        {/* <DialogContent size="2xl" className="max-w-4xl w-[80%] p-6">
          <div className="grid grid-cols-3 gap-6">
            <div className="col-span-2">
              <h2 className="text-lg font-semibold mb-3">
                Historial de Viajes
              </h2>
              <div className="max-h-96 overflow-y-auto space-y-2 scrollbar-hidden">
                {viajes.map((viaje) => (
                  <div
                    key={viaje.id}
                    className={`p-4 rounded-lg text-white ${
                      viaje.metodoPago === "Tarjeta"
                        ? "bg-green-100"
                        : "bg-red-100"
                    } flex justify-between `}
                  >
                    <div>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Origen:</strong> {viaje.origen}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Destino:</strong> {viaje.destino}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Precio:</strong> S/ {viaje.precio.toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>
                          {viaje.metodoPago === "Tarjeta"
                            ? "Ganancia"
                            : "Descuento"}
                          :
                        </strong>{" "}
                        S/{" "}
                        {(viaje.metodoPago === "Tarjeta"
                          ? viaje.precio * 0.9
                          : viaje.precio * 0.1
                        ).toFixed(2)}
                      </p>
                      <p
                        className={`text-sm ${
                          viaje.metodoPago === "Tarjeta"
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        <strong>Método de Pago:</strong> {viaje.metodoPago}
                      </p>
                    </div>
                    <div>
                      <Link href={'/1/viajes'}>
                      <Button size="icon" variant="outline" className="h-7 w-7">
                        <Icon
                          icon="heroicons:map-pin"
                          className="h-4 w-4"
                        />
                      </Button></Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>


            <div className="bg-gray-100 p-5 rounded-lg flex flex-col justify-between">
              <div>
                <h2 className="text-lg font-semibold mb-3">Balance</h2>
                <p className="text-sm text-green-600 font-medium">
                  Tarjeta: S/ {gananciaTarjeta.toFixed(2)}
                </p>
                <p className="text-sm text-red-600 font-medium">
                  Efectivo: S/ {gananciaEfectivo.toFixed(2)}
                </p>
                <p className="text-sm font-bold mt-2">
                  Total: S/ {(gananciaTarjeta - gananciaEfectivo).toFixed(2)}
                </p>
              </div>
              <div>
                <Button
                  onClick={() => setOpenConfirmDialog(true)}
                  color="success"
                  className="w-full"
                >
                  Realizar pago
                </Button>
              </div>
            </div>
          </div>
        </DialogContent> */}
      </Dialog>

      <Dialog open={openConfirmDialog} onOpenChange={setOpenConfirmDialog}>
        <DialogContent className="p-6 max-w-md text-center">
          <h2 className="text-lg font-semibold mb-4">Confirmar Pago</h2>
          <p className="text-gray-600 mb-6">
            ¿Estás seguro de que deseas realizar el pago?
          </p>
          <div className="flex justify-center gap-4">
            <Button
              variant="outline"
              color="destructive"
              onClick={() => setOpenConfirmDialog(false)}
            >
              Cancelar
            </Button>
            <Button
              color="success"
              onClick={() => {
                console.log("Pago confirmado");
                setOpenConfirmDialog(false);
              }}
            >
              Confirmar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
