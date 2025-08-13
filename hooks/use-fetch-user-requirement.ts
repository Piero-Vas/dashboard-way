import {
  fetchAllPassengers,
  fetchAllTripsById,
  fetchAllTripsByUser,
} from "@/services/driver-requirement.service";
import { ResponseDataTrips, TripById, User } from "@/types/user.interface";
import { useEffect, useState } from "react";

export const useFetchAllTripsByUser = (id: number, role: string) => {
  const [trips, setTrips] = useState<ResponseDataTrips>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchAllTripsByUser(role, id);
        setTrips(data.data);
        console.log("Trips fetched successfully:", data.data);
      } catch (err) {
        console.error("Failed to fetch solicitudes:", err);
        setError("Failed to load solicitudes");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { trips, loading, error };
};


export const useFetchAllTripsById = (id: string) => {
  const [trips, setTrips] = useState<TripById>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);
  useEffect(() => {
    const loadDriverRequirement = async () => {
      setLoading(true);
      try {
        const data = await fetchAllTripsById(id);
        setTrips(data.data);
        console.log("Trips fetched successfully:", data.data);
      } catch (err) {
        console.error("Failed to fetch solicitudes:", err);
        setError("Failed to load solicitudes");
      } finally {
        setLoading(false);
      }
    };

    loadDriverRequirement();
  }, []);

  return { trips, loading, error };
};
