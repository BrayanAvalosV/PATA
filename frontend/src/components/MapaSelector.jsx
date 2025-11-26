// frontend/src/components/MapaSelector.jsx
import React from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
} from "react-leaflet";

const DEFAULT_CENTER = {
  lat: -29.90453, // aprox La Serena / Coquimbo
  lng: -71.24894,
};

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function MapaSelector({
  posicion,
  setPosicion,
  radioMetros,
  setRadioMetros,
}) {
  const center = posicion || DEFAULT_CENTER;

  return (
    <div className="space-y-2 mt-2">
      <p className="text-sm text-gray-700">
        Haz clic en el mapa para indicar la última zona donde fue vista la
        mascota. No se guardará tu dirección exacta, solo un área aproximada.
      </p>

      <div className="rounded-xl overflow-hidden border border-green-200 shadow-sm">
        <MapContainer
          center={center}
          zoom={14}
          style={{ width: "100%", height: "280px" }}
          scrollWheelZoom
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contrib.'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <ClickHandler
            onSelect={(latlng) => {
              setPosicion({ lat: latlng.lat, lng: latlng.lng });
            }}
          />

          {posicion && (
            <>
              <Marker position={posicion} />
              <Circle center={posicion} radius={radioMetros || 300} />
            </>
          )}
        </MapContainer>
      </div>

      <div className="flex items-center gap-3 text-sm">
        <label className="text-gray-700">
          Radio aproximado (m):
          <input
            type="number"
            min={50}
            max={3000}
            step={50}
            value={radioMetros}
            onChange={(e) =>
              setRadioMetros(Number(e.target.value) || 300)
            }
            className="ml-2 w-24 border rounded-lg px-2 py-1 text-sm"
          />
        </label>
      </div>
    </div>
  );
}
