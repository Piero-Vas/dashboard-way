import { getAccessToken } from "@/app/[lang]/(dashboard)/(home)/constants";
import { ApiResponse } from "@/types/api-response.interface";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { apiClientGet } from "./api-client.service";
import { DashboardStatusData, MonthlySignups, StatusCount } from "@/types/dashboard-data.interface";

const token = getAccessToken();

export const fetchAllUserCount = async (
  typeUser: string
): Promise<ApiResponse<MonthlySignups[]>> => {
    console.log('typeUser:', typeUser);
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
  return apiClientGet<ApiResponse<DashboardStatusData>>("/trip-stats/counts-by-status");
};
