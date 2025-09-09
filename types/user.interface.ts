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
  identityDocumentUrl: string | null;
  driverLicenseUrl: string | null;
  criminalRecordUrl: string | null;
  vehicleId: number | null;
  state: string;
  id: number;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    profilePictureUrl: string;
  };
  paymentMethods: [];
  tripTypes: string[];
}

export interface PayoutDrivers {
  id: number;
  mobile: string;
  email: string;
  firstName: string;
  lastName: string;
  latitude: number;
  longitude: number;
  ratingAveragePassenger: number;
  ratingAverageDriver: number;
  profilePictureUrl: string;
  amoutToPay: number;
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
    name: string;
    createUid: number;
    writeUid: number;
    createdAt: Date;
    updatedAt: Date;
  };
  vehicleModel: {
    id: number;
    name: string;
    makeId: number;
    createUid: number;
    writeUid: number;
    createdAt: Date;
    updatedAt: Date;
  };
  year: number;
  plateNumber: string;
  vehicleType: string;
  tripClasses: string[];
  vehicleColor: string;
  state: string;
  vehiclePhotoUrl: string;
  insuranceTrafficAccidentsUrl: string;
}

export interface EditableVehicleData {
  vehicleMake: {
    name: string;
  };
  vehicleModel: {
    name: string;
  };
  year: number;
  vehicleColor: string;
  plateNumber: string;
  vehiclePhotoUrl: string;
  insuranceTrafficAccidentsUrl: string;
}

export interface Configs {
  id: number;
  key: string;
  value: string;
  description: null | string;
  createAt: Date;
  updatedAt: Date;
}

export interface SolicitudCambiada {
  status: string;
  data: {
    userId: number;
    identityDocumentUrl: string;
    driverLicenseUrl: string;
    criminalRecordUrl: string;
    vehicleId: number;
    state: string;
    id: number;
    user: {
      id: number;
      firstName: string;
      lastName: string;
      profilePictureUrl: string;
    };
    paymentMethods: string[];
    tripTypes: string[];
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
