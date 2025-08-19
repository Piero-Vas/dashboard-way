import { getAccessToken } from "@/app/[lang]/(dashboard)/(home)/constants";
import { ApiResponse } from "@/types/api-response.interface";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { apiClientGet, apiClientPatch } from "./api-client.service";
import {
  DashboardStatusData,
  Fare,
  MonthlySignups,
  StatusCount,
} from "@/types/dashboard-data.interface";

const token = getAccessToken();

export const fetchAllUserCount = async (
  typeUser: string
): Promise<ApiResponse<MonthlySignups[]>> => {
  console.log("typeUser:", typeUser);
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

  console.log("dataSend:", dataSend, "id:", fare.id);
  return apiClientPatch<ApiResponse<Fare>>(
    `/trip-class-fare/${fare.id}`,
    dataSend
  );
};
