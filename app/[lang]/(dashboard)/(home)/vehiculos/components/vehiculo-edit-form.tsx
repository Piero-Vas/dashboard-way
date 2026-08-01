"use client";

import type React from "react";
import { useEffect, useRef, useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { app } from "@/firebaseClient";
import {
  fetchVehicleMakes,
  fetchVehicleModelsByMake,
} from "@/services/driver-requirement.service";
import type { EditableVehicleData } from "@/types/user.interface";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Calendar,
  Car,
  ExternalLink,
  FileText,
  ImageIcon,
  Loader2,
  PaintBucket,
  Upload,
} from "lucide-react";

interface VehiculoEditFormProps {
  initialData: EditableVehicleData;
  onSave: (data: EditableVehicleData) => void;
  onCancel: () => void;
}

interface DriverRequirement {
  id: string;
  label: string;
  icon: React.ReactNode;
  url: string;
}

const storage = getStorage(app);

const COLOR_OPTIONS = [
  { value: "WHITE", label: "Blanco" },
  { value: "BLACK", label: "Negro" },
  { value: "GRAY", label: "Gris" },
  { value: "RED", label: "Rojo" },
  { value: "BLUE", label: "Azul" },
  { value: "YELLOW", label: "Amarillo" },
  { value: "BEIGE", label: "Beige" },
  { value: "BROWN", label: "Marrón" },
  { value: "GREEN", label: "Verde" },
];

const isPdfUrl = (url?: string): boolean => {
  if (!url) return false;
  const cleanUrl = url.toLowerCase();
  return (
    cleanUrl.includes(".pdf") ||
    cleanUrl.includes("application/pdf") ||
    cleanUrl.includes("format=pdf")
  );
};

