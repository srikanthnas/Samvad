import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useEffect } from 'react';

// Fix for default marker icons in React Leaflet
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface CivicMapProps {
  lat: number;
  lng: number;
  address?: string;
  zoom?: number;
  interactive?: boolean;
}

// Component to handle map centering when coordinates change
function ChangeView({ center, zoom }: { center: [number, number], zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export const CivicMap = ({ lat, lng, address, zoom = 15, interactive = true }: CivicMapProps) => {
  const position: [number, number] = [lat, lng];

  return (
    <div className="w-full h-full rounded-[2rem] overflow-hidden shadow-inner border border-border/50">
      <MapContainer 
        center={position} 
        zoom={zoom} 
        scrollWheelZoom={interactive}
        dragging={interactive}
        zoomControl={interactive}
        style={{ height: '100%', width: '100%', zIndex: 1 }}
      >
        <ChangeView center={position} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          // Using a slightly more muted tile layer for a cleaner look
          // url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
        />
        <Marker position={position}>
          {address && (
            <Popup className="civic-popup">
              <div className="font-bold text-sm">{address}</div>
            </Popup>
          )}
        </Marker>
      </MapContainer>
    </div>
  );
};
