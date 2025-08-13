import { useState, useEffect } from "react";
import {
  deleteDriverRequirementStatus,
  fetchDriverRequirementById,
  fetchDriverRequirements,
  updateDriverRequirement,
  updateDriverRequirementStatus,
} from "@/services/driver-requirement.service";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { StatusDriverRequirement } from "@/lib/enums";

export const useFetchAllPayments = () => {
  const [marksVehicles, setMarksVehicles] = useState<DriverRequirement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchDriverRequirements();
        setMarksVehicles(data.data);
      } catch (err) {
        console.error("Failed to fetch all payments:", err);
        setError("Failed to load all payments");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirements: marksVehicles, loading, error };
};
