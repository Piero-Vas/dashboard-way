"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { UserRequestsTableProps } from "@/types/user-request.table-props.interface";
import { User } from "@/types/user.interface";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";

const UserTableStatus: React.FC<UserRequestsTableProps> = ({
  users: users,
}) => {
  const columns: { key: string; label: string }[] = [
    {
      key: "Conductor",
      label: "Usuario",
    },
    {
      key: "Telefono",
      label: "Teléfono",
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
          {users.map((item: User) => (
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
              <TableCell>{item.mobile}</TableCell>

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
                  <Dialog>
                    <DialogTrigger asChild>
                      <Link href={`/clientes/${item.id}`}>
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

export default UserTableStatus;
