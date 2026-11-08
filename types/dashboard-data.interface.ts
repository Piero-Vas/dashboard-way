export interface MonthlySignups {
  year: string;
  month: string;
  userCount: number;
}

export interface StatusCount {
  last30Days: number;
  "31To60Days": number;
}

export interface DashboardStatusData {
  created: StatusCount;
  cancelled: StatusCount;
  accepted: StatusCount;
  arrived_at_pickup: StatusCount;
  in_progress: StatusCount;
  arrived_at_destination: StatusCount;
  in_bid: StatusCount;
}

export interface Fare {
  id: number;
  tripClass: string;
  vehicleType: string;
  tripType: string;
  basePrice: string;
  createUid: number | null;
  writeUid: number;
  createdAt: string;
  updatedAt: string;
  active: boolean;
  distanceRules: DistanceRule[];
}

export interface DistanceRule {
  id: number;
  fareId: number;
  minKm: string;
  maxKm: string | null;
  pricePerKm: string;
  createdAt: string;
  updatedAt: string;
}

export interface EditFare {
  tripClass: string;
  vehicleType: string;
  tripType: string;
  basePrice: string;
  distanceRules: [
    {
      minKm: string;
      maxKm: string;
      pricePerKm: string;
    }
  ];
}

export interface DriversOnline {
  online: number;
  total: number;
  activeInTrip: number;
}

export interface TripsToday {
  total: number;
  byState: Record<string, number>;
}

export interface PlatformEarningsPoint {
  date: string;
  platformEarnings: number;
  tripsAmount: number;
  bonusAmount: number;
  trips: number;
}

export interface PlatformEarnings {
  from: string;
  to: string;
  platformEarnings: number;
  totalTripsAmount: number;
  totalTrips: number;
  firstTripBonusAmount: number;
  series: PlatformEarningsPoint[];
}

export interface RechargeItem {
  id: string;
  amount: number;
  description: string | null;
  createdAt: string;
  userId: number | null;
  user: {
    id: number;
    firstName: string | null;
    lastName: string | null;
    mobile: string | null;
    email: string | null;
  } | null;
}

export interface RechargesPage {
  data: RechargeItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    lastPage: number;
    totalAmount: number;
  };
}
