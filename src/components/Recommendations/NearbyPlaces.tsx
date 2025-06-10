import React, { useEffect, useState } from "react";
import { getNearbyPlaces } from "../../api/recommendations";
import PlaceCard from "../Places/PlaceCard";
import { Place } from "../../types";
import NearbyMap from "./NearbyMap";
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Spinner,
  Text,
  Alert,
  AlertIcon,
  Stack,
  Divider,
  VStack,
  Button,
  HStack,
  Badge,
  useToast,
} from "@chakra-ui/react";
import { RepeatIcon } from "@chakra-ui/icons";

const NearbyPlaces: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [locationStatus, setLocationStatus] = useState<
    "requesting" | "granted" | "denied" | "unavailable"
  >("requesting");
  const toast = useToast();

  const requestLocation = () => {
    setLoading(true);
    setLocationStatus("requesting");

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lng = position.coords.longitude;
          setUserLocation({ lat, lng });
          setLocationStatus("granted");

          try {
            const response = await getNearbyPlaces(lat, lng);
            setPlaces(response);
            toast({
              title: "Location found!",
              description: `Found ${response.length} places near you`,
              status: "success",
              duration: 3000,
            });
          } catch (err) {
            setError("Failed to fetch nearby places");
          }
          setLoading(false);
        },
        async (error) => {
          setLocationStatus("denied");
          // Fallback to Jakarta center
          const defaultLat = -6.2088;
          const defaultLng = 106.8456;
          setUserLocation({ lat: defaultLat, lng: defaultLng });

          try {
            const response = await getNearbyPlaces(defaultLat, defaultLng);
            setPlaces(response);
            toast({
              title: "Using default location",
              description: "Showing places near Jakarta center",
              status: "info",
              duration: 4000,
            });
          } catch (err) {
            setError("Failed to fetch nearby places");
          }
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000, // 5 minutes
        }
      );
    } else {
      setLocationStatus("unavailable");
      // Use Jakarta center as fallback
      const defaultLat = -6.2088;
      const defaultLng = 106.8456;
      setUserLocation({ lat: defaultLat, lng: defaultLng });

      getNearbyPlaces(defaultLat, defaultLng)
        .then((response) => {
          setPlaces(response);
          setLoading(false);
        })
        .catch(() => {
          setError("Failed to fetch nearby places");
          setLoading(false);
        });
    }
  };

  useEffect(() => {
    requestLocation();
  }, []);

  if (loading) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={6}>
          <Box fontSize="4xl" color="teal.500">
            🧭
          </Box>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <VStack spacing={2}>
            <Text fontSize="lg" fontWeight="600" color="gray.700">
              Finding places near you...
            </Text>
            <Text color="gray.500" textAlign="center" maxW="md">
              We're requesting your location to show the most relevant nearby
              attractions
            </Text>
          </VStack>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={6}>
          <Box fontSize="4xl" color="red.400">
            ⚠️
          </Box>
          <Alert status="error" borderRadius="xl" maxW="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="600">Unable to load nearby places</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
          <Button colorScheme="teal" onClick={requestLocation}>
            Try Again
          </Button>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={10}>
        {/* Header */}
        <VStack spacing={4} textAlign="center">
          <HStack spacing={3}>
            <Box fontSize="2xl" color="teal.500">
              📍
            </Box>
            <Heading
              size="xl"
              bgGradient="linear(to-r, teal.500, teal.300)"
              bgClip="text"
            >
              Places Near You
            </Heading>
          </HStack>

          <Text color="gray.600" fontSize="lg" maxW="2xl">
            Discover amazing tourist attractions close to your location
          </Text>

          {/* Location Status */}
          <HStack spacing={4}>
            {locationStatus === "granted" && (
              <Badge
                colorScheme="green"
                variant="subtle"
                borderRadius="full"
                px={4}
                py={1}
              >
                <Box mr={2}>🧭</Box>
                Using your location
              </Badge>
            )}
            {locationStatus === "denied" && (
              <Badge
                colorScheme="orange"
                variant="subtle"
                borderRadius="full"
                px={4}
                py={1}
              >
                <Box mr={2}>📍</Box>
                Using Jakarta center
              </Badge>
            )}
            {locationStatus === "unavailable" && (
              <Badge
                colorScheme="gray"
                variant="subtle"
                borderRadius="full"
                px={4}
                py={1}
              >
                Location unavailable
              </Badge>
            )}

            {userLocation && (
              <Button
                size="sm"
                variant="outline"
                colorScheme="teal"
                leftIcon={<RepeatIcon />}
                onClick={requestLocation}
              >
                Refresh Location
              </Button>
            )}
          </HStack>
        </VStack>

        {/* Map Section */}
        <Box
          w="full"
          bg="white"
          borderRadius="2xl"
          overflow="hidden"
          boxShadow="xl"
          border="1px"
          borderColor="gray.200"
        >
          <NearbyMap places={places} />
        </Box>

        {/* Places List Section */}
        <Box w="full">
          <VStack spacing={6}>
            <HStack justify="space-between" w="full">
              <VStack align="start" spacing={1}>
                <Heading size="lg" color="gray.800">
                  Nearby Attractions
                </Heading>
                <Text color="gray.600">
                  {places.length} place{places.length !== 1 ? "s" : ""} found
                  near you
                </Text>
              </VStack>
            </HStack>

            {places.length === 0 ? (
              <Box textAlign="center" py={20}>
                <VStack spacing={4}>
                  <Box fontSize="4xl" color="gray.300">
                    📍
                  </Box>
                  <Heading size="md" color="gray.500">
                    No nearby places found
                  </Heading>
                  <Text color="gray.400" maxW="md">
                    Try expanding your search area or check back later for new
                    attractions.
                  </Text>
                </VStack>
              </Box>
            ) : (
              <SimpleGrid
                columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
                spacing={8}
                w="full"
                justifyItems="center"
              >
                {places.map((place) => (
                  <PlaceCard key={place.id} place={place} />
                ))}
              </SimpleGrid>
            )}
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default NearbyPlaces;
