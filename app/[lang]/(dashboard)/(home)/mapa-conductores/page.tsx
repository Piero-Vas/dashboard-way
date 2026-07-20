"use client";

import dynamic from "next/dynamic";
import { useFetchAllDrivers } from "@/hooks/use-fetch-driver-requirement";
import { Loader2, MapPin, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

const RealTimeDriverMap = dynamic(
  () => import("./map-component"),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[600px] flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-border">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
        <p className="text-sm text-muted-foreground font-medium">Cargando Mapa de Conductores...</p>
      </div>
    ),
  }
);

export default function DriverMapPage() {
  const { drivers, loading, error, refetch } = useFetchAllDrivers();

  // Filtrar solo los conductores que han sido aprobados como tal (excluyendo INIT_VEHICLE, INIT_DOCUMENTS, PENDING, REJECTED)
  const approvedDrivers = drivers.filter(
    (d) => d.state === "ACTIVE" || d.state === "INACTIVE" || d.state === "SUSPENDED"
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <MapPin className="h-6 w-6 text-primary" />
            Mapa de Conductores en Tiempo Real
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Visualiza la ubicación geográfica de los conductores **aprobados** en la plataforma ({approvedDrivers.length} de {drivers.length} registrados).
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => refetch()} className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4" />
          Actualizar Ubicaciones
        </Button>
      </div>

      {loading ? (
        <div className="w-full h-[600px] flex flex-col items-center justify-center bg-muted/20 rounded-xl border border-border">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-2" />
          <p className="text-sm text-muted-foreground font-medium">Consultando conductores...</p>
        </div>
      ) : error ? (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 text-sm font-medium">
          Error al cargar conductores: {error}
        </div>
      ) : (
        <RealTimeDriverMap drivers={approvedDrivers} />
      )}
    </div>
  );
}
