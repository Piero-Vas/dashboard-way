import { Role } from "@/lib/enums";

export interface User {
  id: number;
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  latitude: null | number;
  longitude: null | number;
  userRoles: Role[];
  ratingAveragePassenger: number;
  ratingAverageDriver: number;
  profilePictureUrl: null | string;
}

export interface EditableUserData {
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
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
    profilePictureUrl: string;
  };
  paymentMethods: [];
  tripTypes: String[];
}

export interface EditableDriverData {
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  profilePictureUrl: string;
  identityDocumentUrl: string | null;
  identityDocumentReverseUrl: string | null;
  driverLicenseUrl: string | null;
  criminalRecordUrl: string | null;
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
    identityDocumentUrl: String;
    driverLicenseUrl: String;
    criminalRecordUrl: String;
    vehicleId: number;
    state: String;
    id: number;
    user: {
      id: number;
      firstName: String;
      lastName: String;
      profilePictureUrl: String;
    };
    paymentMethods: String[];
    tripTypes: String[];
  };
}

export interface ResponseDataTrips {
  limit: number;
  page: number;
  total: number;
  totalPages: number;
  trips: Trip[];
}

export interface Trip {
  id: string;
  pickupLocation: {
    name: string;
  };
  dropoffLocations: {
    name: string;
  }[];
  createdAt: string;
  amount: number;
}

export interface TripById {
  id: string;
  pickupLocation: {
    lat: number;
    lng: number;
    name: string;
  };
  dropoffLocations: {
    lat: number;
    lng: number;
    name: string;
  }[];
  amount: number;
  paymentMethod: string;
  tripState: string;
  driverUser: {
    id: number;
    firstName: string;
    lastName: string;
    ratingAverageDriver: number;
    profilePictureUrl: string | null;
  } | null;
  vehicle: {
    id: number;
    vehicleMake: {
      name: string;
    };
    vehicleModel: {
      name: string;
    };
    year: number;
    vehicleColor: string;
    plateNumber: string;
  } | null;
}

export interface DriverResponse {
  userId: number;
  profilePhotoUrl: string;
  identityDocumentUrl: string;
  identityDocumentReverseUrl: string;
  driverLicenseUrl: string;
  criminalRecordUrl: string;
  vehicleId: number;
  state: string;
}

export interface VehicleResponse {
  id: number;
  userId: number;
  vehicleMake: {
    id: number;
    name: string;
  };
  vehicleModel: {
    id: number;
    name: string;
  };
  year: number;
  vehicleColor: string;
  plateNumber: string;
  state: string;
  vehiclePhotoUrl: string;
  insuranceTrafficAccidentsUrl: string;
  tripClasses: string[];
}
