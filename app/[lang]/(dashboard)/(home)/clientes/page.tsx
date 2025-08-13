"use client";

import { Button } from "@/components/ui/button";
import DriverAllTable from "../../(tables)/tailwindui-table/user-table";
import { useFetchAllPassengers, useFetchAllSolicitudes } from "@/hooks/use-fetch-driver-requirement";
import UserTableStatus from "../../(tables)/tailwindui-table/clientes-table";

const PassengerPage = () => {
  const { passengers, loading, error } = useFetchAllPassengers();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">Administrar Clientes</div>
      </div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <UserTableStatus drivers={passengers} />
      </div>
    </div>
  );
};

export default PassengerPage;
