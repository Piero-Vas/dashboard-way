import { ApiResponse } from "@/types/api-response.interface";
import {
  apiClientDelete,
  apiClientGet,
  apiClientPatch,
  apiClientPost,
} from "./api-client.service";
import { DriverRequirement } from "@/types/driver-requirement.interface";
import { DriversRequests } from "@/types/driver-requests";
import { headers } from "next/headers";
import {
  Configs,
  Driver,
  SolicitudCambiada,
  User,
  Vehicle,
} from "@/types/user.interface";
import { keyRide } from "@/app/[lang]/(dashboard)/(home)/constants";

const apiController = "/driver-requirement";
const apiRequests = "/driver";
const apiRequestsUser = "/user";

const token = keyRide;

export const fetchDriverRequirements = async (): Promise<
  ApiResponse<DriverRequirement[]>
> => {
  return apiClientGet<ApiResponse<DriverRequirement[]>>(apiController);
};

export const fetchDriverAllRequests = async (): Promise<
  ApiResponse<DriversRequests[]>
> => {
  return apiClientGet<ApiResponse<DriversRequests[]>>(
    `${apiRequests}?state=INIT_VEHICLE`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};

export const fetchAllVehicles = async (): Promise<ApiResponse<Vehicle[]>> => {
  return apiClientGet<ApiResponse<Vehicle[]>>(`/vehicle`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const updateDataSolicitudes = async (
  id: number
): Promise<ApiResponse<SolicitudCambiada[]>> => {
  return apiClientPatch<ApiResponse<SolicitudCambiada[]>>(`/driver/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: {
      state: "ACTIVE",
    },
  });
};

export const fetchAllPassengers = async (): Promise<ApiResponse<User[]>> => {
  return apiClientGet<ApiResponse<User[]>>(`/user`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      role: "passenger",
      page: 1,
      limit: 10,
    },
  });
};

export const fetchAllDrivers = async (): Promise<ApiResponse<Driver[]>> => {
  return apiClientGet<ApiResponse<Driver[]>>(`/driver`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      state: "INIT_VEHICLE",
    },
  });
};

export const fetchAllConfigs = async (): Promise<ApiResponse<Configs[]>> => {
  return apiClientGet<ApiResponse<Configs[]>>(`/custom-config`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchDataUserById = async (
  id: number
): Promise<ApiResponse<User>> => {
  return apiClientGet<ApiResponse<User>>(`${apiRequestsUser}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

export const fetchDriverRequirementById = async (
  id: number
): Promise<ApiResponse<DriverRequirement>> => {
  return apiClientGet<ApiResponse<DriverRequirement>>(`${apiController}/${id}`);
};

export const createDriverRequirements = async (driverData: any) => {
  return apiClientPost(apiController, driverData);
};

export const updateDriverRequirement = async (
  id: number,
  driverRequirement: DriversRequests
) => {
  return apiClientPatch(`${apiController}/${id}`, driverRequirement);
};

export const updateDriverRequirementStatus = async (
  id: number,
  driverRequirement: DriverRequirement
) => {
  return apiClientPatch(`${apiController}/${id}/status`, driverRequirement);
};

export const deleteDriverRequirementStatus = async (id: number) => {
  return apiClientDelete(`${apiController}/${id}`);
};
