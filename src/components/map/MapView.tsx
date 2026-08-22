import React, { useEffect, useState, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Navigation, Sparkles, MapPin, ExternalLink, Calendar, PlusCircle } from 'lucide-react';
import { Trip, City } from '../../types';
import { mockCities } from '../../data/mockData';
import { formatCurrency } from '../../lib/utils';
import { Link } from 'react-router-dom';

// Custom Leaflet DivIcons with crisp styling
const createTripMarker = (number: number | string, isCurrent: boolean = false) => {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div style="
        width: 36px;
        height: 36px;
        background: ${isCurrent ? '#10B981' : '#2563EB'};
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 13px;
        box-shadow: 0 4px 14px rgba(0, 0, 0, 0.4), 0 0 12px ${isCurrent ? 'rgba(16, 185, 129, 0.6)' : 'rgba(37, 99, 235, 0.6)'};
        border: 3px solid #ffffff;
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
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -20],
  });
};

const createCityMarker = (cityName: string) => {
  return L.divIcon({
    className: 'custom-city-marker',
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: linear-gradient(135deg, #4f46e5, #06b6d4);
        color: white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 800;
        font-size: 12px;
        box-shadow: 0 4px 12px rgba(79, 70, 229, 0.5);
        border: 2.5px solid #ffffff;
        position: relative;
        cursor: pointer;
      ">
        📍
      </div>
    `,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18],
  });
};

function MapRecenterController({ center, zoom }: { center: [number, number]; zoom?: number }) {
  const map = useMap();
  useEffect(() => {
    map.flyTo(center, zoom || map.getZoom(), {
      duration: 1.2,
      easeLinearity: 0.25,
    });
  }, [center, zoom, map]);
  return null;
}

interface MapViewProps {
  trip?: Trip | null;
  selectedCityId?: string;
  onSelectCity?: (cityName: string) => void;
  showAllCities?: boolean;
  className?: string;
  centerOverride?: [number, number] | null;
}

export const MapView: React.FC<MapViewProps> = ({
  trip,
  selectedCityId,
  onSelectCity,
  showAllCities = false,
  className = 'h-[580px] w-full',
  centerOverride,
}) => {
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationStatus, setLocationStatus] = useState<string>('Detecting location...');

  // Fallback / Initial center (India center or first stop)
  const defaultCenter: [number, number] = useMemo(() => {
    if (centerOverride) return centerOverride;
    if (trip?.stops && trip.stops.length > 0) {
      return [trip.stops[0].lat, trip.stops[0].lng];
    }
    return [20.5937, 78.9629];
  }, [trip, centerOverride]);

  // Geolocation handling
  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([position.coords.latitude, position.coords.longitude]);
          setLocationStatus('GPS Active');
        },
        () => {
          setLocationStatus('GPS Off');
        },
        { timeout: 8000 }
      );
    } else {
      setLocationStatus('GPS Off');
    }
  }, []);

  // Compute route points
  const stops = useMemo(() => {
    if (trip?.stops && trip.stops.length > 0) {
      return trip.stops;
    }
    return [];
  }, [trip]);

  const routePolyline: [number, number][] = useMemo(() => {
    return stops.map((s) => [s.lat, s.lng]);
  }, [stops]);

  const activeCenter = centerOverride || defaultCenter;

  return (
    <div className={`relative rounded-3xl overflow-hidden border border-white/15 shadow-2xl ${className}`}>
      {/* Geolocation & Status Pill */}
      <div className="absolute top-4 left-4 z-20 bg-slate-900/85 backdrop-blur-xl px-3.5 py-1.5 rounded-full shadow-lg border border-white/15 text-xs font-semibold text-white flex items-center gap-2">
        <Navigation className={`w-3.5 h-3.5 ${userLocation ? 'text-emerald-400 animate-pulse' : 'text-slate-400'}`} />
        <span>{locationStatus}</span>
        {stops.length > 0 && (
          <span className="bg-blue-600/80 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-400/40">
            {stops.length} Stops
          </span>
        )}
      </div>

      <MapContainer
        center={activeCenter}
        zoom={stops.length > 1 ? 6 : 5}
        scrollWheelZoom={true}
        className="w-full h-full z-10"
      >
        <MapRecenterController center={activeCenter} zoom={centerOverride ? 8 : (stops.length > 1 ? 6 : 5)} />

        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* User location marker if permitted */}
        {userLocation && (
          <Marker position={userLocation} icon={createTripMarker('🧭', true)}>
            <Popup>
              <div className="p-1 font-bold text-xs text-slate-900">
                📍 You are currently here
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Line Connecting Stops */}
        {routePolyline.length > 1 && (
          <Polyline
            positions={routePolyline}
            pathOptions={{
              color: '#3B82F6',
              weight: 5,
              dashArray: '10, 10',
              opacity: 0.95,
            }}
          />
        )}

        {/* Selected Trip Stops Markers */}
        {stops.map((stop, idx) => (
          <Marker
            key={stop.id || idx}
            position={[stop.lat, stop.lng]}
            icon={createTripMarker(stop.order || idx + 1, selectedCityId === stop.cityName)}
            eventHandlers={{
              click: () => onSelectCity?.(stop.cityName),
            }}
          >
            <Popup>
              <div className="p-2 min-w-52 text-slate-900">
                <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5 mb-1.5">
                  <span className="font-extrabold text-sm">{stop.cityName}</span>
                  <span className="text-[10px] bg-blue-100 text-blue-800 font-bold px-2 py-0.5 rounded-full">
                    Stop #{stop.order || idx + 1}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-1 font-medium">
                  {stop.daysCount ? `${stop.daysCount} Days Stay` : 'Scheduled stop'}
                </p>
                {stop.notes && (
                  <p className="text-[11px] text-slate-700 bg-slate-100 p-2 rounded-lg italic my-1.5">
                    "{stop.notes}"
                  </p>
                )}
                {trip && (
                  <Link
                    to={`/trips/${trip.id}/itinerary`}
                    className="mt-2 text-[11px] font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
                  >
                    View Day Itinerary <ExternalLink className="w-3 h-3" />
                  </Link>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* All Major Tourist Destinations (if in showAllCities mode or when exploring) */}
        {showAllCities &&
          mockCities.map((city) => {
            const isAlreadyStop = stops.some((s) => s.cityName.toLowerCase() === city.name.toLowerCase());
            if (isAlreadyStop) return null; // already rendered as numbered trip stop

            return (
              <Marker
                key={city.id}
                position={[city.lat, city.lng]}
                icon={createCityMarker(city.name)}
                eventHandlers={{
                  click: () => onSelectCity?.(city.name),
                }}
              >
                <Popup>
                  <div className="p-2 min-w-56 text-slate-900">
                    <div className="h-24 w-full rounded-lg overflow-hidden mb-2 bg-slate-100 relative">
                      <img
                        src={city.imageUrl}
                        alt={city.name}
                        className="w-full h-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                      <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
                        {city.climate}
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-1 mb-1">
                      <span className="font-extrabold text-sm">{city.name}</span>
                      <span className="text-[10px] bg-indigo-100 text-indigo-800 font-bold px-2 py-0.5 rounded-full">
                        {city.region}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-600 line-clamp-2 mb-2">
                      {city.description}
                    </p>
                    <div className="flex items-center justify-between border-t border-slate-100 pt-1.5 text-xs">
                      <span className="font-bold text-blue-700">
                        {formatCurrency(city.averageDailyCost, city.currency)} / day
                      </span>
                      <Link
                        to={`/explore`}
                        className="text-[10px] font-bold text-indigo-600 hover:underline"
                      >
                        Explore City
                      </Link>
                    </div>
                  </div>
                </Popup>
              </Marker>
            );
          })}
      </MapContainer>
    </div>
  );
};
