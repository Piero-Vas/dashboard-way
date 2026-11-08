"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { app } from "@/firebaseClient";
import ModernStepForm from "../../../(forms)/form-wizard/modern-stepform";

const storage = getStorage(app);

export default function RegistroConductor() {
  const [step, setStep] = useState(1);
  const [imagePreview, setImagePreview] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const { register, handleSubmit, setValue, watch } = useForm();

  const nextStep = () => setStep((prev) => prev + 1);
  const prevStep = () => setStep((prev) => prev - 1);

  //   const uploadImage = async (file) => {
  //     if (!file) return;
  //     const storageRef = ref(storage, `vehiculos/${file.name}`);
  //     await uploadBytes(storageRef, file);
  //     const url = await getDownloadURL(storageRef);
  //     setImageUrl(url);
  //     setValue("vehicleImage", url);
  //   };

  return (
    <>
      <ModernStepForm />
    </>
  );
}
