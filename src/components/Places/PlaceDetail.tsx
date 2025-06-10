import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPlaceById, ratePlaceById } from "../../api/places";
import {
  getRecommendationsByPlace,
  getNearbyPlaces,
} from "../../api/recommendations";
import { Place } from "../../types";
import { recommendationCache } from "../../utils/cache";
import {
  Box,
  Image,
  Heading,
  Text,
  Badge,
  Stack,
  Button,
  Flex,
  Skeleton,
  SkeletonText,
  useColorModeValue,
  HStack,
  VStack,
  Container,
  Divider,
  Grid,
  GridItem,
  useToast,
  Alert,
  AlertIcon,
  SimpleGrid,
  Switch,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { ArrowBackIcon, StarIcon } from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";
import { InteractiveMap } from "../Map";
import PlaceCard from "./PlaceCard";
import { useDebounce } from "../../hooks/useDebounce";
import { useRef, useCallback } from "react";

const PlaceDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [place, setPlace] = useState<Place | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [similarPlaces, setSimilarPlaces] = useState<Place[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] =
    useState<boolean>(false);
  const [showRadius, setShowRadius] = useState<boolean>(false);
  const [nearbyPlaces, setNearbyPlaces] = useState<Place[]>([]);
  const [loadingNearby, setLoadingNearby] = useState<boolean>(false);
  const [recommendationsLoaded, setRecommendationsLoaded] =
    useState<boolean>(false);

  // Debounce showRadius to prevent rapid API calls
  const debouncedShowRadius = useDebounce(showRadius, 500);

  // Ref for intersection observer
  const recommendationRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userRating, setUserRating] = useState<number>(0);
  const [submitting, setSubmitting] = useState(false);
  const toast = useToast();

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  useEffect(() => {
    const fetchPlace = async () => {
      try {
        const data = await getPlaceById(Number(id));
        setPlace(data);

        // Don't fetch recommendations immediately - use lazy loading instead
        // This reduces initial server load
      } catch (err) {
        setError("Failed to fetch place details");
      } finally {
        setLoading(false);
      }
    };
    fetchPlace();
  }, [id]);

  const submitRating = async () => {
    if (!place || userRating === 0) return;

    setSubmitting(true);
    try {
      await ratePlaceById(place.id, { value: userRating });

      // Refresh place details
      const updatedPlace = await getPlaceById(Number(id));
      setPlace(updatedPlace);
      setUserRating(0);

      // Clear user-specific cache since rating affects hybrid recommendations
      if (user) {
        const clearedCount = recommendationCache.clearUserCache(user.id);
        console.log(
          `🗑️ Cleared ${clearedCount} user cache entries after rating`
        );
      }

      toast({
        title: "Rating submitted!",
        description: `You rated this place ${userRating} star${
          userRating > 1 ? "s" : ""
        }`,
        status: "success",
        duration: 3000,
      });
    } catch (err: any) {
      toast({
        title: "Failed to submit rating",
        description: "Please try again later",
        status: "error",
        duration: 3000,
      });
    } finally {
      setSubmitting(false);
    }
  };

  // Fetch nearby places when radius is shown
  const fetchNearbyPlaces = async () => {
    if (!place) return;

    setLoadingNearby(true);
    try {
      const nearby = await getNearbyPlaces(place.latitude, place.longitude);
      // Filter out current place
      const filteredNearby = nearby.filter((p) => p.id !== place.id);
      setNearbyPlaces(filteredNearby);
    } catch (err) {
      console.error("Failed to fetch nearby places:", err);
      toast({
        title: "Unable to load nearby places",
        description: "Please try again later",
        status: "warning",
        duration: 3000,
      });
    } finally {
      setLoadingNearby(false);
    }
  };

  // Effect to fetch nearby places when showRadius changes (debounced)
  useEffect(() => {
    if (debouncedShowRadius && place) {
      fetchNearbyPlaces();
    } else {
      setNearbyPlaces([]);
    }
  }, [debouncedShowRadius, place]);

  // Lazy load recommendations only when user scrolls to recommendation section
  const loadRecommendationsLazily = useCallback(() => {
    if (!recommendationsLoaded && place) {
      setRecommendationsLoaded(true);
      // Fetch recommendations here instead of immediately on page load
      setLoadingRecommendations(true);
      getRecommendationsByPlace(place.id)
        .then((recommendations) => {
          setSimilarPlaces(recommendations);
        })
        .catch((err) => {
          console.error("Failed to fetch recommendations:", err);
        })
        .finally(() => {
          setLoadingRecommendations(false);
        });
    }
  }, [recommendationsLoaded, place]);

  // Intersection Observer for lazy loading
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          loadRecommendationsLazily();
        }
      },
      { rootMargin: "100px" } // Load 100px before entering viewport
    );

    if (recommendationRef.current) {
      observer.observe(recommendationRef.current);
    }

    return () => {
      if (recommendationRef.current) {
        observer.unobserve(recommendationRef.current);
      }
    };
  }, [loadRecommendationsLazily]);

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <VStack spacing={6} align="stretch">
          <Skeleton h="60px" w="200px" />
          <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={8}>
            <Skeleton h="400px" borderRadius="2xl" />
            <VStack spacing={4} align="stretch">
              <Skeleton h="40px" />
              <Skeleton h="20px" w="150px" />
              <SkeletonText noOfLines={4} spacing="4" />
              <Skeleton h="30px" w="200px" />
            </VStack>
          </SimpleGrid>
        </VStack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={6}>
          <Box fontSize="4xl">⚠️</Box>
          <Alert status="error" borderRadius="xl" maxW="md">
            <AlertIcon />
            <VStack align="start" spacing={2}>
              <Text fontWeight="600">Unable to load place details</Text>
              <Text fontSize="sm">{error}</Text>
            </VStack>
          </Alert>
          <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </VStack>
      </Container>
    );
  }

  if (!place) {
    return (
      <Container maxW="container.xl" py={20}>
        <VStack spacing={6}>
          <Box fontSize="4xl">🔍</Box>
          <Heading size="md" color="gray.500">
            Place not found
          </Heading>
          <Text color="gray.400">
            The place you're looking for doesn't exist or has been removed.
          </Text>
          <Button leftIcon={<ArrowBackIcon />} onClick={() => navigate(-1)}>
            Go Back
          </Button>
        </VStack>
      </Container>
    );
  }

  const hasUserRated =
    user && place.userRating !== null && place.userRating !== undefined;

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        {/* Back Button */}
        <Button
          leftIcon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          variant="ghost"
          size="lg"
          w="fit-content"
          _hover={{
            bg: "gray.100",
            transform: "translateX(-4px)",
          }}
          transition="all 0.2s"
        >
          Back to Places
        </Button>

        {/* Main Content */}
        <SimpleGrid columns={{ base: 1, lg: 2 }} spacing={10}>
          {/* Image Section */}
          <Box>
            <Box
              position="relative"
              borderRadius="2xl"
              overflow="hidden"
              boxShadow="2xl"
              bg={cardBg}
              border="1px"
              borderColor={borderColor}
            >
              <Image
                src={place.image_url}
                alt={place.name}
                w="100%"
                h={{ base: "300px", md: "400px" }}
                objectFit="cover"
                transition="transform 0.3s ease-in-out"
                _hover={{ transform: "scale(1.05)" }}
              />

              {/* Overlay badges */}
              <Badge
                position="absolute"
                top={4}
                left={4}
                colorScheme="teal"
                variant="solid"
                borderRadius="full"
                px={4}
                py={2}
                fontSize="sm"
                fontWeight="600"
                textTransform="capitalize"
              >
                {place.category}
              </Badge>

              {place.avgRating && (
                <Badge
                  position="absolute"
                  top={4}
                  right={4}
                  bg="blackAlpha.700"
                  color="white"
                  borderRadius="full"
                  px={3}
                  py={2}
                  fontSize="sm"
                  display="flex"
                  alignItems="center"
                  gap={2}
                >
                  <Box color="yellow.400">⭐</Box>
                  {place.avgRating.toFixed(1)}
                </Badge>
              )}
            </Box>
          </Box>

          {/* Details Section */}
          <VStack spacing={6} align="stretch">
            {/* Title and Basic Info */}
            <VStack spacing={4} align="stretch">
              <Heading
                size="xl"
                color={useColorModeValue("gray.800", "white")}
                lineHeight="1.2"
              >
                {place.name}
              </Heading>

              <Text color={textColor} fontSize="lg" lineHeight="1.6">
                {place.description}
              </Text>
            </VStack>

            <Divider />

            {/* Info Grid */}
            <Grid templateColumns="repeat(2, 1fr)" gap={6}>
              <GridItem>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={textColor} fontWeight="600">
                    💰 Entry Price
                  </Text>
                  <Text fontSize="xl" fontWeight="700" color="teal.600">
                    {place.price === 0
                      ? "Free Entry"
                      : `Rp ${place.price.toLocaleString()}`}
                  </Text>
                </VStack>
              </GridItem>

              <GridItem>
                <VStack align="start" spacing={2}>
                  <Text fontSize="sm" color={textColor} fontWeight="600">
                    📍 Location
                  </Text>
                  <Text color={textColor} fontSize="sm">
                    {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                  </Text>
                  <Button
                    size="sm"
                    variant="outline"
                    colorScheme="teal"
                    onClick={() => {
                      const url = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
                      window.open(url, "_blank");
                    }}
                  >
                    📍 Open in Maps
                  </Button>
                </VStack>
              </GridItem>
            </Grid>

            <Divider />

            {/* Rating Section */}
            <VStack align="stretch" spacing={4}>
              <Text
                fontSize="lg"
                fontWeight="600"
                color={useColorModeValue("gray.800", "white")}
              >
                ⭐ Ratings & Reviews
              </Text>

              {/* Average Rating Display */}
              <HStack spacing={4} align="center">
                <HStack spacing={1}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <Box
                      key={star}
                      color={
                        star <= (place.avgRating || 0)
                          ? "yellow.400"
                          : "gray.300"
                      }
                    >
                      ⭐
                    </Box>
                  ))}
                </HStack>
                <Text fontWeight="600" color={textColor}>
                  {place.avgRating
                    ? `${place.avgRating.toFixed(1)} out of 5`
                    : "No ratings yet"}
                </Text>
              </HStack>

              {/* User Rating Section */}
              {user ? (
                hasUserRated ? (
                  <Box
                    p={4}
                    bg="teal.50"
                    borderRadius="xl"
                    border="1px"
                    borderColor="teal.200"
                  >
                    <HStack spacing={3}>
                      <Box color="teal.500">✅</Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="600" color="teal.700">
                          You rated this place
                        </Text>
                        <HStack>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Box
                              key={star}
                              color={
                                star <= (place.userRating || 0)
                                  ? "yellow.400"
                                  : "gray.300"
                              }
                            >
                              ⭐
                            </Box>
                          ))}
                          <Text color="teal.600" fontWeight="600">
                            ({place.userRating}/5)
                          </Text>
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                ) : (
                  <Box
                    p={6}
                    bg={cardBg}
                    borderRadius="xl"
                    border="1px"
                    borderColor={borderColor}
                    boxShadow="md"
                  >
                    <VStack spacing={4} align="stretch">
                      <Text
                        fontWeight="600"
                        color={useColorModeValue("gray.800", "white")}
                      >
                        Rate this place
                      </Text>

                      <HStack spacing={2}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Box
                            key={star}
                            color={
                              star <= userRating ? "yellow.400" : "gray.300"
                            }
                            cursor="pointer"
                            fontSize="2xl"
                            transition="all 0.2s"
                            _hover={{
                              transform: "scale(1.2)",
                              color: "yellow.400",
                            }}
                            onClick={() => setUserRating(star)}
                          >
                            ⭐
                          </Box>
                        ))}
                      </HStack>

                      {userRating > 0 && (
                        <Text color={textColor} fontSize="sm">
                          You selected {userRating} star
                          {userRating > 1 ? "s" : ""}
                        </Text>
                      )}

                      <Button
                        colorScheme="teal"
                        size="md"
                        isLoading={submitting}
                        isDisabled={userRating === 0}
                        onClick={submitRating}
                        borderRadius="full"
                        _hover={{
                          transform: "translateY(-2px)",
                          boxShadow: "lg",
                        }}
                        transition="all 0.2s"
                      >
                        Submit Rating
                      </Button>
                    </VStack>
                  </Box>
                )
              ) : (
                <Box
                  p={4}
                  bg="gray.50"
                  borderRadius="xl"
                  border="1px"
                  borderColor="gray.200"
                  textAlign="center"
                >
                  <Text color={textColor}>
                    Please sign in to rate this place
                  </Text>
                  <Button
                    mt={3}
                    size="sm"
                    colorScheme="teal"
                    variant="outline"
                    onClick={() => navigate("/login")}
                  >
                    Sign In
                  </Button>
                </Box>
              )}
            </VStack>
          </VStack>
        </SimpleGrid>

        {/* Interactive Map Section */}
        <VStack spacing={6} align="stretch">
          <Divider />

          <VStack spacing={4} align="stretch">
            <HStack spacing={3} align="center">
              <Box fontSize="2xl">🗺️</Box>
              <Heading size="lg" color={useColorModeValue("gray.800", "white")}>
                Interactive Location Map
              </Heading>
            </HStack>

            <Text color={textColor} fontSize="md">
              Explore the exact location of {place.name} on the interactive map
              below. You can zoom, pan, and click on the marker for more
              details.
            </Text>

            <HStack justify="space-between" align="center" w="full">
              <Text fontSize="sm" color={textColor}>
                Map Options:
              </Text>
              <FormControl display="flex" alignItems="center" w="auto">
                <FormLabel
                  htmlFor="show-radius"
                  mb="0"
                  fontSize="sm"
                  color={textColor}
                >
                  Show nearby attractions
                  {loadingNearby && " (loading...)"}
                </FormLabel>
                <Switch
                  id="show-radius"
                  colorScheme="teal"
                  isChecked={showRadius}
                  onChange={(e) => setShowRadius(e.target.checked)}
                  isDisabled={loadingNearby}
                />
              </FormControl>
            </HStack>

            <InteractiveMap
              latitude={place.latitude}
              longitude={place.longitude}
              placeName={place.name}
              height="450px"
              showRadius={showRadius}
              radiusInKm={2}
              nearbyPlaces={nearbyPlaces}
            />

            {/* Nearby Places Info */}
            {showRadius && nearbyPlaces.length > 0 && (
              <Box
                p={4}
                bg="teal.50"
                borderRadius="xl"
                border="1px"
                borderColor="teal.200"
              >
                <HStack spacing={2} justify="center">
                  <Box color="teal.500">🎯</Box>
                  <Text fontSize="sm" color="teal.700" fontWeight="600">
                    Found {nearbyPlaces.length} attraction
                    {nearbyPlaces.length !== 1 ? "s" : ""} within 2km radius
                  </Text>
                </HStack>
                <Text fontSize="xs" color="teal.600" textAlign="center" mt={1}>
                  Click on map markers to explore nearby places
                </Text>
              </Box>
            )}

            <HStack spacing={4} justify="center" flexWrap="wrap">
              <Button
                leftIcon={<Box>🧭</Box>}
                colorScheme="teal"
                variant="outline"
                size="md"
                onClick={() => {
                  const url = `https://www.google.com/maps?q=${place.latitude},${place.longitude}`;
                  window.open(url, "_blank");
                }}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Open in Google Maps
              </Button>

              <Button
                leftIcon={<Box>📍</Box>}
                colorScheme="blue"
                variant="outline"
                size="md"
                onClick={() => {
                  const url = `https://maps.apple.com/?q=${place.latitude},${place.longitude}`;
                  window.open(url, "_blank");
                }}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Open in Apple Maps
              </Button>

              <Button
                leftIcon={<Box>🚗</Box>}
                colorScheme="orange"
                variant="outline"
                size="md"
                onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(
                      (position) => {
                        const { latitude: userLat, longitude: userLng } =
                          position.coords;
                        const url = `https://www.google.com/maps/dir/${userLat},${userLng}/${place.latitude},${place.longitude}`;
                        window.open(url, "_blank");
                      },
                      () => {
                        // Fallback if location access is denied
                        const url = `https://www.google.com/maps/dir//${place.latitude},${place.longitude}`;
                        window.open(url, "_blank");
                      }
                    );
                  }
                }}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "md",
                }}
                transition="all 0.2s"
              >
                Get Directions
              </Button>
            </HStack>
          </VStack>
        </VStack>

        {/* Recommendations Section */}
        <VStack spacing={6} align="stretch" ref={recommendationRef}>
          <Divider />

          {(similarPlaces.length > 0 ||
            loadingRecommendations ||
            recommendationsLoaded) && (
            <VStack spacing={4} align="stretch">
              <HStack spacing={3} align="center">
                <Box fontSize="2xl">💡</Box>
                <Heading
                  size="lg"
                  color={useColorModeValue("gray.800", "white")}
                >
                  Recommended for You
                </Heading>
              </HStack>

              <Text color={textColor} fontSize="md">
                Discover personalized recommendations based on your interests
                and this place's characteristics
              </Text>

              {loadingRecommendations ? (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Box key={i}>
                      <Skeleton h="200px" borderRadius="xl" />
                      <SkeletonText mt={4} noOfLines={3} spacing="2" />
                    </Box>
                  ))}
                </SimpleGrid>
              ) : (
                <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
                  {similarPlaces.map((recommendedPlace) => (
                    <PlaceCard
                      key={recommendedPlace.id}
                      place={recommendedPlace}
                    />
                  ))}
                </SimpleGrid>
              )}

              <Box textAlign="center" pt={4}>
                <Button
                  colorScheme="teal"
                  variant="outline"
                  size="lg"
                  onClick={() => navigate("/places")}
                  _hover={{
                    transform: "translateY(-2px)",
                    boxShadow: "lg",
                  }}
                  transition="all 0.2s"
                >
                  🔍 Explore All Places
                </Button>
              </Box>
            </VStack>
          )}
        </VStack>
      </VStack>
    </Container>
  );
};

export default PlaceDetail;
