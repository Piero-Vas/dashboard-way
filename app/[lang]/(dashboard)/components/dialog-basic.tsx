import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import React, { useState, useEffect } from "react";

interface DialogConfirmProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (reason?: string) => void;
  title?: string;
  descripcion?: string;
  requireReason?: boolean;
  reasonPlaceholder?: string;
  confirmText?: string;
}

export default function DialogConfirm({
  open,
  onOpenChange,
  onSave,
  title,
  descripcion,
  requireReason = false,
  reasonPlaceholder = "Escribe el motivo de esta acción...",
  confirmText = "Confirmar",
}: DialogConfirmProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const handleSave = async () => {
    if (requireReason && !reason.trim()) return;
    await onSave(reason.trim());
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-6 max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold">
            {title ? title : "Confirmar Acción"}
          </DialogTitle>
        </DialogHeader>
        <p className="text-sm text-muted-foreground my-2">
          {descripcion
            ? descripcion
            : "¿Estás seguro de que deseas realizar esta acción?"}
        </p>

        {requireReason && (
          <div className="space-y-2 my-3">
            <Label className="text-xs font-semibold text-foreground">
              Motivo de la acción <span className="text-destructive">*</span>
            </Label>
            <Textarea
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder={reasonPlaceholder}
              rows={3}
              className="text-xs sm:text-sm resize-none"
            />
          </div>
        )}

        <DialogFooter className="flex justify-end gap-3 mt-4">
          <Button
            variant="outline"
            color="secondary"
            onClick={() => onOpenChange(false)}
          >
            Cancelar
          </Button>
          <Button
            color="destructive"
            disabled={requireReason && !reason.trim()}
            onClick={handleSave}
          >
            {confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
