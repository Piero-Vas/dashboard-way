"use client";

import { Fare } from "@/types/dashboard-data.interface";
import { useEffect, useState } from "react";
import { EditFareModal } from "./components/edit-fare-modal";
import { FareCard } from "./components/fare-card";
import { useEditFare, useFetchDataTripFare } from "@/hooks/use-fetch-dashboard";

export default function FareManagement() {
  const { fareData, loading, error } = useFetchDataTripFare();
  const {
    editFare,
    loading: editFareLoading,
    error: editFareError,
    success: editFareSuccess,
  } = useEditFare();

  const [fares, setFares] = useState<Fare[]>([]);
  const [editingFare, setEditingFare] = useState<Fare | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (fareData && Array.isArray(fareData)) {
      setFares(fareData);
    }
  }, [fareData]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error loading fare data</div>;
  }

  const handleEditFare = (fare: Fare) => {
    setEditingFare(fare);
    setIsModalOpen(true);
  };

  const handleSaveFare = async (updatedFare: Fare) => {
    await editFare(updatedFare);
    if (editFareSuccess) {
      setFares((prevFares) =>
        prevFares.map((fare) =>
          fare.id === updatedFare.id ? updatedFare : fare
        )
      );
      setIsModalOpen(false);
      setEditingFare(null);
    }
  };

  const handleCancelEdit = () => {
    setIsModalOpen(false);
    setEditingFare(null);
  };

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Gestión de Tarifas
        </h1>
        <p className="text-muted-foreground">
          Administra las tarifas de transporte y sus reglas de distancia
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {fares.map((fare) => (
          <FareCard
            key={fare.id}
            fare={fare}
            onEdit={() => handleEditFare(fare)}
          />
        ))}
      </div>

      <EditFareModal
        fare={editingFare}
        isOpen={isModalOpen}
        onSave={handleSaveFare}
        onCancel={handleCancelEdit}
      />
    </div>
  );
}
