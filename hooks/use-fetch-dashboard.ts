import {
  PeriodCounts,
  fetchAllUserCount,
  fetchAverageDriversRating,
  fetchIncidentCountLast30Days,
  fetchUserCountsByPeriods,
  fetchDataTripByStatus,
  fetchDataTripFare,
  fetchDataTripFareEdit,
  fetchDriversOnline,
  fetchTripsToday,
  fetchPlatformEarnings,
  fetchRecentRecharges,
} from "@/services/dashboard.service";
import {
  DashboardStatusData,
  DriversOnline,
  Fare,
  MonthlySignups,
  PlatformEarnings,
  RechargesPage,
  TripsToday,
} from "@/types/dashboard-data.interface";
import { useCallback, useEffect, useRef, useState } from "react";

export interface DashboardData {
  passengerSignups: MonthlySignups[];
  driverSignups: MonthlySignups[];
  adminSignups: MonthlySignups[];
  statusCounts?: DashboardStatusData;
  userPeriods?: PeriodCounts;
  incidents?: PeriodCounts;
  driversRating?: number;
  driversOnline?: DriversOnline;
  tripsToday?: TripsToday;
  platformEarnings?: PlatformEarnings;
  recharges?: RechargesPage;
}

/** Cantidad de fuentes que carga useDashboardData (para detectar "todas fallaron"). */
export const DASHBOARD_SOURCES = 11;

const REFRESH_MS = 60_000;

/**
 * Carga todos los datos del tablero en paralelo. Cada fuente falla de forma
 * independiente (errors[key]); refresca al montar, cada 60 s, al volver a la
 * pestana y bajo demanda con refresh().
 */
export const useDashboardData = () => {
  const [data, setData] = useState<DashboardData>({
    passengerSignups: [],
    driverSignups: [],
    adminSignups: [],
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const inFlight = useRef(false);

  const load = useCallback(async (initial = false) => {
    if (inFlight.current) return;
    inFlight.current = true;
    if (!initial) setRefreshing(true);
    const keys = [
      "passengers",
      "drivers",
      "admins",
      "trips",
      "periods",
      "incidents",
      "rating",
      "driversOnline",
      "tripsToday",
      "platformEarnings",
      "recharges",
    ];
    const results = await Promise.allSettled([
      fetchAllUserCount("passenger"),
      fetchAllUserCount("driver"),
      fetchAllUserCount("backoffice"),
      fetchDataTripByStatus(),
      fetchUserCountsByPeriods(),
      fetchIncidentCountLast30Days(),
      fetchAverageDriversRating(),
      fetchDriversOnline(),
      fetchTripsToday(),
      fetchPlatformEarnings(),
      fetchRecentRecharges(10),
    ]);
    const nextErrors: Record<string, string> = {};
    results.forEach((r, i) => {
      if (r.status === "rejected") nextErrors[keys[i]] = "No se pudo cargar";
    });
    const val = <T,>(i: number): T | undefined =>
      results[i].status === "fulfilled"
        ? ((results[i] as PromiseFulfilledResult<any>).value?.data as T)
        : undefined;
    setData((prev) => ({
      passengerSignups: val<MonthlySignups[]>(0) ?? prev.passengerSignups,
      driverSignups: val<MonthlySignups[]>(1) ?? prev.driverSignups,
      adminSignups: val<MonthlySignups[]>(2) ?? prev.adminSignups,
      statusCounts: val<DashboardStatusData>(3) ?? prev.statusCounts,
      userPeriods: val<PeriodCounts>(4) ?? prev.userPeriods,
      incidents: val<PeriodCounts>(5) ?? prev.incidents,
      driversRating: val<number>(6) ?? prev.driversRating,
      driversOnline: val<DriversOnline>(7) ?? prev.driversOnline,
      tripsToday: val<TripsToday>(8) ?? prev.tripsToday,
      platformEarnings: val<PlatformEarnings>(9) ?? prev.platformEarnings,
      recharges: val<RechargesPage>(10) ?? prev.recharges,
    }));
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length < keys.length) setLastUpdated(new Date());
    setLoading(false);
    setRefreshing(false);
    inFlight.current = false;
  }, []);

  useEffect(() => {
    load(true);
    const timer = setInterval(() => load(), REFRESH_MS);
    const onVisible = () => {
      if (document.visibilityState === "visible") load();
    };
    document.addEventListener("visibilitychange", onVisible);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [load]);

  return { data, loading, refreshing, errors, lastUpdated, refresh: () => load() };
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
