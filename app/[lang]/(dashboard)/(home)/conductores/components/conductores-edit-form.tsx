"use client";

import type React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
import type { EditableDriverData } from "@/types/user.interface";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import {
  Car,
  CreditCard,
  FileText,
  ImageIcon,
  Loader2,
  Mail,
  Phone,
  Upload,
  User,
} from "lucide-react";
import { useRef, useState } from "react";

interface ConductorEditFormProps {
  initialData: EditableDriverData;
  onSave: (data: EditableDriverData) => void;
  onCancel: () => void;
}

interface DriverRequirement {
  id: string;
  label: string;
  icon: React.ReactNode;
  url: string;
}

const storage = getStorage(app);

export function ConductorEditForm({
  initialData,
  onSave,
  onCancel,
}: ConductorEditFormProps) {
  const [formData, setFormData] = useState<EditableDriverData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [uploadingRequirement, setUploadingRequirement] = useState<
    string | null
  >(null);
  const [driverRequirements, setDriverRequirements] = useState<
    DriverRequirement[]
  >([
    {
      id: "identityDocumentUrl",
      label: "Documento de identidad",
      icon: <CreditCard className="h-4 w-4" />,
      url: initialData.identityDocumentUrl || "",
    },
    {
      id: "identityDocumentReverseUrl",
      label: "Documento de identidad (Reversa)",
      icon: <CreditCard className="h-4 w-4" />,
      url: initialData.identityDocumentReverseUrl || "",
    },
    {
      id: "driverLicenseUrl",
      label: "Licencia de conducir",
      icon: <CreditCard className="h-4 w-4" />,
      url: initialData.driverLicenseUrl || "",
    },
    {
      id: "criminalRecordUrl",
      label: "Antecedentes penales",
      icon: <FileText className="h-4 w-4" />,
      url: initialData.criminalRecordUrl || "",
    },
  ]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const requirementFileInputRefs = useRef<{
    [key: string]: HTMLInputElement | null;
  }>({});

  const handleInputChange = (
    field: keyof EditableDriverData,
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
      identityDocumentUrl:
        driverRequirements.find((req) => req.id === "identityDocumentUrl")
          ?.url || "",
      identityDocumentReverseUrl:
        driverRequirements.find(
          (req) => req.id === "identityDocumentReverseUrl"
        )?.url || "",
      driverLicenseUrl:
        driverRequirements.find((req) => req.id === "driverLicenseUrl")?.url ||
        "",
      criminalRecordUrl:
        driverRequirements.find((req) => req.id === "criminalRecordUrl")?.url ||
        "",
    };
    try {
      await onSave(dataSend);
    } finally {
      setIsLoading(false);
    }
  };

  const getInitials = () => {
    return `${formData.firstName.charAt(0)}${formData.lastName.charAt(
      0
    )}`.toUpperCase();
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
        <div className="flex w-full  flex-col md:flex-row ">
          <div className="w-full md:w-1/2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Editar Perfil de Conductor
              </CardTitle>
              <CardDescription>
                Actualiza la información personal y configuración del conductor
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-6">
              <div className="flex flex-col items-center space-y-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src={formData.profilePictureUrl || undefined} />
                  <AvatarFallback className="text-lg">
                    {getInitials()}
                  </AvatarFallback>
                </Avatar>

                <div className="flex flex-col space-y-2 w-full max-w-sm">
                  <Label
                    htmlFor="profilePicture"
                    className="flex items-center gap-2"
                  >
                    <ImageIcon className="h-4 w-4" />
                    URL de Foto de Perfil
                  </Label>
                  <Input
                    id="profilePicture"
                    type="url"
                    placeholder="https://ejemplo.com/foto.jpg"
                    value={formData.profilePictureUrl}
                    onChange={(e) =>
                      handleInputChange("profilePictureUrl", e.target.value)
                    }
                  />

                  <div className="flex flex-col space-y-2">
                    <div className="text-sm text-muted-foreground text-center">
                      o
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={triggerFileInput}
                      disabled={isUploadingImage}
                      className="w-full bg-transparent"
                    >
                      {isUploadingImage ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Subiendo imagen...
                        </>
                      ) : (
                        <>
                          <Upload className="h-4 w-4 mr-2" />
                          Subir Imagen
                        </>
                      )}
                    </Button>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                    <p className="text-xs text-muted-foreground text-center">
                      Formatos: JPEG, PNG, GIF, WebP (máx. 5MB)
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label
                    htmlFor="firstName"
                    className="flex items-center gap-2"
                  >
                    <User className="h-4 w-4" />
                    Nombre
                  </Label>
                  <Input
                    id="firstName"
                    type="text"
                    placeholder="Ingresa el nombre"
                    value={formData.firstName}
                    onChange={(e) =>
                      handleInputChange("firstName", e.target.value)
                    }
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="lastName" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Apellido
                  </Label>
                  <Input
                    id="lastName"
                    type="text"
                    placeholder="Ingresa el apellido"
                    value={formData.lastName}
                    onChange={(e) =>
                      handleInputChange("lastName", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="usuario@ejemplo.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile" className="flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    Teléfono Móvil
                  </Label>
                  <Input
                    id="mobile"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.mobile}
                    onChange={(e) =>
                      handleInputChange("mobile", e.target.value)
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Car className="h-5 w-5" />
                Editar Requisitos del Conductor
              </CardTitle>
              <CardDescription>
                Actualiza la información del vehículo y requisitos del conductor{" "}
              </CardDescription>
            </CardHeader>

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
