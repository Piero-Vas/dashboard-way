"use client";

import { useFetchAllPassengers } from "@/hooks/use-fetch-driver-requirement";
import UserTableStatus from "../../(tables)/tailwindui-table/clientes-table";

const PassengerPage = () => {
  const { passengers, loading, error, refetch } = useFetchAllPassengers(); // Asegúrate de que tu hook tenga refetch
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="flex justify-between items-center">
        <div className="text-2xl font-medium">Administrar Clientes</div>
        <div className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
          Total: {passengers.length} Clientes
        </div>
      </div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <UserTableStatus users={passengers} refreshUsers={refetch} />
      </div>
    </div>
  );
};

export default PassengerPage;
