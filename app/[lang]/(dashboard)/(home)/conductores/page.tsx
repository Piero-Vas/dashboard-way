"use client";

import {
  useFetchAllDrivers,
  useFetchAllPassengers,
} from "@/hooks/use-fetch-driver-requirement";
import DriverAllTable from "../../(tables)/tailwindui-table/user-table";
import { Button } from "@/components/ui/button";
import Link from "next/link";

import { useState } from "react";
import { UserPlus } from "lucide-react";
import { CreateDriverDialog } from "./components/create-driver-dialog";

const DriversPage = () => {
  const { drivers, loading, error, refetch } = useFetchAllDrivers();
  const [openCreateModal, setOpenCreateModal] = useState(false);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }
  return (
    <div>
      <div className="flex justify-between items-center gap-4 flex-wrap">
        <div className="flex items-center gap-3">
          <div className="text-2xl font-medium">Administrar Conductores</div>
          <div className="text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-full font-semibold border border-primary/20">
            Total: {drivers.length} Conductores
          </div>
        </div>
        <Button
          onClick={() => setOpenCreateModal(true)}
          className="flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Registrar Conductor
        </Button>
      </div>

      <div className="mt-5 text-2xl font-medium text-default-900">
        <DriverAllTable drivers={drivers} refreshDrivers={refetch} />
      </div>

      <CreateDriverDialog
        open={openCreateModal}
        onOpenChange={setOpenCreateModal}
        onSuccess={refetch}
      />
    </div>
  );
};

export default DriversPage;
