"use client";
import {
  useFetchAllConfigs,
  useFetchAllDrivers,
} from "@/hooks/use-fetch-driver-requirement";
import React from "react";
import config from "../../../../../tailwind.config";
import { Button } from "@/components/ui/button";

export default function ConfigPage() {
  const { configs, loading, error } = useFetchAllConfigs();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className=" ">
      <main className="p-6">
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">
            Configuración
          </h2>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            {configs.map((item, index) => (
              <div
                key={index}
                className="flex justify-between items-center py-2 border-b"
              >
                <span className="text-gray-600">
                  {item.key == "REF_COM_TRIP_QTY"
                    ? "Cantidad minima de viajes (Referido)"
                    : item.key == "REF_COM_LAST_TRIP"
                    ? "Dias desde ultimo viaje (Referido)"
                    : item.key== "REF_COM_MIN_AMOUNT"
                    ? "Monto minimo retirable"
                    : item.key== "REF_COM_REF_QTY"
                    ? "Cantidad de refiridos para cobro de comisiones"
                    : item.key}
                </span>
                <input
                  type="text"
                  className="bg-gray-100 border rounded-md px-2 py-1 text-sm"
                  placeholder="Ingresa el valor"
                  defaultValue={String(item.value)}
                />
              </div>
            ))}
            <div className="flex justify-end mt-8">
              <Button color="success" size={"xl"}>
                Actualizar configuración
              </Button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
