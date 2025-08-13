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
import { useFetchAllTripsByUser } from "@/hooks/use-fetch-user-requirement";
import { Trip } from "@/types/user.interface";
const UserTripTable = ({ id, role }: { id: number; role: string }) => {
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

  const {
    trips,
    loading: loadingTrips,
    error: errorTrips,
  } = useFetchAllTripsByUser(Number(id), role);

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
          {trips?.trips.map((item: Trip) => (
            <TableRow key={item.pickupLocation.name}>
              <TableCell className="font-medium  text-card-foreground/80">
                {item.pickupLocation.name}
              </TableCell>
              <TableCell className="font-medium  text-card-foreground/80">
                {item.dropoffLocations[0].name}
              </TableCell>

              <TableCell className="ltr:pr-5 rtl:pl-5">
                {" "}
                {item.amount}
              </TableCell>
              <TableCell>{item.createdAt.split("T")[0]}</TableCell>
              <TableCell className="ltr:pr-5 rtl:pl-5">
                <Link
                  href={`/viajes/${item.id}?createdAt=${encodeURIComponent(
                    item.createdAt
                  )}`}
                >
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
