"use client";

import React from "react";
import { EditableDriverData, EditableUserData } from "@/types/user.interface";
import { useParams } from "next/navigation";
import {
  useFetchGetDriverById,
  useFetchGetUserById,
} from "@/hooks/use-fetch-driver-requirement";
import { fetchUpdateDataDriverById, fetchUpdateDataUserById } from "@/services/driver-requirement.service";
import { ConductorEditForm } from "../../components/conductores-edit-form";

export default function EditDataConductor() {
  const { id } = useParams();

  const { user, loading, error } = useFetchGetUserById(Number(id));
  const {
    driver,
    loading: driverLoading,
    error: driverError,
  } = useFetchGetDriverById(Number(id));

  if (loading || driverLoading) {
    return <div>Loading...</div>;
  }
  if (error || driverError) {
    return <div>Error: {error || driverError}</div>;
  }

  console.log("User data:", user);

  const initialData = {
    mobile: user?.mobile!,
    email: user?.email!,
    firstName: user?.firstName!,
    lastName: user?.lastName!,
    profilePictureUrl: user?.profilePictureUrl!,
    identityDocumentUrl: driver?.identityDocumentUrl || "",
    identityDocumentReverseUrl: driver?.identityDocumentReverseUrl || "",
    driverLicenseUrl: driver?.driverLicenseUrl || "",
    criminalRecordUrl: driver?.criminalRecordUrl || "",
  };

  const handleSave = async (data: EditableDriverData) => {
    console.log("Data to save:", data);
    const dataSend: EditableUserData = {
      mobile: data.mobile,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
      profilePictureUrl: data.profilePictureUrl,
    };

    try {
      const dataResponse = await fetchUpdateDataUserById(dataSend, Number(id));
      const driverResponse = await fetchUpdateDataDriverById(data, Number(id));
      console.log("Data response:", dataResponse);
      console.log("Driver response:", driverResponse);

      if (
        dataResponse.status === "success" &&
        driverResponse.status === "success"
      ) {
        window.location.href = "/conductores";
      }
    } catch (err) {
      console.error(" error", err);
    } finally {
      console.log("finished");
    }
  };

  const handleCancel = () => {
    window.history.back();
  };

  return (
    <ConductorEditForm
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
