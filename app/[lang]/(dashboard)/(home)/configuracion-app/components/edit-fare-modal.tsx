"use client";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { DistanceRule, Fare } from "@/types/dashboard-data.interface";
import { useEffect, useState } from "react";

interface EditFareModalProps {
  fare: Fare | null;
  isOpen: boolean;
  onSave: (fare: Fare) => void;
  onCancel: () => void;
}

export function EditFareModal({
  fare,
  isOpen,
  onSave,
  onCancel,
}: EditFareModalProps) {
  const [formData, setFormData] = useState<Fare | null>(null);

  useEffect(() => {
    if (fare) {
      setFormData({ ...fare, distanceRules: [...fare.distanceRules] });
    }
  }, [fare]);

  const handleInputChange = (field: keyof Fare, value: any) => {
    if (!formData) return;
    setFormData({ ...formData, [field]: value });
  };

  const handleDistanceRuleChange = (
    index: number,
    field: keyof DistanceRule,
    value: any
  ) => {
    if (!formData) return;
    const updatedRules = [...formData.distanceRules];
    updatedRules[index] = { ...updatedRules[index], [field]: value };
    setFormData({ ...formData, distanceRules: updatedRules });
  };

  const handleSave = () => {
    if (!formData) return;
    onSave(formData);
    console.log("Fare saved:", formData);
  };

  if (!formData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onCancel}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Tarifa</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label htmlFor="basePrice">Precio Base ($)</Label>
              <Input
                id="basePrice"
                type="number"
                step="0.01"
                value={formData.basePrice}
                onChange={(e) => handleInputChange("basePrice", e.target.value)}
              />
            </div>
          </div>

          <Separator />

          {/* Reglas de distancia */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Reglas de Distancia</h3>
            </div>

            {formData.distanceRules.map((rule, index) => (
              <div
                key={rule.id}
                className="grid grid-cols-3 gap-3 items-end p-4 border rounded-lg"
              >
                <div className="space-y-2">
                  <Label>Km Mínimo</Label>
                  <Input
                    type="number"
                    value={rule.minKm}
                    onChange={(e) =>
                      handleDistanceRuleChange(index, "minKm", e.target.value)
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Km Máximo</Label>
                  <Input
                    type="number"
                    value={rule.maxKm || ""}
                    placeholder="Sin límite"
                    onChange={(e) =>
                      handleDistanceRuleChange(
                        index,
                        "maxKm",
                        e.target.value || null
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>Precio por Km ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={rule.pricePerKm}
                    onChange={(e) =>
                      handleDistanceRuleChange(
                        index,
                        "pricePerKm",
                        e.target.value
                      )
                    }
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button onClick={handleSave}>Guardar Cambios</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
