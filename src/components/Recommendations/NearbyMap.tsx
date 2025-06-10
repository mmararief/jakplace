import React, { useEffect, useState, useCallback } from "react";
import { Box, Spinner, Text } from "@chakra-ui/react";
import mapboxgl from "mapbox-gl";

// Ganti dengan token Mapbox Anda
mapboxgl.accessToken =
  "pk.eyJ1IjoiYW1tYXJhcmllZiIsImEiOiJjbHowdmZka2owcjlhMmpwcWpwbTczcGFyIn0.Eo-K9lO5rdqkG7wA9EV1QQ";

const NearbyMap: React.FC<{ places?: any[] }> = ({ places = [] }) => {
  const [map, setMap] = useState<mapboxgl.Map | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<[number, number] | null>(
    null
  );
  const mapContainer = React.useRef<HTMLDivElement>(null);

  // Get user location
  useEffect(() => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation([
            position.coords.longitude,
            position.coords.latitude,
          ]);
        },
        () => {
          // Fallback ke lokasi Jakarta jika user tidak mengizinkan
          setUserLocation([106.8456, -6.2088]);
        }
      );
    } else {
      setUserLocation([106.8456, -6.2088]); // Default ke Jakarta
    }
  }, []);

  // Initialize map
  const initializeMap = useCallback(() => {
    if (!mapContainer.current || !userLocation) return;

    try {
      const newMap = new mapboxgl.Map({
        container: mapContainer.current,
        style: "mapbox://styles/mapbox/streets-v12",
        center: userLocation,
        zoom: 12,
      });

      // Add navigation control
      newMap.addControl(new mapboxgl.NavigationControl(), "top-right");

      // Wait for map to load
      newMap.on("load", () => {
        // Add user location marker
        new mapboxgl.Marker({ color: "#0000FF" })
          .setLngLat(userLocation)
          .addTo(newMap);

        // Add markers for places
        places.forEach((place) => {
          const marker = new mapboxgl.Marker({ color: "#FF0000" })
            .setLngLat([place.longitude, place.latitude])
            .setPopup(
              new mapboxgl.Popup({ offset: 25 }).setHTML(
                `<h3>${place.name}</h3><p>${place.category}</p>`
              )
            )
            .addTo(newMap);
        });

        setLoading(false);
      });

      newMap.on("error", () => {
        setError("Error loading map");
        setLoading(false);
      });

      setMap(newMap);

      return () => {
        newMap.remove();
      };
    } catch (err) {
      console.error("Map initialization error:", err);
      setError("Failed to initialize map");
      setLoading(false);
    }
  }, [userLocation, places]);

  // Initialize map when user location is available
  useEffect(() => {
    if (userLocation) {
      initializeMap();
    }
  }, [userLocation, initializeMap]);

  if (error) return <Text color="red.500">{error}</Text>;

  return (
    <Box position="relative">
      <Box
        ref={mapContainer}
        h={{ base: "300px", md: "400px" }}
        w="100%"
        borderRadius={{ base: "md", md: "lg" }}
        overflow="hidden"
        position="relative"
      />
      {loading && (
        <Box
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
        >
          <Spinner size={{ base: "lg", md: "xl" }} />
        </Box>
      )}
    </Box>
  );
};

export default NearbyMap;
