"use client";

import VechilesTable from "@/components/tables/vehicles.table";
import { useFetchAllVehicle } from "@/hooks/user-fetch-vehicle";

const DriversPage = () => {
  const { vehicles, loading, error, refetch } = useFetchAllVehicle();
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div>
      <div className="text-2xl font-medium">Administrar vehiculos</div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <VechilesTable vehicles={vehicles} refreshVehicles={refetch} />
      </div>
    </div>
  );
};
export default DriversPage;
