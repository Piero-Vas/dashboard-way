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
const UserRetirtosTable = () => {
  const columns: { key: string; label: string }[] = [
    {
      key: "fecha",
      label: "Fecha Recarga",
    },
    {
      key: "monto",
      label: "Monto",
    },
  ];

  const retiros = [
    {
      monto: "S/20",
      fecha: "12/12/2024",
    },
    {
      monto: "S/50",
      fecha: "13/12/2024",
    },
    {
      monto: "S/100",
      fecha: "14/12/2024",
    },
    {
      monto: "S/20",
      fecha: "15/12/2024",
    },
    {
      monto: "S/20",
      fecha: "16/12/2024",
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
          {retiros.map((item) => (
            <TableRow key={item.fecha}>
              <TableCell>{item.fecha}</TableCell>
              <TableCell className="ltr:pr-5 rtl:pl-5"> {item.monto}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default UserRetirtosTable;
