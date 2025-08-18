import {
    fetchAllUserCount,
    fetchDataTripByStatus
} from "@/services/dashboard.service";
import { DashboardStatusData, MonthlySignups } from "@/types/dashboard-data.interface";
import { useEffect, useState } from "react";

export const useFetchUserCount = (typeUser: string) => {
  const [monthlySignups, setMonthlySignups] = useState<MonthlySignups[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
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

    loadDriverRequirement();
  }, []);

  return { monthlySignups, loading, error };
};

export const useFetchDataTrips = () => {
  const [statusCounts, setStatusCounts] = useState<DashboardStatusData>();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<null | string>(null);

  useEffect(() => {
    const loadDriverRequirement = async () => {
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

    loadDriverRequirement();
  }, []);

  return { statusCounts, loading, error };
};
