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
      const payload = {
        vehicleMakeId: Number(data.vehicleMakeId),
        vehicleModelId: Number(data.vehicleModelId),
        year: Number(data.year),
        vehicleColor: data.vehicleColor,
        plateNumber: data.plateNumber,
        vehiclePhotoUrl: data.vehiclePhotoUrl,
        insuranceTrafficAccidentsUrl: data.insuranceTrafficAccidentsUrl,
      };
      await fetchUpdateVehicleData(Number(id), payload);
      window.history.back();
    } catch (err) {
      console.error("Error al actualizar vehículo:", err);
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
