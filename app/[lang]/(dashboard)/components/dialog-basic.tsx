import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import React from "react";

interface DialogConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: () => void;
  title?: string;
  descripcion?: string;
}

export default function DialogConfirm({
  open,
  onOpenChange,
  onSave,
  title,
  descripcion,
}: DialogConfirmProps) {
  const handleSave = async () => {
    await onSave();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 max-w-md text-center">
        <h2 className="text-lg font-semibold mb-4">
          {title ? title : "Confirmar Acción"}
        </h2>
        <p className="text-gray-600 mb-6">
          {descripcion
            ? descripcion
            : "¿Estás seguro de que deseas realizar esta acción?"}
        </p>
        <div className="flex justify-center gap-4">
          <Button
            variant="outline"
            color="destructive"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button color="success" onClick={handleSave}>
            Confirmar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
