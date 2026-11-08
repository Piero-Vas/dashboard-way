"use client";
import { api } from "@/config/axios.config";
import VehicleMarkModelModals from "@/app/[lang]/(dashboard)/(home)/marca-vehiculos/components/VehicleMarkModelModals";
import DialogConfirm from "@/app/[lang]/(dashboard)/components/dialog-basic";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { Fragment, useEffect, useState } from "react";

type Make = { id: number; name: string };
type Model = { id: number; name: string; makeId: number };

const VehicleTableMarkModel = () => {
  const [makes, setMakes] = useState<Make[]>([]);
  const [collapsedRows, setCollapsedRows] = useState<number[]>([]);
  const [modelsByMake, setModelsByMake] = useState<Record<number, Model[]>>({});
  const [loadingModels, setLoadingModels] = useState<number | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [selectedDelete, setSelectedDelete] = useState<{
    type: "make" | "model";
    id: number;
  } | null>(null);

  const loadMakes = async (reset: boolean) => {
    try {
      const { data } = await api.get("/vehicle-make");
      setMakes(data?.data || []);
      if (reset) {
        setModelsByMake({}); // Limpia los modelos cargados
        setCollapsedRows([]); // Cierra todas las filas colapsadas
      }
    } catch (error) {
      console.error("Error al cargar las marcas:", error);
    }
  };
  const refreshMakes = () => {
    loadMakes(true);
  };
  useEffect(() => {
    loadMakes(false);
  }, []);

  const toggleRow = async (id: number) => {
    if (collapsedRows.includes(id)) {
      setCollapsedRows(collapsedRows.filter((rowId) => rowId !== id));
    } else {
      setCollapsedRows([...collapsedRows, id]);
      if (!modelsByMake[id]) {
        setLoadingModels(id);
        try {
          const { data } = await api.get("/vehicle-model", {
            params: { makeId: id },
          });
          setModelsByMake((prev) => ({
            ...prev,
            [id]: data?.data || [],
          }));
        } catch (error) {
          console.error("Error al cargar los modelos:", error);
        } finally {
          setLoadingModels(null);
        }
      }
    }
  };

  const columns: { key: string; label: string }[] = [
    { key: "nombre", label: "nombre" },
    { key: "acciones", label: "acciones" },
  ];

  const handleConfirmDelete = async () => {
    if (!selectedDelete) return;
    if (selectedDelete.type === "make" && modelsByMake) {
      const makeId = Object.keys(modelsByMake).find((makeId) =>
        modelsByMake[Number(makeId)]?.some((m) => m.id === selectedDelete.id)
      );
      try {
        await api.delete(`/vehicle-make/${selectedDelete.id}`);
        refreshMakes();
      } catch (error) {
        console.error("Error al eliminar la marca:", error);
      }
    } else {
      try {
        await api.delete(`/vehicle-model/${selectedDelete.id}`);
        refreshMakes();
      } catch (error) {
        console.error("Error al eliminar el modelo:", error);
      }
    }
    setDeleteModalOpen(false);
  };

  return (
    <>
      <VehicleMarkModelModals makes={makes} refreshMakes={refreshMakes} />
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.key}>{column.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {makes.map((item) => (
            <Fragment key={item.id}>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={() => toggleRow(item.id)}
                      size="icon"
                      variant="outline"
                      color="secondary"
                      className=" h-7 w-7 border-none rounded-full "
                    >
                      <Icon
                        icon="heroicons:chevron-down"
                        className={cn("h-5 w-5 transition-all duration-300 ", {
                          "rotate-180": collapsedRows.includes(item.id),
                        })}
                      />
                    </Button>
                    <div className="flex gap-3 items-center">
                      <div>
                        <span className=" text-sm  block  text-card-foreground">
                          {item.id} - {item.name}
                        </span>
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className=" text-right">
                  <Button
                    size="icon"
                    variant="outline"
                    color="destructive"
                    className=" h-7 w-7 border-none"
                    onClick={() => {
                      setSelectedDelete({ type: "make", id: item.id });
                      setDeleteModalOpen(true);
                    }}
                  >
                    <Icon icon="heroicons:trash" className=" h-5 w-5  " />
                  </Button>
                </TableCell>
              </TableRow>
              {collapsedRows.includes(item.id) && (
                <>
                  {loadingModels === item.id ? (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <span className="ml-12 text-sm text-muted-foreground">
                          Cargando modelos...
                        </span>
                      </TableCell>
                    </TableRow>
                  ) : modelsByMake[item.id]?.length > 0 ? (
                    modelsByMake[item.id].map((model) => (
                      <TableRow key={model.id}>
                        <TableCell>
                          <div className="flex items-center gap-4 ml-8">
                            <div className="flex gap-3 items-center">
                              <div>
                                <span className=" text-sm  block  text-card-foreground">
                                  {model.name}
                                </span>
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className=" text-right">
                          <Button
                            size="icon"
                            variant="outline"
                            color="destructive"
                            className=" h-7 w-7 border-none"
                            onClick={() => {
                              setSelectedDelete({
                                type: "model",
                                id: model.id,
                              });
                              setDeleteModalOpen(true);
                            }}
                          >
                            <Icon
                              icon="heroicons:trash"
                              className=" h-5 w-5  "
                            />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={2}>
                        <span className="ml-12 text-sm text-muted-foreground">
                          Sin modelos
                        </span>
                      </TableCell>
                    </TableRow>
                  )}
                </>
              )}
            </Fragment>
          ))}
        </TableBody>
      </Table>
      <DialogConfirm
        title="Eliminar Marca"
        descripcion="¿Estás seguro de que deseas eliminar esta marca?"
        open={deleteModalOpen}
        onOpenChange={setDeleteModalOpen}
        onSave={handleConfirmDelete}
      />
    </>
  );
};

export default VehicleTableMarkModel;
