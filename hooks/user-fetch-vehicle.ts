import { useState, useEffect } from "react";
import {
  deleteDriverRequirementStatus,
  fetchAllVehicles,
  fetchDriverRequirementById,
  fetchDriverRequirements,
  updateDriverRequirement,
  updateDriverRequirementStatus,
} from "@/services/driver-requirement.service";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { StatusDriverRequirement } from "@/lib/enums";
import { Vehicle } from "@/types/user.interface";

export const useFetchMarkVehicle = () => {
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
        console.error("Failed to fetch Mark Vehicle:", err);
        setError("Failed to load Mark Vehicle");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirements: marksVehicles, loading, error };
};

export const useFetchModelVehicle = () => {
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
        console.error("Failed to fetch Model Vehicle:", err);
        setError("Failed to load Model Vehicle");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { driverRequirements: marksVehicles, loading, error };
};

export const useFetchAllVehicle = () => {
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  // Define la función de carga fuera del useEffect
  const loadDriverRequirement = async () => {
    setLoading(true);
    try {
      const data = await fetchAllVehicles();
      setVehicles(data.data);
    } catch (err) {
      console.error("Failed to get all vehicles:", err);
      setError("Failed to  get all Vehicles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDriverRequirement();
  }, []);

  return { vehicles, loading, error, refetch: loadDriverRequirement };
};