export function VehiculoEditForm({
  initialData,
  onSave,
  onCancel,
}: VehiculoEditFormProps) {
  const [formData, setFormData] = useState<EditableVehicleData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadingRequirement, setUploadingRequirement] = useState<
    string | null
  >(null);

  const [makes, setMakes] = useState<{ id: number; name: string }[]>([]);
  const [models, setModels] = useState<{ id: number; name: string }[]>([]);
  const [loadingMakes, setLoadingMakes] = useState(false);
  const [loadingModels, setLoadingModels] = useState(false);

  const [driverRequirements, setDriverRequirements] = useState<
    DriverRequirement[]
  >([
    {
      id: "vehiclePhotoUrl",
      label: "Foto del vehículo",
      icon: <Car className="h-4 w-4" />,
      url: initialData.vehiclePhotoUrl || "",
    },
    {
      id: "insuranceTrafficAccidentsUrl",
      label: "SOAT",
      icon: <FileText className="h-4 w-4" />,
      url: initialData.insuranceTrafficAccidentsUrl || "",
    },
  ]);

  const requirementFileInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  useEffect(() => {
    const loadMakes = async () => {
      setLoadingMakes(true);
      try {
        const res = await fetchVehicleMakes();
        if (res && res.data) {
          setMakes(res.data);
        }
      } catch (err) {
        console.error("Error al cargar marcas:", err);
      } finally {
        setLoadingMakes(false);
      }
    };
    loadMakes();
  }, []);

  useEffect(() => {
    if (formData.vehicleMakeId) {
      const loadModels = async () => {
        setLoadingModels(true);
        try {
          const res = await fetchVehicleModelsByMake(formData.vehicleMakeId);
          if (res && res.data) {
            setModels(res.data);
          }
        } catch (err) {
          console.error("Error al cargar modelos:", err);
        } finally {
          setLoadingModels(false);
        }
      };
      loadModels();
    } else {
      setModels([]);
    }
  }, [formData.vehicleMakeId]);

  const handleInputChange = (
    field: keyof EditableVehicleData,
    value: string | number
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleMakeChange = (makeIdStr: string) => {
    const makeId = Number(makeIdStr);
    setFormData((prev) => ({
      ...prev,
      vehicleMakeId: makeId,
      vehicleModelId: 0,
    }));
  };

  const handleModelChange = (modelIdStr: string) => {
    const modelId = Number(modelIdStr);
    setFormData((prev) => ({
      ...prev,
      vehicleModelId: modelId,
    }));
  };

  const handleRequirementUrlChange = (requirementId: string, url: string) => {
    setDriverRequirements((prev) =>
      prev.map((req) => (req.id === requirementId ? { ...req, url } : req))
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    const dataSend: EditableVehicleData = {
      ...formData,
      insuranceTrafficAccidentsUrl:
        driverRequirements.find(
          (req) => req.id === "insuranceTrafficAccidentsUrl"
        )?.url || "",
      vehiclePhotoUrl:
        driverRequirements.find((req) => req.id === "vehiclePhotoUrl")?.url ||
        "",
    };
    try {
      await onSave(dataSend);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRequirementUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    requirementId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/webp",
      "application/pdf",
    ];
    if (!allowedTypes.includes(file.type)) {
      console.error(
        "Archivo no válido:",
        file.type,
        "Por favor selecciona un archivo JPEG, PNG, WEBP o PDF"
      );
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      console.error(
        "Archivo demasiado grande:",
        file.size,
        "El tamaño máximo es 10MB"
      );
      return;
    }

    setUploadingRequirement(requirementId);

    try {
      const storageRef = ref(
        storage,
        `driver-requirements/${requirementId}/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      handleRequirementUrlChange(requirementId, url);

      if (requirementFileInputRefs.current[requirementId]) {
        requirementFileInputRefs.current[requirementId]!.value = "";
      }
    } catch (error) {
      console.error("Error al subir el archivo:", error);
    } finally {
      setUploadingRequirement(null);
    }
  };

  const triggerRequirementFileInput = (requirementId: string) => {
    requirementFileInputRefs.current[requirementId]?.click();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Editar Datos del Vehículo
          </CardTitle>
          <CardDescription>
            Actualiza la información del vehículo
          </CardDescription>
        </CardHeader>
        <div className="flex w-full flex-col md:flex-row">
          <div className="w-full md:w-1/2">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="plateNumber"
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    Número de Placa
                  </Label>
                  <Input
                    id="plateNumber"
                    type="text"
                    placeholder="123-ABC"
                    value={formData.plateNumber}
                    onChange={(e) =>
                      handleInputChange("plateNumber", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Año de Fabricación
                  </Label>
                  <Input
                    id="year"
                    type="number"
                    placeholder="2025"
                    value={formData.year || ""}
                    onChange={(e) => handleInputChange("year", e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="vehicleMake"
                    className="flex items-center gap-2"
                  >
                    <Car className="h-4 w-4" />
                    Marca
                  </Label>
                  <Select
                    value={
                      formData.vehicleMakeId
                        ? String(formData.vehicleMakeId)
                        : ""
                    }
                    onValueChange={handleMakeChange}
                    disabled={loadingMakes}
                  >
                    <SelectTrigger id="vehicleMake">
                      <SelectValue placeholder="Seleccionar marca" />
                    </SelectTrigger>
                    <SelectContent>
                      {makes.map((make) => (
                        <SelectItem key={make.id} value={String(make.id)}>
                          {make.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="vehicleModel"
                    className="flex items-center gap-2"
                  >
                    <Car className="h-4 w-4" />
                    Modelo
                  </Label>
                  <Select
                    value={
                      formData.vehicleModelId
                        ? String(formData.vehicleModelId)
                        : ""
                    }
                    onValueChange={handleModelChange}
                    disabled={loadingModels || !formData.vehicleMakeId}
                  >
                    <SelectTrigger id="vehicleModel">
                      <SelectValue placeholder="Seleccionar modelo" />
                    </SelectTrigger>
                    <SelectContent>
                      {models.map((model) => (
                        <SelectItem key={model.id} value={String(model.id)}>
                          {model.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="vehicleColor"
                    className="flex items-center gap-2"
                  >
                    <PaintBucket className="h-4 w-4" />
                    Color
                  </Label>
                  <Select
                    value={formData.vehicleColor || ""}
                    onValueChange={(val) =>
                      handleInputChange("vehicleColor", val)
                    }
                  >
                    <SelectTrigger id="vehicleColor">
                      <SelectValue placeholder="Seleccionar color" />
                    </SelectTrigger>
                    <SelectContent>
                      {COLOR_OPTIONS.map((color) => (
                        <SelectItem key={color.value} value={color.value}>
                          {color.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-4">
                <Button type="submit" className="flex-1" disabled={isLoading}>
                  {isLoading ? "Guardando..." : "Guardar Cambios"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="flex-1 bg-transparent"
                  disabled={isLoading}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </div>

          <div className="w-full md:w-1/2">
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {driverRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="space-y-3 p-4 border rounded-lg"
                  >
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      {requirement.icon}
                      {requirement.label}
                    </Label>

                    <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden relative">
                      {requirement.url ? (
                        isPdfUrl(requirement.url) ? (
                          <div className="flex flex-col items-center justify-center gap-3 p-4 text-center w-full h-full bg-slate-50 dark:bg-slate-900 border rounded-lg">
                            <FileText className="h-12 w-12 text-primary" />
                            <span className="text-xs font-medium line-clamp-2 px-2 text-foreground">
                              Documento PDF ({requirement.label})
                            </span>
                            <a
                              href={requirement.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 text-xs bg-primary text-primary-foreground px-3 py-1.5 rounded-md hover:bg-primary/90 transition-colors"
                            >
                              <ExternalLink className="h-3.5 w-3.5" />
                              Ver Documento
                            </a>
                          </div>
                        ) : (
                          <img
                            src={requirement.url}
                            alt={requirement.label}
                            className="w-full h-full object-cover"
                          />
                        )
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs text-center">
                            Sin imagen / archivo
                          </span>
                        </div>
                      )}
                    </div>

                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/documento.pdf"
                      value={requirement.url}
                      onChange={(e) =>
                        handleRequirementUrlChange(
                          requirement.id,
                          e.target.value
                        )
                      }
                      className="text-xs"
                    />

                    {/* Upload button */}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        triggerRequirementFileInput(requirement.id)
                      }
                      disabled={uploadingRequirement === requirement.id}
                      className="w-full"
                    >
                      {uploadingRequirement === requirement.id ? (
                        <>
                          <Loader2 className="h-3 w-3 mr-2 animate-spin" />
                          Subiendo...
                        </>
                      ) : (
                        <>
                          <Upload className="h-3 w-3 mr-2" />
                          Subir
                        </>
                      )}
                    </Button>

                    {/* Hidden file input */}
                    <input
                      ref={(el) => {
                        requirementFileInputRefs.current[requirement.id] = el;
                      }}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp,application/pdf"
                      onChange={(e) =>
                        handleRequirementUpload(e, requirement.id)
                      }
                      className="hidden"
                    />
                  </div>
                ))}
              </div>
            </CardContent>
          </div>
        </div>
      </Card>
    </form>
  );
}
