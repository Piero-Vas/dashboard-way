import { StatusRegisterDriver } from "@/lib/enums";
import { User } from "./user.interface";

export interface DriversRequests {
  id: number;
  userId: number;
  identityDocumentUrl: null | string;
  driverLicenseUrl: null | string;
  criminalRecordUrl: null | string;
  vehicleId: number | null;
  state: StatusRegisterDriver;
  createUid: number;
  writeUid: number;
  createdAt: String;
  updatedAt: String;
  userInfo: User | null;
}
