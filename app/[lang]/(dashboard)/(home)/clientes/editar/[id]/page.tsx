"use client";

import React from "react";
import { UserEditForm } from "../../components/user-edit-form";
import { EditableUserData } from "@/types/user.interface";
import { useParams } from "next/navigation";
import { useFetchGetUserById } from "@/hooks/use-fetch-driver-requirement";
import { fetchUpdateDataUserById } from "@/services/driver-requirement.service";

export default function EditDataClient() {
  const { id } = useParams();

  const { user, loading, error } = useFetchGetUserById(Number(id));

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  console.log("User data:", user);

  const initialData = {
    mobile: user?.mobile!,
    email: user?.email!,
    firstName: user?.firstName!,
    lastName: user?.lastName!,
    profilePictureUrl: user?.profilePictureUrl!,
  };

  const handleSave = async (data: EditableUserData) => {
    try {
      const dataResponse = await fetchUpdateDataUserById(data, Number(id));

      if (dataResponse.status === "success") {
        window.location.href = "/clientes";
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
    <UserEditForm
      initialData={initialData}
      onSave={handleSave}
      onCancel={handleCancel}
    />
  );
}
