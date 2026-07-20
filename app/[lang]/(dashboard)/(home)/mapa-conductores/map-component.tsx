"use client";

import { useEffect, useMemo, useState } from "react";
import Leaflet from "leaflet";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Driver } from "@/types/user.interface";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Navigation } from "lucide-react";

interface DriverLocation {
  id: number;
  name: string;
  lat: number;
  lng: number;
  state: string;
  email?: string;
  mobile?: string;
  avatarUrl?: string;
  isRealGps: boolean;
}

// Trujillo (La Libertad) Coordenadas Base [-8.1116, -79.0287]
const TRUJILLO_CENTER: [number, number] = [-8.1116, -79.0287];

// Ícono para Conductores Way
const createCustomWayMarker = (state: string, isRealGps: boolean) => {
  const isActive = state === "ACTIVE";
  const borderColor = isActive ? "#10b981" : "#ef4444";
  
  return Leaflet.divIcon({
    className: "custom-way-driver-marker",
    html: `
      <div style="
        position: relative;
        width: 38px;
        height: 38px;
        background: #ffffff;
        border: 2.5px solid ${borderColor};
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
        cursor: pointer;
      ">
        <img 
          src="/images/marker/car_marker.png" 
          alt="Conductor Way"
          style="width: 22px; height: 22px; object-fit: contain;" 
        />
        ${
          isRealGps
            ? `<span style="
                position: absolute;
                top: -3px;
                right: -3px;
                width: 10px;
                height: 10px;
                border-radius: 50%;
                background: #3b82f6;
                border: 1.5px solid #ffffff;
              " title="GPS en tiempo real"></span>`
            : ""
        }
        <span style="
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: ${borderColor};
          border: 1.5px solid #ffffff;
        "></span>
      </div>
    `,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
    popupAnchor: [0, -19],
  });
};

// Ícono para Mi Dispositivo (Ubicación Actual del Usuario)
const createDeviceMarker = () => {
  return Leaflet.divIcon({
    className: "custom-device-location-marker",
    html: `
      <div style="
        position: relative;
        width: 44px;
        height: 44px;
        background: #2563eb;
        border: 3px solid #ffffff;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: 0 0 15px rgba(37,99,235,0.6);
        color: #ffffff;
      ">
        <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polygon points="3 11 22 2 13 21 11 13 3 11"/>
        </svg>
      </div>
    `,
    iconSize: [44, 44],
    iconAnchor: [22, 22],
    popupAnchor: [0, -22],
  });
};

// Componente para ajustar límites automáticamente
function MapBoundsController({
  locations,
  devicePos,
}: {
  locations: DriverLocation[];
  devicePos: [number, number] | null;
}) {
  const map = useMap();

  useEffect(() => {
    const points: [number, number][] = locations.map((l) => [l.lat, l.lng]);
    if (devicePos) {
      points.push(devicePos);
    }

    if (points.length > 0) {
      const bounds = Leaflet.latLngBounds(points);
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    }
  }, [locations, devicePos, map]);

  return null;
}

export default function RealTimeDriverMap({ drivers }: { drivers: Driver[] }) {
  const [devicePos, setDevicePos] = useState<[number, number] | null>(null);

  // Obtener ubicación GPS del dispositivo del usuario
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setDevicePos([position.coords.latitude, position.coords.longitude]);
        },
        (error) => {
          console.warn("No se pudo obtener la geolocalización del dispositivo:", error);
        },
        { enableHighAccuracy: true }
      );
    }
  }, []);

  const driverLocations: DriverLocation[] = useMemo(() => {
    return drivers.map((driver, index) => {
      const driverId = driver.id || driver.userId || index + 1;
      const rawLat = driver.user?.latitude;
      const rawLng = driver.user?.longitude;

      const isReal =
        typeof rawLat === "number" &&
        typeof rawLng === "number" &&
        !isNaN(rawLat) &&
        !isNaN(rawLng) &&
        rawLat !== 0 &&
        rawLng !== 0;

      let lat = rawLat ?? TRUJILLO_CENTER[0];
      let lng = rawLng ?? TRUJILLO_CENTER[1];

      // Si no tiene GPS registrado en DB, dispersar sobre Trujillo en tierra firme (no en el mar)
      if (!isReal) {
        const offsetLat = Math.sin(driverId * 12.9898) * 0.035;
        const offsetLng = Math.cos(driverId * 78.233) * 0.035;
        lat = TRUJILLO_CENTER[0] + offsetLat;
        lng = TRUJILLO_CENTER[1] + offsetLng;
      }

      return {
        id: driverId,
        name: `${driver.user?.firstName || "Conductor"} ${driver.user?.lastName || ""}`.trim(),
        lat,
        lng,
        state: driver.state || "ACTIVE",
        email: driver.user?.email,
        mobile: driver.user?.mobile,
        avatarUrl: driver.user?.profilePictureUrl,
        isRealGps: isReal,
      };
    });
  }, [drivers]);

  return (
    <div className="w-full h-[650px] rounded-xl overflow-hidden border border-border shadow-lg relative">
      <MapContainer
        center={devicePos || TRUJILLO_CENTER}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <MapBoundsController locations={driverLocations} devicePos={devicePos} />

        {/* Marcador de Mi Dispositivo */}
        {devicePos && (
          <Marker position={devicePos} icon={createDeviceMarker()}>
            <Popup className="rounded-lg shadow-lg">
              <div className="p-1 flex items-center gap-2">
                <Navigation className="h-4 w-4 text-blue-600 animate-pulse" />
                <div>
                  <h4 className="font-bold text-xs text-blue-600">Mi Dispositivo</h4>
                  <p className="text-[10px] text-muted-foreground">Tu ubicación actual en vivo</p>
                </div>
              </div>
            </Popup>
          </Marker>
        )}

        {/* Marcadores de Conductores */}
        {driverLocations.map((loc) => (
          <Marker
            key={loc.id}
            position={[loc.lat, loc.lng]}
            icon={createCustomWayMarker(loc.state, loc.isRealGps)}
          >
            <Popup className="rounded-lg shadow-lg">
              <div className="flex flex-col gap-2 p-1 min-w-[200px]">
                <div className="flex items-center gap-2.5">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={loc.avatarUrl} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
                      {loc.name.charAt(0)?.toUpperCase() || "C"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="overflow-hidden">
                    <h4 className="font-semibold text-xs text-foreground truncate">{loc.name}</h4>
                    <p className="text-[10px] text-muted-foreground truncate">{loc.email || "Sin correo"}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between mt-1 text-xs border-t border-border pt-1.5">
                  <Badge variant="soft" color={loc.state === "ACTIVE" ? "success" : "destructive"} className="text-[10px] px-2 py-0.5">
                    {loc.state}
                  </Badge>
                  <span className="text-[11px] font-medium text-muted-foreground">{loc.mobile || "N/A"}</span>
                </div>
                {loc.isRealGps && (
                  <div className="text-[10px] text-blue-600 font-medium flex items-center gap-1 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-blue-600 inline-block animate-ping"></span>
                    Coordenadas GPS reales desde la app
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
