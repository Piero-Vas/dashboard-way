import { ApiResponse } from "@/types/api-response.interface";
import { apiClientGet, apiClientPatch } from "./api-client.service";
import {
  DashboardStatusData,
  DriversOnline,
  Fare,
  MonthlySignups,
  PlatformEarnings,
  RechargesPage,
  TripsToday,
} from "@/types/dashboard-data.interface";

// Nota: el token lo adjunta el interceptor de `api` (config/axios.config.ts)
// en cada peticion; no se debe leer a nivel de modulo.

export interface PeriodCounts {
  last30Days: number;
  "31To60Days": number;
}

export const fetchAllUserCount = async (
  typeUser: string
): Promise<ApiResponse<MonthlySignups[]>> => {
  return apiClientGet<ApiResponse<MonthlySignups[]>>(
    "/user-stats/monthly-signups",
    {
      params: {
        userRole: typeUser,
      },
    }
  );
};

export const fetchDataTripByStatus = async (): Promise<
  ApiResponse<DashboardStatusData>
> => {
  return apiClientGet<ApiResponse<DashboardStatusData>>(
    "/trip-stats/counts-by-status"
  );
};

export const fetchUserCountsByPeriods = async (): Promise<
  ApiResponse<PeriodCounts>
> => apiClientGet<ApiResponse<PeriodCounts>>("/user-stats/count-by-periods");

export const fetchIncidentCountLast30Days = async (): Promise<
  ApiResponse<PeriodCounts>
> =>
  apiClientGet<ApiResponse<PeriodCounts>>("/incident-stats/count-last-30-days");

export const fetchAverageDriversRating = async (): Promise<
  ApiResponse<number>
> => apiClientGet<ApiResponse<number>>("/user-stats/average-drivers-rating");

export const fetchDriversOnline = async (): Promise<
  ApiResponse<DriversOnline>
> => apiClientGet<ApiResponse<DriversOnline>>("/user-stats/drivers-online");

export const fetchTripsToday = async (): Promise<ApiResponse<TripsToday>> =>
  apiClientGet<ApiResponse<TripsToday>>("/trip-stats/today");

// Sin from/to el backend devuelve los ultimos 30 dias (hora Lima).
export const fetchPlatformEarnings = async (
  from?: string,
  to?: string
): Promise<ApiResponse<PlatformEarnings>> =>
  apiClientGet<ApiResponse<PlatformEarnings>>("/earning-stats/platform", {
    params: { from, to },
  });

// Respuesta { status, data: { data: RechargeItem[], meta } } (el backend envuelve la pagina).
export const fetchRecentRecharges = async (
  limit = 10
): Promise<ApiResponse<RechargesPage>> =>
  apiClientGet<ApiResponse<RechargesPage>>("/wallet-transaction/recharges", {
    params: { page: 1, limit },
  });

export const fetchDataTripFare = async (): Promise<ApiResponse<Fare[]>> => {
  return apiClientGet<ApiResponse<Fare[]>>("/trip-class-fare");
};

export const fetchDataTripFareEdit = async (fare: Fare) => {
  const dataSend = {
    tripClass: fare.tripClass,
    vehicleType: fare.vehicleType,
    tripType: fare.tripType,
    basePrice: fare.basePrice,
    distanceRules: fare.distanceRules.map((rule) => ({
      minKm: rule.minKm,
      maxKm: rule.maxKm,
      pricePerKm: rule.pricePerKm,
    })),
  };

  return apiClientPatch<ApiResponse<Fare>>(
    `/trip-class-fare/${fare.id}`,
    dataSend
  );
};
