"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { initializeApp } from "firebase/app";
import ModernStepForm from "../../../(forms)/form-wizard/modern-stepform";

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

const app = initializeApp(firebaseConfig);
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
