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

const IncidenciasTable = () => {
  const columns: { key: string; label: string }[] = [
    {
      key: "user",
      label: "Perfil",
    },
    {
      key: "email",
      label: "Correo",
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
          {users.map((item) => (
            <TableRow key={item.email} className="hover:bg-default-100">
              <TableCell className=" font-medium  text-card-foreground/80">
                <div className="flex gap-3 items-center">
                  <Avatar className="rounded-lg">
                    <AvatarImage src={item.avatar} />
                    <AvatarFallback>AB</AvatarFallback>
                  </Avatar>
                  <span className="text-sm  text-default-600">{item.name}</span>
                </div>
              </TableCell>
              <TableCell>{item.email}</TableCell>

              <TableCell>
                <Switch defaultChecked={item.status} id={item.email} />
              </TableCell>
              <TableCell className="flex justify-end">
                <div className="flex gap-3">
                  <EditingDialog item={item} />
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        size="icon"
                        variant="outline"
                        className=" h-7 w-7"
                        color="secondary"
                      >
                        <Icon icon="heroicons:trash" className=" h-4 w-4  " />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          ¿Estás completamente seguro?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          Esta acción no se puede deshacer. Eliminará
                          permanentemente su cuenta y eliminará sus datos de
                          nuestros servidores.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className=" bg-secondary">
                          Cancelar
                        </AlertDialogCancel>
                        <AlertDialogAction className="bg-destructive hover:bg-destructive/80">
                          Confirmar
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );
};

export default IncidenciasTable;
const EditingDialog = ({ item }: { item: DataRows }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          color="secondary"
          className=" h-7 w-7"
        >
          <Icon icon="heroicons:pencil" className=" h-4 w-4  " />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Item</DialogTitle>
          <form action="#" className=" space-y-5 pt-4">
            <div>
              <Label className="mb-2">Foto</Label>
              <Avatar className="rounded-lg">
                <AvatarImage src={item.avatar} />
                <AvatarFallback>AB</AvatarFallback>
              </Avatar>
            </div>
            <div>
              <Label className="mb-2">Nombre</Label>
              <Input placeholder="Nombre" defaultValue={item.name} />
            </div>
            <div>
              <Label className="mb-2">Correo</Label>
              <Input placeholder="Correo" defaultValue={item.email} />
            </div>
            <div className="flex justify-between">
              <Label className="mb-2">Estado</Label>
              <Switch defaultChecked={item.status} id={item.email} />
            </div>
            <div className="flex justify-end space-x-3">
              <DialogClose asChild>
                <Button type="button" variant="outline" color="destructive">
                  Cancel
                </Button>
              </DialogClose>
              <DialogClose asChild>
                <Button color="success">Save</Button>
              </DialogClose>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
