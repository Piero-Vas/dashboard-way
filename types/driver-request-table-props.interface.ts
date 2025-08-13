import { DriversRequests } from "./driver-requests";
import { Driver, Vehicle } from "./user.interface";

export interface DriverRequestsTableProps {
  driverRequirements: DriversRequests[];
}


export interface DriverAllTableProps {
  drivers: Driver[];
}

export interface VechilesTableProps{
    vehicles: Vehicle[];
}
