'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

import L from 'leaflet';
import StaticCircle from '@/components/staticCircle';

const ViajePage = () => {
  const searchParams = useSearchParams();
  const [viaje, setViaje] = useState(null);

  useEffect(() => {
    // Simulación de datos (debería venir de una API)
    setViaje({
      id: searchParams.get('id') || '12345',
      fecha: '11 de julio, jueves • 9:50 am',
      estado: 'Completado',
      origen: { lat: -12.0464, lng: -77.0428, direccion: 'Av. Húsares de Junín 1210' },
      destino: { lat: -12.057, lng: -77.038, direccion: 'Real Plaza' },
      precio: 9,
      metodoPago: 'Yape',
      vehiculo: { placa: 'TKM-688', color: 'Blanco', modelo: 'Toyota Corolla' },
      conductor: { nombre: 'Gonzalo Torres Llanos', rating: 4.0, viajes: 95, foto: 'https://i0.wp.com/lamiradafotografia.es/wp-content/uploads/2014/07/foto-perfil-psicologo-180x180.jpg?resize=180%2C180' }
    });
  }, [searchParams]);

  if (!viaje) return <p>Cargando...</p>;

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h2 className="text-xl font-semibold mb-2">{viaje.fecha}</h2>
      <p className="text-green-600 font-medium">✅ {viaje.estado}</p>

      {/* Mapa con origen y destino */}
      <div className="h-64 w-full rounded-md overflow-hidden my-4">
        <MapContainer center={[viaje.origen.lat, viaje.origen.lng]} zoom={14} className="h-full w-full">
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <Marker position={[viaje.origen.lat, viaje.origen.lng]} icon={L.icon({ iconUrl: '/images/marker-start.png', iconSize: [25, 41] })} />
          <Marker position={[viaje.destino.lat, viaje.destino.lng]} icon={L.icon({ iconUrl: '/images/marker-end.png', iconSize: [25, 41] })} />
        </MapContainer>
      </div>

      {/* Información del viaje */}
      <div className="bg-gray-100 p-4 rounded-md">
        <div className='flex items-center gap-2'>
         <StaticCircle /> <strong> Origen:</strong> {viaje.origen.direccion}
        </div>
        <div className='flex items-center gap-2'>
         <StaticCircle color='#FBAE17' /> <strong> Destino:</strong> {viaje.destino.direccion}
        </div>

        <p>💰 <strong>Precio:</strong> S/ {viaje.precio} ({viaje.metodoPago})</p>
      </div>

      {/* Información del conductor */}
      <div className="flex items-center mt-4 space-x-4">
        <img src={viaje.conductor.foto} alt="Conductor" className="w-12 h-12 rounded-full" />
        <div>
          <p className="text-lg font-medium">{viaje.conductor.nombre}</p>
          <p>⭐ {viaje.conductor.rating} ({viaje.conductor.viajes} viajes)</p>
        </div>
      </div>

      {/* Información del vehículo */}
      <div className="bg-gray-100 p-4 rounded-md mt-4">
        <p>🚗 <strong>Placa:</strong> {viaje.vehiculo.placa}</p>
        <p>🎨 <strong>Color:</strong> {viaje.vehiculo.color}</p>
        <p>🚘 <strong>Modelo:</strong> {viaje.vehiculo.modelo}</p>
      </div>

      {/* Botón de acción */}
      <Button className="mt-4 w-full bg-blue-600 text-white">Contactar al conductor</Button>
    </div>
  );
};

export default ViajePage;
