"use client";

import {
  useFetchAllDrivers,
  useFetchAllPassengers,
} from "@/hooks/use-fetch-driver-requirement";
import DriverAllTable from "../../(tables)/tailwindui-table/user-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

const DriversPage = () => {
  const { drivers, loading, error, refetch } = useFetchAllDrivers();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">Administrar Conductores</div>
      </div>

      <div className="mt-5 text-2xl font-medium text-default-900">
        <DriverAllTable drivers={drivers} refreshDrivers={refetch} />
      </div>
    </div>
  );
};

export default DriversPage;
