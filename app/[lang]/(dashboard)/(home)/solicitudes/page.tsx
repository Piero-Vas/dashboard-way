"use client";

import DriverRequirementTable from "@/components/tables/user-table";
import MarkVehicleTable from "@/components/tables/vehicle-mark-table";
import {
  useFetchAllSolicitudes,
  useFetchDriverRequirements,
} from "@/hooks/use-fetch-driver-requirement";
import { useFetchMarkVehicle } from "@/hooks/user-fetch-vehicle";

const DriversPage = () => {
  const { driverRequirements, loading, error } = useFetchAllSolicitudes();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="text-2xl font-medium">Solicitudes de Conductores</div>

      <div className="mt-5 text-2xl font-medium text-default-900">
        <DriverRequirementTable driverRequirements={driverRequirements} />
      </div>
    </div>
  );
};
export default DriversPage;
