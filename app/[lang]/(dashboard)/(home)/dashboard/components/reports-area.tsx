"use client";
import { Cup, Eye, Increase, Session } from "@/components/svg";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { cn, getReportStats } from "@/lib/utils";
import { Icon } from "@iconify/react";
import { useRouter } from "next/navigation";

import { DashboardData } from "@/hooks/use-fetch-dashboard";

interface ReportsAreaProps {
  data: DashboardData;
  loading: boolean;
  errors: Record<string, string>;
}

const ReportsArea = ({ data, loading, errors }: ReportsAreaProps) => {
  const router = useRouter();
  const {
    statusCounts,
    userPeriods,
    incidents,
    driversRating,
    driversOnline,
    tripsToday,
    platformEarnings,
  } = data;
  const money = (n: number) =>
    `S/ ${Number(n || 0).toLocaleString("es-PE", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  const todayBy = tripsToday?.byState ?? {};
  const todayNote = tripsToday
    ? `${todayBy["arrived_at_destination"] ?? 0} completados · ${
        todayBy["cancelled"] ?? 0
      } cancelados`
    : "Hora de Lima";

  const cancelledStats = getReportStats(statusCounts, "cancelled");
  const completedStats = getReportStats(statusCounts, "arrived_at_destination");
  const contraOfertaStats = getReportStats(statusCounts, "in_bid");
  const usersStats = getReportStats({ u: userPeriods }, "u");
  const incidentStats = getReportStats({ i: incidents }, "i");

  // unavailable: la fuente fallo y no hay dato previo
  const reports: {
    id: number;
    name: string;
    count: string;
    rate?: string;
    isUp?: boolean;
    badWhenUp?: boolean;
    unavailable?: boolean;
    icon: JSX.Element;
    color: string;
    link: string;
    note: string;
  }[] = [
    {
      id: 1,
      name: "Nuevos usuarios",
      count: String(usersStats.count),
      rate: usersStats.rate,
      isUp: usersStats.isUp,
      unavailable: !userPeriods,
      icon: <Session className="h-4 w-4" />,
      color: "primary",
      link: "/clientes",
      note: "En los ultimos 30 días",
    },
    {
      id: 2,
      name: "Viajes cancelados",
      count: cancelledStats.count.toString(),
      rate: cancelledStats.rate,
      isUp: cancelledStats.isUp,
      badWhenUp: true,
      unavailable: !statusCounts,
      icon: <Eye className="h-4 w-4" />,
      color: "info",
      link: "/solicitudes",
      note: "En los ultimos 30 días",
    },
    {
      id: 3,
      name: "Viajes Completados",
      count: completedStats.count.toString(),
      rate: completedStats.rate,
      isUp: completedStats.isUp,
      unavailable: !statusCounts,
      icon: <Increase className="h-4 w-4" />,
      color: "warning",
      link: "/solicitudes",
      note: "En los ultimos 30 días",
    },
    {
      id: 4,
      name: "Viajes ContraOferta",
      count: contraOfertaStats.count.toString(),
      rate: contraOfertaStats.rate,
      isUp: contraOfertaStats.isUp,
      unavailable: !statusCounts,
      icon: <Cup className="h-4 w-4" />,
      color: "destructive",
      link: "/solicitudes",
      note: "En los ultimos 30 días",
    },
    {
      id: 5,
      name: "Incidentes",
      count: String(incidentStats.count),
      rate: incidentStats.rate,
      isUp: incidentStats.isUp,
      badWhenUp: true,
      unavailable: !incidents,
      icon: <Icon icon="heroicons:exclamation-triangle" className="h-4 w-4" />,
      color: "destructive",
      link: "",
      note: "En los ultimos 30 días",
    },
    {
      id: 6,
      name: "Calificación conductores",
      count:
        typeof driversRating === "number" ? Number(driversRating).toFixed(2) : "-",
      unavailable: typeof driversRating !== "number",
      icon: <Icon icon="heroicons:star" className="h-4 w-4" />,
      color: "warning",
      link: "/conductores",
      note: "Promedio general",
    },
    {
      id: 7,
      name: "Conductores online (en viaje)",
      count: driversOnline
        ? `${driversOnline.online} (${driversOnline.activeInTrip})`
        : "-",
      unavailable: !driversOnline,
      icon: <Icon icon="heroicons:signal" className="h-4 w-4" />,
      color: "success",
      link: "/conductores",
      note: driversOnline
        ? `De ${driversOnline.total} conductores activos`
        : "En este momento",
    },
    {
      id: 8,
      name: "Viajes de hoy",
      count: tripsToday ? String(tripsToday.total) : "-",
      unavailable: !tripsToday,
      icon: <Icon icon="heroicons:map-pin" className="h-4 w-4" />,
      color: "info",
      link: "/solicitudes",
      note: todayNote,
    },
    {
      id: 9,
      name: "Ingresos plataforma (30 días)",
      count: platformEarnings ? money(platformEarnings.platformEarnings) : "-",
      unavailable: !platformEarnings,
      icon: <Icon icon="heroicons:banknotes" className="h-4 w-4" />,
      color: "primary",
      link: "",
      note: platformEarnings
        ? `${platformEarnings.totalTrips} viajes cobrados por ${money(
            platformEarnings.totalTripsAmount
          )}`
        : "Comisión de la plataforma",
    },
    {
      id: 10,
      name: "Bonos primer viaje asumidos",
      count: platformEarnings ? money(platformEarnings.firstTripBonusAmount) : "-",
      unavailable: !platformEarnings,
      icon: <Icon icon="heroicons:gift" className="h-4 w-4" />,
      color: "warning",
      link: "",
      note: "En los ultimos 30 días",
    },
  ];

  if (loading) {
    return (
      <>
        {reports.map((item) => (
          <Card key={`report-skeleton-${item.id}`}>
            <CardContent className="p-4 animate-pulse space-y-3">
              <div className="h-4 w-1/2 bg-default-200 rounded" />
              <div className="h-7 w-1/3 bg-default-200 rounded" />
              <div className="h-3 w-2/3 bg-default-100 rounded" />
            </CardContent>
          </Card>
        ))}
      </>
    );
  }

  return (
    <>
      {reports.map((item) => (
        <Card
          key={`report-card-${item.id}`}
          className={cn(
            "transition-shadow",
            item.link && "cursor-pointer hover:shadow-md"
          )}
          onClick={() => item.link && router.push(item.link)}
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
                  "bg-success bg-opacity-10 text-success":
                    item.color === "success",
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
              {item.unavailable ? "-" : item.count}
            </div>
            {item.unavailable ? (
              <div className="text-xs text-destructive">
                {Object.keys(errors).length ? "Dato no disponible" : "Sin datos"}
              </div>
            ) : item.rate !== undefined ? (
              <div className="flex items-center font-semibold gap-1">
                <span
                  className={
                    item.isUp !== !!item.badWhenUp
                      ? "text-success"
                      : "text-destructive"
                  }
                >
                  {item.rate}%
                </span>
                <Icon
                  icon={
                    item.isUp
                      ? "heroicons:arrow-trending-up-16-solid"
                      : "heroicons:arrow-trending-down-16-solid"
                  }
                  className={cn(
                    "text-xl",
                    item.isUp !== !!item.badWhenUp
                      ? "text-success"
                      : "text-destructive"
                  )}
                />
              </div>
            ) : null}
            <div className="mt-1 text-xs text-default-600">{item.note}</div>
          </CardContent>
        </Card>
      ))}
    </>
  );
};

export default ReportsArea;
