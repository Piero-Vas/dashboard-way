import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { getAccessToken } from "../../constants";

type Make = { id: number; name: string };

interface Props {
  makes: Make[];
  refreshMakes: () => void;
}

const keyRide = getAccessToken();

const VehicleMarkModelModals = ({ makes, refreshMakes }: Props) => {
  const [openMarca, setOpenMarca] = useState(false);
  const [openModelo, setOpenModelo] = useState(false);
  const [marcaNombre, setMarcaNombre] = useState("");
  const [modeloNombre, setModeloNombre] = useState("");
  const [marcaSeleccionada, setMarcaSeleccionada] = useState<
    number | undefined
  >(undefined);
  const [loadingAdd, setLoadingAdd] = useState(false);

  // Agregar marca
  const handleAddMarca = async () => {
    if (!marcaNombre) return;
    setLoadingAdd(true);
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/vehicle-make`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyRide}`,
      },
      body: JSON.stringify({ name: marcaNombre }),
    });
    setMarcaNombre("");
    setOpenMarca(false);
    setLoadingAdd(false);
    refreshMakes();
  };

  // Agregar modelo
  const handleAddModelo = async () => {
    if (!modeloNombre || !marcaSeleccionada) return;
    setLoadingAdd(true);
    await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/vehicle-model`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${keyRide}`,
      },
      body: JSON.stringify({ name: modeloNombre, makeId: marcaSeleccionada }),
    });
    setModeloNombre("");
    setMarcaSeleccionada(undefined);
    setOpenModelo(false);
    setLoadingAdd(false);
    // Opcional: podrías refrescar modelos aquí si lo necesitas
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <div className="text-2xl font-medium">
          Marcas y modelos de vehículos
        </div>
        <div className="flex gap-2 mb-4">
          <Button onClick={() => setOpenMarca(true)}>Agregar Marca</Button>
          <Button onClick={() => setOpenModelo(true)}>Agregar Modelo</Button>
        </div>
      </div>

      {/* Modal Marca */}
      <Dialog open={openMarca} onOpenChange={setOpenMarca}>
        <DialogContent>
          <Label>Nombre de la marca</Label>
          <Input
            value={marcaNombre}
            onChange={(e) => setMarcaNombre(e.target.value)}
            placeholder="Ej: Toyota"
          />
          <Button
            onClick={handleAddMarca}
            disabled={loadingAdd || !marcaNombre}
          >
            {loadingAdd ? "Guardando..." : "Guardar"}
          </Button>
        </DialogContent>
      </Dialog>

      {/* Modal Modelo */}
      <Dialog open={openModelo} onOpenChange={setOpenModelo}>
        <DialogContent>
          <Label>Marca</Label>
          <select
            className="w-full border rounded p-2 mb-2"
            value={marcaSeleccionada ?? ""}
            onChange={(e) => setMarcaSeleccionada(Number(e.target.value))}
          >
            <option value="" disabled>
              Selecciona una marca
            </option>
            {makes.map((m) => (
              <option key={m.id} value={m.id}>
                {m.name}
              </option>
            ))}
          </select>
          <Label>Nombre del modelo</Label>
          <Input
            value={modeloNombre}
            onChange={(e) => setModeloNombre(e.target.value)}
            placeholder="Ej: Corolla"
          />
          <Button
            onClick={handleAddModelo}
            disabled={loadingAdd || !modeloNombre || !marcaSeleccionada}
          >
            {loadingAdd ? "Guardando..." : "Guardar"}
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default VehicleMarkModelModals;
