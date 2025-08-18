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
