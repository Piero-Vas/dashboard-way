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
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { getIconModalDialog } from "@/lib/utils";
import { ActionModalDialog } from "@/lib/enums";
import { useState } from "react";
import DialogConfirm from "../../components/dialog-basic";
import { Car } from "lucide-react";
const DriverAllTable: React.FC<DriverAllTableProps> = ({ drivers }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const columns: { key: string; label: string }[] = [
    {
      key: "name",
      label: "Nombre",
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

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
      console.log("ID del usuario eliminado:", selectedUserId);
      // await fetchDeleteDataUserById(selectedUserId);
      setOpenDialog(false);
      setSelectedUserId(null);
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
              <TableRow key={item.userId}>
                <TableCell className="font-medium  text-card-foreground/80">
                  <TableCell className=" font-medium  text-card-foreground/80">
                    <div className="flex gap-3 items-center">
                      <Avatar className="rounded-lg">
                        <AvatarImage src={item.user.profilePictureUrl ?? ""} />
                        <AvatarFallback>
                          {item.user.firstName.split("")[0]}
                          {item.user.lastName.split("")[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col   items-start">
                        <span className="text-sm  text-default-600">
                          {item.user.firstName} {item.user.lastName}
                        </span>
                      </div>
                    </div>
                  </TableCell>
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
      />
    </>
  );
};

export default DriverAllTable;
