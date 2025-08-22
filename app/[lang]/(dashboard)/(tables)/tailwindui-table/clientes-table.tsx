"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
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
import { ActionModalDialog } from "@/lib/enums";
import { getIconModalDialog } from "@/lib/utils";
import { UserRequestsTableProps } from "@/types/user-request.table-props.interface";
import { User } from "@/types/user.interface";
import { Icon } from "@iconify/react";
import Link from "next/link";
import { useState } from "react";
import DialogConfirm from "../../components/dialog-basic";

const UserTableStatus: React.FC<UserRequestsTableProps> = ({
  users: users,
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

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
      label: "",
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

                {/* <TableCell className="flex justify-end">
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
              </TableCell> */}
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

                      <Link href={`/clientes/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.VIEW)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.VIEW}
                        </DropdownMenuItem>
                      </Link>
                      <Link href={`/clientes/editar/${item.id}`}>
                        <DropdownMenuItem preventClose>
                          <Icon
                            icon={getIconModalDialog(ActionModalDialog.EDIT)}
                            className=" h-4 w-4 mr-2 "
                          />
                          {ActionModalDialog.EDIT}
                        </DropdownMenuItem>
                      </Link>
                      <DropdownMenuItem
                        preventClose
                        onClick={() => handleOpenDialog(item.id)}
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

export default UserTableStatus;
