"use client";
import { Cup, Eye, Increase, Session } from "@/components/svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useFetchDataTrips, useFetchUserCount } from "@/hooks/use-fetch-dashboard";
import { cn, getReportStats } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

const ReportsArea = () => {
  const router = useRouter();
  const { statusCounts, loading, error } = useFetchDataTrips();
  const { monthlySignups: passengerSignups } = useFetchUserCount("passenger");
  const { monthlySignups: driverSignups } = useFetchUserCount("driver");

  if (loading) return <div>Cargando...</div>;
  if (error) return <div>Error: {error}</div>;

  const totalPassengers = passengerSignups.reduce((acc, curr) => acc + (curr.userCount || 0), 0);
  const totalDrivers = driverSignups.reduce((acc, curr) => acc + (curr.userCount || 0), 0);
  const totalUsers = totalPassengers + totalDrivers;

  const cancelledStats = getReportStats(statusCounts, "cancelled");
  const completedStats = getReportStats(statusCounts, "arrived_at_destination");
  const contraOfertaStats = getReportStats(statusCounts, "in_bid");

  const reports = [
    {
      id: 1,
      name: "Usuarios",
      count: totalUsers > 0 ? totalUsers.toString() : "0",
      rate: "100",
      isUp: true,
      icon: <Session className="h-4 w-4" />,
      color: "primary",
      link: "/clientes",
    },
    {
      id: 2,
      name: "Viajes cancelados",
      count: cancelledStats.count.toString(),
      rate: `${cancelledStats.rate}`,
      isUp: cancelledStats.isUp,
      icon: <Eye className="h-4 w-4" />,
      color: "info",
      link: "/solicitudes",
    },
    {
      id: 3,
      name: "Viajes Completados",
      count: completedStats.count.toString(),
      rate: `${completedStats.rate}`,
      isUp: completedStats.isUp,
      icon: <Increase className="h-4 w-4" />,
      color: "warning",
      link: "/solicitudes",
    },
    {
      id: 4,
      name: "Viajes ContraOferta",
      count: contraOfertaStats.count.toString(),
      rate: `${contraOfertaStats.rate}`,
      isUp: contraOfertaStats.isUp,
      icon: <Cup className="h-4 w-4" />,
      color: "destructive",
      link: "/solicitudes",
    },
  ];
  return (
    <>
      {reports.map((item, index) => (
        <Card
          key={`report-card-${index}`}
          className="cursor-pointer hover:shadow-md transition-shadow"
          onClick={() => router.push(item.link)}
        >
          <CardHeader className="flex-col-reverse sm:flex-row flex-wrap gap-2  border-none mb-0 pb-0">
            <span className="text-sm font-medium text-default-900 flex-1">
              {item.name}
            </span>
            <span
              className={cn(
                "flex-none h-9 w-9 flex justify-center items-center bg-default-100 rounded-full",
                {
                  "bg-primary bg-opacity-10 text-primary":
                    item.color === "primary",
                  "bg-info bg-opacity-10 text-info": item.color === "info",
                  "bg-warning bg-opacity-10 text-warning":
                    item.color === "warning",
                  "bg-destructive bg-opacity-10 text-destructive":
                    item.color === "destructive",
                }
              )}
            >
              {item.icon}
            </span>
          </CardHeader>
          <CardContent className="pb-4 px-4">
            <div className="text-2xl font-semibold text-default-900 mb-2.5">
              {item.count}
            </div>
            <div className="flex items-center font-semibold gap-1">
              {item.isUp ? (
                <>
                  <span className="text-success">{item.rate}%</span>
                  <Icon
                    icon="heroicons:arrow-trending-up-16-solid"
                    className="text-success text-xl"
                  />
                </>
              ) : (
                <>
                  <span className="text-destructive">{item.rate}%</span>
                  <Icon
                    icon="heroicons:arrow-trending-down-16-solid"
                    className="text-destructive text-xl"
                  />
                </>
              )
              }
            </div>
            <div className="mt-1 text-xs text-default-600">
              En los ultimos 30 días
            </div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ReportsArea;
