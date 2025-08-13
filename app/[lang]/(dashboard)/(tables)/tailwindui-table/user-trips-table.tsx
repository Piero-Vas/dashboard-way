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
import Link from "next/link";
const UserTripTable = () => {
  const columns: { key: string; label: string }[] = [
    {
      key: "inicio",
      label: "Inicio",
    },
    {
      key: "fin",
      label: "Fin",
    },
    {
      key: "monto",
      label: "monto",
    },
    {
      key: "fecha",
      label: "Fecha",
    },
    {
      key: "action",
      label: "Acciones",
    },
  ];

  const trips = [
    {
      inicio: "Av. Gral. Córdova 441",
      fin: "Miraflores 332",
      monto: "S/25",
      fecha: "12/12/2024",
    },
    {
      //   inicio: "Av. Gral. Córdova 441",
      fin: "Miraflores 332",
      monto: "S/25",
      fecha: "12/12/2024",
    },
    {
      inicio: "Av. Gral. Córdova 441",
      fin: "Miraflores 332",
      //   monto: "S/25",
      fecha: "12/12/2024",
    },
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
          {trips.map((item) => (
            <TableRow key={item.inicio}>
              <TableCell className="font-medium  text-card-foreground/80">
                {item.inicio}
              </TableCell>
              <TableCell className="font-medium  text-card-foreground/80">
                {item.fin}
              </TableCell>

              <TableCell className="ltr:pr-5 rtl:pl-5"> {item.monto}</TableCell>
              <TableCell>{item.fecha}</TableCell>
              <TableCell className="ltr:pr-5 rtl:pl-5">
                <Link href="/1/viajes">
                  <Button
                    size="icon"
                    variant="outline"
                    className=" h-7 w-7"
                    color="secondary"
                  >
                    <Icon icon="heroicons:eye" className=" h-4 w-4  " />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserTripTable;
