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
const DriverAllTable: React.FC<DriverAllTableProps> = ({ drivers }) => {
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

                    <Link href={`/conductores/${item.userId}`}>
                      <DropdownMenuItem>
                        <Icon icon="heroicons:eye" className=" h-4 w-4 mr-2 " />
                        Ver
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuItem>
                      <Icon icon="heroicons:trash" className=" h-4 w-4 mr-2 " />
                      Eliminar
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell> */}
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Link href={`/conductores/${item.userId}`}>
                        <Button
                          size="icon"
                          variant="outline"
                          className="h-7 w-7"
                        >
                          <Icon icon="heroicons:eye" className="h-4 w-4" />
                        </Button>
                      </Link>
                    </DialogTrigger>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default DriverAllTable;
