"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import { Button } from "@/components/ui/button";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import StaticCircle from "@/components/staticCircle";
import { useFetchAllTripsById } from "@/hooks/use-fetch-user-requirement";

const ViajePage = () => {
  const { id } = useParams();
  const tripId = Array.isArray(id) ? id[0] : id;
  const { trips, loading, error } = useFetchAllTripsById(tripId);

  if (loading) {
    return <div>Cargando...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div className="max-w-2xl mx-auto p-4">
      <p
        className={`${
          trips?.tripState == "arrived_at_destination"
            ? "text-green-600"
            : "text-red-600"
        } font-medium`}
      >
        {" "}
        {trips?.tripState == "arrived_at_destination"
          ? "✅ Completado"
          : " ❌ Cancelado"}
      </p>

      {/* Mapa con origen y destino */}
      <div className="h-64 w-full rounded-md overflow-hidden my-4">
        <MapContainer
          center={[trips?.pickupLocation.lat!, trips?.pickupLocation.lng!]}
          zoom={14}
          className="h-full w-full"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker
            position={[trips?.pickupLocation.lat!, trips?.pickupLocation.lng!]}
            icon={L.icon({
              iconUrl: "/images/marker-start.png",
              iconSize: [25, 41],
            })}
          />
          <Marker
            position={[
              trips?.dropoffLocations[0].lat!,
              trips?.dropoffLocations[0].lng!,
            ]}
            icon={L.icon({
              iconUrl: "/images/marker-end.png",
              iconSize: [25, 41],
            })}
          />
        </MapContainer>
      </div>

      {/* Información del viaje */}
      <div className="bg-gray-100 p-4 rounded-md">
        <div className="flex items-center gap-2">
          <StaticCircle /> <strong> Origen:</strong>{" "}
          {trips?.pickupLocation.name}
        </div>
        <div className="flex items-center gap-2">
          <StaticCircle color="#FBAE17" /> <strong> Destino:</strong>{" "}
          {trips?.dropoffLocations[0].name}
        </div>

        <p>
          💰 <strong>Precio:</strong> S/ {trips?.amount} ({trips?.paymentMethod}
          )
        </p>
      </div>

      {/* Información del conductor */}
      <div className="flex items-center mt-4 space-x-4">
        <img
          src={trips?.driverUser!.profilePictureUrl!}
          alt="Conductor"
          className="w-12 h-12 rounded-full"
        />
        <div>
          <p className="text-lg font-medium">
            {trips?.driverUser!.firstName} {trips?.driverUser!.lastName}
          </p>
          <p>⭐ {trips?.driverUser!.ratingAverageDriver}</p>
        </div>
      </div>

      {/* Información del vehículo */}
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <p>
          🚗 <strong>Placa:</strong> {trips?.vehicle?.plateNumber}
        </p>
        <p>
          🎨 <strong>Color:</strong> {trips?.vehicle?.vehicleColor}
        </p>
        <p>
          🚘 <strong>Modelo:</strong> {trips?.vehicle?.vehicleModel.name}{" "}
          {trips?.vehicle?.vehicleMake.name}
        </p>
      </div>

      {/* Botón de acción */}
      <Button className="mt-4 w-full bg-blue-600 text-white">
        Contactar al conductor
      </Button>
    </div>
  );
};

export default ViajePage;
