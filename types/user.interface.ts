import { Role } from "@/lib/enums";
import { S } from "@fullcalendar/core/internal-common";

export interface User {
  id: number;
  mobile: String;
  email: String;
  firstName: String;
  lastName: String;
  latitude: null | number;
  longitude: null | number;
  userRoles: Role[];
  ratingAveragePassenger: number;
  ratingAverageDriver: number;
  profilePictureUrl: null | string;
}

export interface Driver {
  userId: number;
  identityDocumentUrl: String | null;
  driverLicenseUrl: String | null;
  criminalRecordUrl: String | null;
  vehicleId: number | null;
  state: String;
  id: number;
  user: {
    id: number;
    firstName: String;
    lastName: String;
    profilePictureUrl: String | null;
  };
  paymentMethods: [];
  tripTypes: String[];
}

export interface Vehicle {
  id: number;
  userId: number;
  vehicleMake: {
    id: number;
    name: String;
    createUid: number;
    writeUid: number;
    createdAt: Date;
    updatedAt: Date;
  };
  vehicleModel: {
    id: number;
    name: String;
    makeId: number;
    createUid: number;
    writeUid: number;
    createdAt: Date;
    updatedAt: Date;
  };
  year: number;
  plateNumber: String;
  vehicleType: String;
  tripClasses: String[];
  vehicleColor: String;
  state: String;
  vehiclePhotoUrl: String;
  insuranceTrafficAccidentsUrl: String;
}

export interface Configs {
  id: number;
  key: String;
  value: String;
  description: null | String;
  createAt: Date;
  updatedAt: Date;
}

export interface SolicitudCambiada {
  status: String;
  data: {
    userId: number;
    identityDocumentUrl:  String;
    driverLicenseUrl:  String;
    criminalRecordUrl:  String;
    vehicleId: number;
    state: String;
    id: number;
    user: {
      id: number;
      firstName: String
      lastName: String
      profilePictureUrl: String
    };
    paymentMethods: String[];
    tripTypes: String[];
  };
}
