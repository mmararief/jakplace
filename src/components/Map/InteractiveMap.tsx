import React from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import { Box } from "@chakra-ui/react";
import "leaflet/dist/leaflet.css";

// Fix leaflet default marker icons in React
import L from "leaflet";
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface InteractiveMapProps {
  latitude: number;
  longitude: number;
  placeName: string;
  height?: string;
  borderRadius?: string;
  showRadius?: boolean;
  radiusInKm?: number;
  nearbyPlaces?: Array<{
    id: number;
    name: string;
    latitude: number;
    longitude: number;
    category: string;
  }>;
}

const InteractiveMap: React.FC<InteractiveMapProps> = ({
  latitude,
  longitude,
  placeName,
  height = "400px",
  borderRadius = "xl",
  showRadius = false,
  radiusInKm = 2,
  nearbyPlaces = [],
}) => {
  const position: [number, number] = [latitude, longitude];
  const radiusInMeters = radiusInKm * 1000;

  // Create custom icon for nearby places
  const createCustomIcon = (category: string) => {
    const categoryIcons: { [key: string]: string } = {
      museum: "🏛️",
      park: "🌳",
      restaurant: "🍽️",
      temple: "🕌",
      mall: "🏬",
      beach: "🏖️",
      default: "📍",
    };

    const icon = categoryIcons[category.toLowerCase()] || categoryIcons.default;

    return new L.DivIcon({
      html: `<div style="
        background: white;
        border-radius: 50%;
        width: 30px;
        height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        border: 2px solid #06B6D4;
        box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        font-size: 16px;
      ">${icon}</div>`,
      className: "custom-div-icon",
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  return (
    <Box
      height={height}
      borderRadius={borderRadius}
      overflow="hidden"
      border="1px"
      borderColor="gray.200"
      boxShadow="lg"
    >
      <MapContainer
        center={position}
        zoom={showRadius ? 13 : 15}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* Show radius circle if enabled */}
        {showRadius && (
          <Circle
            center={position}
            pathOptions={{
              color: "#06B6D4",
              fillColor: "#06B6D4",
              fillOpacity: 0.1,
              weight: 2,
            }}
            radius={radiusInMeters}
          />
        )}

        {/* Main place marker */}
        <Marker position={position}>
          <Popup>
            <div style={{ textAlign: "center", padding: "8px" }}>
              <strong>{placeName}</strong>
              <br />
              📍 {latitude.toFixed(4)}, {longitude.toFixed(4)}
              {showRadius && (
                <>
                  <br />
                  🔘 {radiusInKm}km radius area
                  <br />
                  <small>🎯 You are here</small>
                </>
              )}
            </div>
          </Popup>
        </Marker>

        {/* Nearby places markers */}
        {nearbyPlaces.map((place) => (
          <Marker
            key={place.id}
            position={[place.latitude, place.longitude]}
            icon={createCustomIcon(place.category)}
          >
            <Popup>
              <div style={{ textAlign: "center", padding: "8px" }}>
                <strong>{place.name}</strong>
                <br />
                <span
                  style={{
                    background: "#06B6D4",
                    color: "white",
                    padding: "2px 8px",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                >
                  {place.category}
                </span>
                <br />
                📍 {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                <br />
                <a
                  href={`/places/${place.id}`}
                  style={{
                    color: "#06B6D4",
                    textDecoration: "none",
                    fontSize: "12px",
                  }}
                >
                  👁️ View Details
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </Box>
  );
};

export default InteractiveMap;
