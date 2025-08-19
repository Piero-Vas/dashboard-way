import {
  fetchAllUserCount,
  fetchDataTripByStatus,
  fetchDataTripFare,
  fetchDataTripFareEdit,
} from "@/services/dashboard.service";
import {
  DashboardStatusData,
  Fare,
  MonthlySignups,
} from "@/types/dashboard-data.interface";
import { useEffect, useState } from "react";

export const useFetchUserCount = (typeUser: string) => {
  const [monthlySignups, setMonthlySignups] = useState<MonthlySignups[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchAllUserCount(typeUser);
        setMonthlySignups(data.data);
      } catch (err) {
        console.error("Failed to fetch MonthlySignups:", err);
        setError("Failed to load MonthlySignups");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { monthlySignups, loading, error };
};

export const useFetchDataTrips = () => {
  const [statusCounts, setStatusCounts] = useState<DashboardStatusData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDataTripByStatus();
        setStatusCounts(data.data);
      } catch (err) {
        console.error("Failed to fetch MonthlySignups:", err);
        setError("Failed to load MonthlySignups");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { statusCounts, loading, error };
};

export const useFetchDataTripFare = () => {
  const [fareData, setFare] = useState<Fare[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchDataTripFare();
        setFare(data.data);
      } catch (err) {
        console.error("Failed to fetch MonthlySignups:", err);
        setError("Failed to load MonthlySignups");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return { fareData, loading, error };
};

export const useEditFare = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);

  const editFare = async (fare: Fare) => {
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      await fetchDataTripFareEdit(fare);
      setSuccess(true);
    } catch (err: any) {
      setError("Error al editar la tarifa");
    } finally {
      setLoading(false);
    }
  };

  return { editFare, loading, error, success };
};
