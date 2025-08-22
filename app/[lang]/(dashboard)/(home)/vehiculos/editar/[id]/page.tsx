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
  fetchUpdateDataDriverById,
  fetchUpdateDataUserById,
} from "@/services/driver-requirement.service";
import { VehiculoEditForm } from "../../components/vehiculo-edit-form";

export default function EditDataVehiculo() {
  const { id } = useParams();

  const { vehicle, loading, error } = useFetchVehicleById(Number(id));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  const initData: EditableVehicleData = {
    vehicleMake: {
      name: vehicle?.vehicleMake.name || "",
    },
    vehicleModel: {
      name: vehicle?.vehicleModel.name || "",
    },
    year: vehicle?.year || 0,
    vehicleColor: vehicle?.vehicleColor || "",
    plateNumber: vehicle?.plateNumber || "",
    vehiclePhotoUrl: vehicle?.vehiclePhotoUrl || "",
    insuranceTrafficAccidentsUrl: vehicle?.insuranceTrafficAccidentsUrl || "",
  };

  const handleSave = async (data: EditableVehicleData) => {
    // try {
    //   const dataResponse = await fetchUpdateDataUserById(dataSend, Number(id));
    //   if (dataResponse.status === "success") {
    //     window.location.href = "/conductores";
    //   }
    // } catch (err) {
    //   console.error(" error", err);
    // } finally {
    //   console.log("finished");
    // }
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
