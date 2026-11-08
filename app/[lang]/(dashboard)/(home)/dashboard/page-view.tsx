"use client";

import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";
import ReportsSnapshot from "./components/reports-snapshot";
import ReportsArea from "./components/reports-area";
import {
  DASHBOARD_SOURCES,
  useDashboardData,
} from "@/hooks/use-fetch-dashboard";
import RecentRecharges from "./components/recent-recharges";

interface DashboardPageViewProps {
  trans: {
    [key: string]: string;
  };
}
const DashboardPageView = ({ trans }: DashboardPageViewProps) => {
  const { data, loading, refreshing, errors, lastUpdated, refresh } =
    useDashboardData();
  const allFailed = !loading && Object.keys(errors).length >= DASHBOARD_SOURCES;

  return (
    <div className="space-y-6">
      <div className="flex items-center flex-wrap justify-between gap-4">
        <div className="text-2xl font-medium text-default-800 ">Dashboard</div>
        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-xs text-default-600">
              Actualizado: {lastUpdated.toLocaleTimeString("es-PE")}
            </span>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={refresh}
            disabled={refreshing || loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Actualizar
          </Button>
        </div>
      </div>

      {allFailed && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm font-medium">
          No se pudieron cargar los datos del tablero. Revisa tu conexión o
          vuelve a iniciar sesión y pulsa Actualizar.
        </div>
      )}

      {/* indicadores */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        <ReportsArea data={data} loading={loading} errors={errors} />
      </div>

      {/* recargas recientes */}
      <RecentRecharges data={data} loading={loading} errors={errors} />

      {/* grafico de registros */}
      <ReportsSnapshot data={data} loading={loading} errors={errors} />
    </div>
  );
};

export default DashboardPageView;
