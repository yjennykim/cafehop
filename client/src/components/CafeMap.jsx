import React, { Suspense } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const CafeMap = ({ cafes }) => {
  if (!cafes.length) return null;

  const defaultPosition = [47.6062, -122.3321];

  return (
    <div className="h-[500px] rounded overflow-hidden shadow my-6">
      <Suspense fallback={<div>Loading map...</div>}>
        <MapContainer
          center={defaultPosition}
          zoom={13}
          className="h-full w-full"
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://carto.com/">CARTO</a> & OpenStreetMap contributors'
          />

          {cafes.map((cafe, index) => (
            <Marker key={index} position={[47.6062, -122.3321]}>
              <Popup>
                <strong>{cafe.name}</strong>
                <br />
                {cafe.address}
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </Suspense>
    </div>
  );
};

export default CafeMap;
