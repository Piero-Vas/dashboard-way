"use client";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import {
  handleDelete,
  handleStatusUpdate,
} from "@/hooks/use-fetch-driver-requirement";
import {
  ActionModalDialog,
  StatusDriverRequirement,
  StatusRegisterDriver,
} from "@/lib/enums";
import {
  getIconModalDialog,
  getStatusClass,
  getStatusDriverRequirement,
} from "@/lib/utils";
import {
  DriverRequestsTableProps,
  VechilesTableProps,
} from "@/types/driver-request-table-props.interface";
import { Icon } from "@iconify/react";
import {
  getActionsForStatus,
  ModalDialog,
} from "../helpers/driver-requirement-helper";
import { columnsDriverRequestsTable } from "./data";
import { Badge } from "../ui/badge";
import Link from "next/link";

const VechilesTable: React.FC<VechilesTableProps> = ({ vehicles }) => {
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
    // {
    //   key: "Action",
    //   label: "Acciones",
    // },
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
          {vehicles.map((item, index) => (
            <TableRow key={`${item.userId}-${index}`}>
              <TableCell>{`${item.id}  `}</TableCell>
              <TableCell>{item.plateNumber}</TableCell>

              <TableCell>{item.vehicleMake.name}</TableCell>
              <TableCell>{item.vehicleModel.name}</TableCell>
              <TableCell>{item.year}</TableCell>
              <TableCell>{item.vehicleColor}</TableCell>
              {/* <TableCell className="ltr:pr-5 rtl:pl-5">
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

                    <DropdownMenuItem preventClose>
                      <Icon
                        icon={getIconModalDialog(ActionModalDialog.VIEW)}
                        className=" h-4 w-4 mr-2 "
                      />
                      {ActionModalDialog.VIEW}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell> */}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default VechilesTable;
