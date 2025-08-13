"use client";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import Link from "next/link";
import { useState } from "react";
import Flatpickr from "react-flatpickr";
const DialogForm = () => {
  const [picker, setPicker] = useState<Date>(new Date());
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Agregar Administrador</Button>
      </DialogTrigger>
      <DialogContent size="2xl">
        <DialogHeader className="p-0">
          <DialogTitle className="text-base font-medium text-default-700 ">
            Crea cuenta Administrador
          </DialogTitle>
        </DialogHeader>
        <div>
          <div className="h-[390px]">
            <ScrollArea className="h-full">
              <div className="sm:grid  sm:grid-cols-1  sm:gap-5 space-y-4 sm:space-y-0">
                <div className="flex flex-col gap-2">
                  <Label>Usuario</Label>
                  <Input type="text" placeholder="Ingresa nombre de usuario" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Contraseña</Label>
                  <Input type="password" placeholder="Ingresa contraseña" />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Correo</Label>
                  <Input
                    type="email"
                    placeholder="Ingresa correo electronico"
                  />
                </div>
                <div className="flex flex-col gap-2">
                  <Label>Foto</Label>
                  <Input type="file" placeholder="" />
                </div>
              </div>
            </ScrollArea>
          </div>

          <div className=" flex justify-center gap-3 mt-4">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <Button type="button">Crear Administrador </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DialogForm;
