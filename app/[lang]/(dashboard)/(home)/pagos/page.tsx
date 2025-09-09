"use client";

import { useFetchAllDriversToPay } from "@/hooks/use-fetch-driver-requirement";
import PaymentTable from "../../(tables)/tailwindui-table/pagos-table";

const PagosPage = () => {
  const { driversToPay, loading, error } = useFetchAllDriversToPay();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <div className="flex justify-between">
        <div className="text-2xl font-medium">
          Administrar pagos a conductores
        </div>
      </div>
      <div className="mt-5 text-2xl font-medium text-default-900">
        <PaymentTable driversToPay={driversToPay} />
      </div>
    </div>
  );
};

export default PagosPage;
