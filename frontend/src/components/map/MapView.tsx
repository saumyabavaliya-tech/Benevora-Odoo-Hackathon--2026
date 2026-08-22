import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, Layers, Info } from 'lucide-react';
import { Trip, TripStop } from '../../types';
import { mockCities } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { Button } from '../common/Button';

// Fix custom Leaflet DivIcons
const createCustomMarker = (number: number | string, isCurrent: boolean = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 34px;
        height: 34px;
        background: ${isCurrent ? '#10B981' : '#2563EB'};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 12px rgba(37, 99, 235, 0.4);
        border: 3px solid white;
        position: relative;
        cursor: pointer;
      ">
        ${number}
        ${
          isCurrent
            ? '<span style="position: absolute; inset: -4px; border-radius: 50%; border: 2px solid #10B981; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></span>'
            : ''
        }
      </div>
    `,
    iconSize: [34, 34],
    iconAnchor: [17, 17],
    popupAnchor: [0, -18],
  });
};

function ChangeMapView({ coords }: { coords: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(coords, map.getZoom());
  }, [coords, map]);
  return null;
}

interface MapViewProps {
  trip?: Trip | null;
  selectedCityId?: string;
  onSelectCity?: (cityName: string) => void;
  className?: string;
}

export const MapView: React.FC<MapViewProps> = ({
  trip,
  selectedCityId,
  onSelectCity,
  className = 'h-[500px] w-full',
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');

  // Fallback / Initial center (India center or first stop)
  const defaultCenter: [number, number] = trip?.stops[0]
    ? [trip.stops[0].lat, trip.stops[0].lng]
    : [20.5937, 78.9629];

  // Geolocation handling
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('You are here');
        },
        () => {
          setLocationStatus('Location unavailable');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationStatus('Location unavailable');
    }
  }, []);

  // Compute route points
  const stops = trip?.stops && trip.stops.length > 0
    ? trip.stops
    : mockCities.slice(0, 3).map((c, i) => ({
        id: `s-${c.id}`,
        cityId: c.id,
        cityName: c.name,
        country: c.country,
        arrivalDate: '2026-09-10',
        departureDate: '2026-09-12',
        daysCount: 2,
        order: i + 1,
        lat: c.lat,
        lng: c.lng,
      }));

  const routePolyline: [number, number][] = stops.map((s) => [s.lat, s.lng]);

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-slate-200/80 shadow-md ${className}`}>
      {/* Geolocation & Status Pill */}
      <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-full shadow-md border border-slate-200/80 text-xs font-semibold text-slate-700 flex items-center gap-2">
        <Navigation className={`w-3.5 h-3.5 ${userLocation ? 'text-emerald-500 animate-pulse' : 'text-slate-400'}`} />
        <span>{locationStatus}</span>
      </div>

      <MapContainer
        center={defaultCenter}
        zoom={stops.length > 1 ? 5 : 6}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker if permitted */}
        {userLocation && (
          <Marker position={userLocation} icon={createCustomMarker('📍', true)}>
            <Popup>
              <div className="p-1 font-bold text-xs text-slate-900">
                🧭 Your Current Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line Connecting Stops */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#2563EB',
              weight: 4,
              dashArray: '8, 8',
              opacity: 0.85,
            }}
          />
        )}

        {/* Destination Markers */}
        {stops.map((stop, idx) => (
          <Marker
            key={stop.id || idx}
            position={[stop.lat, stop.lng]}
            icon={createCustomMarker(stop.order || idx + 1)}
            eventHandlers={{
              click: () => onSelectCity?.(stop.cityName),
            }}
          >
            <Popup>
              <div className="p-2 min-w-44 text-slate-900">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                  <span className="font-extrabold text-sm">{stop.cityName}</span>
                  <span className="text-[10px] bg-blue-50 text-blue-700 font-bold px-2 py-0.5 rounded-full">
                    Stop #{stop.order || idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-1">
                  {stop.daysCount ? `${stop.daysCount} Days Stay` : 'Scheduled stop'}
                </p>
                {stop.notes && (
                  <p className="text-[11px] text-slate-600 bg-slate-50 p-1.5 rounded italic">
                    "{stop.notes}"
                  </p>
                )}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};
