"use client";

import type React from "react";

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
import { app } from "@/firebaseClient";
import type { EditableVehicleData } from "@/types/user.interface";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Calendar,
  Car,
  FileText,
  ImageIcon,
  Loader2,
  PaintBucket,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

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

export function VehiculoEditForm({
  initialData,
  onSave,
  onCancel,
}: VehiculoEditFormProps) {
  const [formData, setFormData] = useState<EditableVehicleData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingRequirement, setUploadingRequirement] = useState<
    string | null
  >(null);
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

  const fileInputRef = useRef<HTMLInputElement>(null);
  const requirementFileInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  const handleInputChange = (
    field: keyof EditableVehicleData,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
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
    const dataSend = {
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

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedTypes.includes(file.type)) {
      alert(
        "Por favor selecciona un archivo de imagen válido (JPEG, PNG, GIF, WebP)"
      );
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert(
        "El archivo es demasiado grande. Por favor selecciona una imagen menor a 5MB."
      );
      return;
    }

    setIsUploadingImage(true);

    try {
      const storageRef = ref(
        storage,
        `profile-images/${Date.now()}-${file.name}`
      );
      await uploadBytes(storageRef, file);
      const url = await getDownloadURL(storageRef);

      setFormData((prev) => ({
        ...prev,
        profilePictureUrl: url,
      }));

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error al subir la imagen. Por favor intenta de nuevo.");
    } finally {
      setIsUploadingImage(false);
    }
  };

  const handleRequirementUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
    requirementId: string
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];
    if (!allowedTypes.includes(file.type)) {
      alert("Por favor selecciona un archivo válido (JPEG, PNG)");
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      alert(
        "El archivo es demasiado grande. Por favor selecciona un archivo menor a 10MB."
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
      console.error("Error uploading requirement:", error);
      alert("Error al subir el archivo. Por favor intenta de nuevo.");
    } finally {
      setUploadingRequirement(null);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerRequirementFileInput = (requirementId: string) => {
    requirementFileInputRefs.current[requirementId]?.click();
  };

  return (
    <form onSubmit={handleSubmit}>
      <Card className="w-full   mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Car className="h-5 w-5" />
            Editar Datos del Vehículo
          </CardTitle>
          <CardDescription>
            Actualiza la información del vehículo
          </CardDescription>
        </CardHeader>
        <div className="flex w-full  flex-col md:flex-row ">
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
                    type="text"
                    placeholder="2025"
                    value={formData.year}
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
                  <Input
                    id="vehicleMake"
                    type="text"
                    placeholder="Marca"
                    value={formData.vehicleMake.name}
                    onChange={(e) =>
                      handleInputChange("vehicleMake", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="vehicleModel"
                    className="flex items-center gap-2"
                  >
                    <Car className="h-4 w-4" />
                    Modelo
                  </Label>
                  <Input
                    id="vehicleModel"
                    type="text"
                    placeholder="Modelo"
                    value={formData.vehicleModel.name}
                    onChange={(e) =>
                      handleInputChange("vehicleModel", e.target.value)
                    }
                    required
                  />
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
                  <Input
                    id="vehicleColor"
                    type="text"
                    placeholder="Color"
                    value={formData.vehicleColor}
                    onChange={(e) =>
                      handleInputChange("vehicleColor", e.target.value)
                    }
                    required
                  />
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
              <div className="grid grid-cols-2 gap-4">
                {driverRequirements.map((requirement) => (
                  <div
                    key={requirement.id}
                    className="space-y-3 p-4 border rounded-lg"
                  >
                    <Label className="flex items-center gap-2 text-sm font-medium">
                      {requirement.icon}
                      {requirement.label}
                    </Label>

                    <div className="aspect-square w-full bg-muted rounded-lg flex items-center justify-center overflow-hidden">
                      {requirement.url ? (
                        <img
                          src={requirement.url || "/placeholder.svg"}
                          alt={requirement.label}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-2 text-muted-foreground">
                          <ImageIcon className="h-8 w-8" />
                          <span className="text-xs text-center">
                            Sin imagen
                          </span>
                        </div>
                      )}
                    </div>

                    <Input
                      type="url"
                      placeholder="https://ejemplo.com/documento.jpg"
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
