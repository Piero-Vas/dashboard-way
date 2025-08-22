"use client";
import DialogConfirm from "@/app/[lang]/(dashboard)/components/dialog-basic";
import { Card } from "@/components/ui/card";
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
import { VechilesTableProps } from "@/types/driver-request-table-props.interface";
import { Icon } from "@iconify/react";
import { Car } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

const VechilesTable: React.FC<VechilesTableProps> = ({ vehicles }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);
  const columns: { key: string; label: string }[] = [
    {
      key: "id",
      label: "ID",
    },
    {
      key: "Placa",
      label: "Placa",
    },

    {
      key: "Marca",
      label: "Marca",
    },
    {
      key: "Modelo",
      label: "Modelo",
    },
    {
      key: "anio",
      label: "Año",
    },
    {
      key: "color",
      label: "Color",
    },
    {
      key: "Action",
      label: "Acciones",
    },
  ];

  const handleOpenDialog = (id: number) => {
    setSelectedUserId(id);
    setOpenDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedUserId !== null) {
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
            {vehicles.map((item, index) => (
              <TableRow key={`${item.userId}-${index}`}>
                <TableCell>{`${item.id}  `}</TableCell>
                <TableCell>{item.plateNumber}</TableCell>

                <TableCell>{item.vehicleMake.name}</TableCell>
                <TableCell>{item.vehicleModel.name}</TableCell>
                <TableCell>{item.year}</TableCell>
                <TableCell>{item.vehicleColor}</TableCell>
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

                      <Link href={`/vehiculos/editar/${item.id}`}>
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

export default VechilesTable;
