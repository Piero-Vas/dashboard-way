"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createDriverRequirements } from "@/services/driver-requirement.service";
import { UserPlus } from "lucide-react";
import React, { useState } from "react";

interface CreateDriverDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function CreateDriverDialog({
  open,
  onOpenChange,
  onSuccess,
}: CreateDriverDialogProps) {
  const [idUser, setIdUser] = useState("");
  const [documentNumber, setDocumentNumber] = useState("");
  const [vehicleType, setVehicleType] = useState("CAR");
  const [licensePlate, setLicensePlate] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [color, setColor] = useState("");
  const [yearManufacture, setYearManufacture] = useState(
    new Date().getFullYear().toString()
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!idUser || !documentNumber || !licensePlate) return;

    setIsSubmitting(true);
    try {
      const payload = {
        idUser: Number(idUser),
        vehicleType,
        licensePlate,
        brand: brand || "Toyota",
        model: model || "Yaris",
        color: color || "Negro",
        yearManufacture,
        documentNumber,
        licensePath: "https://via.placeholder.com/300",
        criminalRecordPath: "https://via.placeholder.com/300",
        vehiclePhotoPath: "https://via.placeholder.com/300",
        insuranceTrafficAccidentsPath: "https://via.placeholder.com/300",
      };

      await createDriverRequirements(payload);
      onSuccess();
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error("Error registrando conductor:", error);
      alert("Error al registrar conductor. Asegúrate de que el ID de usuario exista.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setIdUser("");
    setDocumentNumber("");
    setLicensePlate("");
    setBrand("");
    setModel("");
    setColor("");
    setYearManufacture(new Date().getFullYear().toString());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Registrar Conductor Manualmente
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">ID de Usuario Registrado *</Label>
              <Input
                type="number"
                placeholder="Ej: 15"
                value={idUser}
                onChange={(e) => setIdUser(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">N° DNI / Documento *</Label>
              <Input
                placeholder="Ej: 71234567"
                value={documentNumber}
                onChange={(e) => setDocumentNumber(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Tipo Vehículo</Label>
              <Select value={vehicleType} onValueChange={setVehicleType}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="CAR">Automóvil (CAR)</SelectItem>
                  <SelectItem value="MOTORCYCLE">Motocicleta (MOTORCYCLE)</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Placa de Vehículo *</Label>
              <Input
                placeholder="Ej: ABC-123"
                value={licensePlate}
                onChange={(e) => setLicensePlate(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Marca</Label>
              <Input
                placeholder="Ej: Toyota"
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Modelo</Label>
              <Input
                placeholder="Ej: Yaris"
                value={model}
                onChange={(e) => setModel(e.target.value)}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold">Color</Label>
              <Input
                placeholder="Ej: Rojo"
                value={color}
                onChange={(e) => setColor(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter className="mt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting || !idUser || !licensePlate}>
              {isSubmitting ? "Registrando..." : "Registrar Conductor"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
