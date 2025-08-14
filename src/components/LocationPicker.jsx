import React from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix default marker icon issue in Leaflet
const markerIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
});

function LocationPicker({ latitude, longitude, onChange }) {
  // Default to Sri Lanka center if no value
  const defaultPosition = [latitude || 7.8731, longitude || 80.7718];

  function LocationMarker() {
    useMapEvents({
      click(e) {
        onChange({
          latitude: e.latlng.lat,
          longitude: e.latlng.lng,
        });
      },
    });
    return latitude && longitude ? (
      <Marker position={[latitude, longitude]} icon={markerIcon} />
    ) : null;
  }

  return (
    <div style={{ height: 300, width: '100%', marginBottom: 16 }}>
      <MapContainer center={defaultPosition} zoom={8} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker />
      </MapContainer>
      <div className="text-xs text-gray-500 mt-2">
        Click on the map to select your location.
      </div>
    </div>
  );
}

export default LocationPicker;
