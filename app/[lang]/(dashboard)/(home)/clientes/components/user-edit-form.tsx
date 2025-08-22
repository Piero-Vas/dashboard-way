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
import { EditableUserData } from "@/types/user.interface";
import { ImageIcon, Loader2, Mail, Phone, Upload, User } from "lucide-react";
import { useRef, useState } from "react";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { app } from "@/firebaseClient";

interface UserEditFormProps {
  initialData: EditableUserData;
  onSave: (data: EditableUserData) => void;
  onCancel: () => void;
}

const storage = getStorage(app);

export function UserEditForm({
  initialData,
  onSave,
  onCancel,
}: UserEditFormProps) {
  const [formData, setFormData] = useState<EditableUserData>(initialData);
  const [isLoading, setIsLoading] = useState(false);
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleInputChange = (field: keyof EditableUserData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Editar Perfil de Usuario
        </CardTitle>
        <CardDescription>
          Actualiza la información personal y configuración del usuario
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
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
              <Label htmlFor="firstName" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Nombre
              </Label>
              <Input
                id="firstName"
                type="text"
                placeholder="Ingresa el nombre"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
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
                onChange={(e) => handleInputChange("lastName", e.target.value)}
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
                onChange={(e) => handleInputChange("mobile", e.target.value)}
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
        </form>
      </CardContent>
    </Card>
  );
}
