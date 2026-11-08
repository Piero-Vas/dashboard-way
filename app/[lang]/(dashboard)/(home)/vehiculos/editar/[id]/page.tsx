"use client";

import React from "react";
import {
  EditableDriverData,
  EditableUserData,
  EditableVehicleData,
  VehicleResponse,
} from "@/types/user.interface";
import { useParams } from "next/navigation";
import {
  useFetchGetDriverById,
  useFetchGetUserById,
  useFetchVehicleById,
} from "@/hooks/use-fetch-driver-requirement";
import {
  fetchDataVehicleById,
  fetchUpdateVehicleData,
} from "@/services/driver-requirement.service";
import { VehiculoEditForm } from "../../components/vehiculo-edit-form";

export default function EditDataVehiculo() {
  const { id } = useParams();

  const { vehicle, loading, error } = useFetchVehicleById(Number(id));

  if (loading) {
    return <div>Cargando...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const initData: EditableVehicleData = {
    vehicleMakeId: vehicle?.vehicleMakeId || vehicle?.vehicleMake?.id || 0,
    vehicleModelId: vehicle?.vehicleModelId || vehicle?.vehicleModel?.id || 0,
    vehicleMake: vehicle?.vehicleMake,
    vehicleModel: vehicle?.vehicleModel,
    year: vehicle?.year || 0,
    vehicleColor: vehicle?.vehicleColor || "",
    plateNumber: vehicle?.plateNumber || "",
    vehiclePhotoUrl: vehicle?.vehiclePhotoUrl || "",
    insuranceTrafficAccidentsUrl: vehicle?.insuranceTrafficAccidentsUrl || "",
  };

  const handleSave = async (data: EditableVehicleData) => {
    try {
      const makeId = Number(data.vehicleMakeId);
      const modelId = Number(data.vehicleModelId);
      const year = Number(data.year);
      const color = String(data.vehicleColor || "").toUpperCase();
      // Solo se envian campos validos: el gateway rechaza (400) valores
      // vacios en enums/numeros y cualquier campo fuera del DTO.
      const payload: Record<string, any> = {
        ...(makeId > 0 ? { vehicleMakeId: makeId } : {}),
        ...(modelId > 0 ? { vehicleModelId: modelId } : {}),
        ...(year > 0 ? { year } : {}),
        ...(color ? { vehicleColor: color } : {}),
        ...(data.plateNumber?.trim()
          ? { plateNumber: data.plateNumber.trim() }
          : {}),
        ...(data.vehiclePhotoUrl
          ? { vehiclePhotoUrl: data.vehiclePhotoUrl }
          : {}),
        ...(data.insuranceTrafficAccidentsUrl
          ? { insuranceTrafficAccidentsUrl: data.insuranceTrafficAccidentsUrl }
          : {}),
      };
      await fetchUpdateVehicleData(Number(id), payload);
      window.history.back();
    } catch (err: any) {
      console.error("Error al actualizar vehículo:", err);
      const msg = err?.response?.data?.message;
      alert(
        "No se pudo actualizar el vehículo." +
          (msg ? "\n" + (Array.isArray(msg) ? msg.join("\n") : msg) : "")
      );
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <VehiculoEditForm
      initialData={initData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
