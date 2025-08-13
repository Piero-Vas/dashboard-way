"use client";

import DriverRequirementTable from "@/components/tables/user-table";
import VechilesTable from "@/components/tables/vehicles.table";
import { useFetchDriverRequirements } from "@/hooks/use-fetch-driver-requirement";
import { useFetchAllVehicle } from "@/hooks/user-fetch-vehicle";

const DriversPage = () => {
  const { vehicles, loading, error } = useFetchAllVehicle();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="text-2xl font-medium">Administrar vehiculos</div>

      <div className="mt-5 text-2xl font-medium text-default-900">
        <VechilesTable vehicles={vehicles}/>
      </div>
    </div>
  );
};
export default DriversPage;
