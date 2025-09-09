import { DriversRequests } from "./driver-requests";
import { Driver, PayoutDrivers, User } from "./user.interface";

export interface DriverRequestsTableProps {
  drivers: Driver[];
}

export interface DriverToPayRequestsTableProps {
  driversToPay: PayoutDrivers[];
}

export interface UserRequestsTableProps {
  users: User[];
}
