import { ApiResponse } from "@/types/api-response.interface";
import {
  apiClientDelete,
  apiClientGet,
  apiClientPatch,
  apiClientPost,
} from "./api-client.service";
import { DriverRequirement } from "@/types/driver-requirement.interface";

const apiController = "/vehicle";

export const fetchDriverRequirements = async (): Promise<
  ApiResponse<DriverRequirement[]>
> => {
  return apiClientGet<ApiResponse<DriverRequirement[]>>(apiController);
};
