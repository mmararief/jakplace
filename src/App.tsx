import React from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import {
  ChakraProvider,
  Box,
  Heading,
  Text,
  Skeleton,
  SkeletonText,
  Spinner,
  Button,
  HStack,
} from "@chakra-ui/react";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Navbar from "./components/Layout/Navbar";
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";
import PlaceList from "./components/Places/PlaceList";
import PlaceDetail from "./components/Places/PlaceDetail";
import PlaceForm from "./components/Places/PlaceForm";
import CategoryRecommendations from "./components/Recommendations/CategoryRecommendations";
import HybridRecommendations from "./components/Recommendations/HybridRecommendations";
import NearbyPlaces from "./components/Recommendations/NearbyPlaces";
import PlaceCard from "./components/Places/PlaceCard";
import { Place } from "./types";
import PerformanceMonitor from "./components/Debug/PerformanceMonitor";

const PrivateRoute: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { user, authLoading } = useAuth();
  if (authLoading) {
    return (
      <Box
        minH="60vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Spinner size="xl" color="teal.500" />
      </Box>
    );
  }
  return user ? <>{children}</> : <Navigate to="/login" />;
};

const HomePage: React.FC<{ userId?: number }> = ({ userId }) => {
  const { user } = useAuth();
  // Hybrid recommendations
  const [recommendations, setRecommendations] = React.useState<Place[]>([]);
  const [loadingRec, setLoadingRec] = React.useState(true);
  const [errorRec, setErrorRec] = React.useState<string | null>(null);
  // Category recommendations
  const [categoryRecs, setCategoryRecs] = React.useState<Place[]>([]);
  const [loadingCat, setLoadingCat] = React.useState(true);
  const [errorCat, setErrorCat] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!userId) return;
    const fetchRecommendations = async () => {
      try {
        const data = await import("./api/recommendations").then((m) =>
          m.getRecommendationsByUser(userId)
        );
        setRecommendations(data);
      } catch (err) {
        setErrorRec("Failed to fetch recommendations");
      } finally {
        setLoadingRec(false);
      }
    };
    fetchRecommendations();
    console.log(user);
  }, [userId]);

  React.useEffect(() => {
    if (!user || !user.preferences || user.preferences.length === 0) {
      setLoadingCat(false);
      return;
    }
    const fetchCategoryRecs = async () => {
      try {
        const data = await import("./api/recommendations").then((m) =>
          m.getRecommendationsByCategory(user.preferences)
        );
        setCategoryRecs(data);
      } catch (err) {
        setErrorCat("Failed to fetch category recommendations");
      } finally {
        setLoadingCat(false);
      }
    };
    fetchCategoryRecs();
  }, [user]);

  return (
    <Box maxW="container.xl" mx="auto" px={{ base: 4, md: 6 }}>
      {/* Hero Section */}
      <Box textAlign="center" py={{ base: 8, md: 16 }} mb={{ base: 8, md: 12 }}>
        <Heading
          size={{ base: "xl", md: "2xl" }}
          mb={4}
          bgGradient="linear(to-r, teal.500, teal.300)"
          bgClip="text"
          px={{ base: 2, md: 0 }}
        >
          Welcome to Wisata Jakarta
        </Heading>
        <Text
          fontSize={{ base: "md", md: "xl" }}
          color="gray.600"
          maxW="2xl"
          mx="auto"
          mb={8}
          px={{ base: 2, md: 0 }}
        >
          Discover the beauty and culture of Jakarta through personalized
          recommendations tailored just for you
        </Text>
        {!user && (
          <Box px={{ base: 2, md: 0 }}>
            <Text fontSize={{ base: "md", md: "lg" }} color="gray.500" mb={6}>
              Sign in to get personalized recommendations based on your
              preferences
            </Text>
            <HStack
              spacing={{ base: 2, md: 4 }}
              justify="center"
              flexWrap="wrap"
              gap={{ base: 2, md: 0 }}
            >
              <Button
                as="a"
                href="/login"
                colorScheme="teal"
                size={{ base: "md", md: "lg" }}
                borderRadius="full"
                px={{ base: 6, md: 8 }}
                fontSize={{ base: "sm", md: "md" }}
              >
                Sign In
              </Button>
              <Button
                as="a"
                href="/register"
                variant="outline"
                colorScheme="teal"
                size={{ base: "md", md: "lg" }}
                borderRadius="full"
                px={{ base: 6, md: 8 }}
                fontSize={{ base: "sm", md: "md" }}
              >
                Sign Up
              </Button>
            </HStack>
          </Box>
        )}
      </Box>

      {/* Personalized Recommendations */}
      {userId && (
        <Box mb={16}>
          <Box mb={8}>
            <Heading size="lg" mb={2}>
              🎯 Personalized For You
            </Heading>
            <Text color="gray.600" fontSize="lg">
              Based on your activity and preferences
            </Text>
          </Box>

          {loadingRec ? (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={{ base: 4, md: 8 }}
              justifyContent="center"
            >
              {[...Array(3)].map((_, i) => (
                <Box key={i} maxW="320px" w="full">
                  <Skeleton h="220px" mb={4} borderRadius="2xl" />
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
              ))}
            </Box>
          ) : errorRec ? (
            <Box
              textAlign="center"
              py={{ base: 8, md: 12 }}
              bg="red.50"
              borderRadius="xl"
              border="1px"
              borderColor="red.100"
              mx={{ base: 2, md: 0 }}
            >
              <Text
                color="red.500"
                fontSize={{ base: "md", md: "lg" }}
                px={{ base: 2, md: 0 }}
              >
                {errorRec}
              </Text>
            </Box>
          ) : recommendations.length === 0 ? (
            <Box
              textAlign="center"
              py={{ base: 8, md: 12 }}
              bg="gray.50"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              mx={{ base: 2, md: 0 }}
            >
              <Text
                color="gray.500"
                fontSize={{ base: "md", md: "lg" }}
                px={{ base: 2, md: 0 }}
              >
                No personalized recommendations yet. Explore some places to get
                started!
              </Text>
            </Box>
          ) : (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={{ base: 4, md: 8 }}
              justifyContent="center"
              mb={6}
            >
              {recommendations.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Category-based Recommendations */}
      {user && user.preferences && user.preferences.length > 0 && (
        <Box mb={{ base: 8, md: 16 }}>
          <Box mb={8} px={{ base: 2, md: 0 }}>
            <Heading size={{ base: "md", md: "lg" }} mb={2}>
              ⭐ Based on Your Interests
            </Heading>
            <Text
              color="gray.600"
              fontSize={{ base: "sm", md: "lg" }}
              lineHeight="1.5"
            >
              Places matching your favorite categories:{" "}
              {user.preferences.join(", ")}
            </Text>
          </Box>

          {loadingCat ? (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={{ base: 4, md: 8 }}
              justifyContent="center"
            >
              {[...Array(3)].map((_, i) => (
                <Box key={i} maxW="320px" w="full">
                  <Skeleton h="220px" mb={4} borderRadius="2xl" />
                  <SkeletonText mt="4" noOfLines={4} spacing="4" />
                </Box>
              ))}
            </Box>
          ) : errorCat ? (
            <Box
              textAlign="center"
              py={{ base: 8, md: 12 }}
              bg="red.50"
              borderRadius="xl"
              border="1px"
              borderColor="red.100"
              mx={{ base: 2, md: 0 }}
            >
              <Text
                color="red.500"
                fontSize={{ base: "md", md: "lg" }}
                px={{ base: 2, md: 0 }}
              >
                {errorCat}
              </Text>
            </Box>
          ) : categoryRecs.length === 0 ? (
            <Box
              textAlign="center"
              py={{ base: 8, md: 12 }}
              bg="gray.50"
              borderRadius="xl"
              border="1px"
              borderColor="gray.200"
              mx={{ base: 2, md: 0 }}
            >
              <Text
                color="gray.500"
                fontSize={{ base: "md", md: "lg" }}
                px={{ base: 2, md: 0 }}
              >
                No category recommendations found.
              </Text>
            </Box>
          ) : (
            <Box
              display="flex"
              flexWrap="wrap"
              gap={{ base: 4, md: 8 }}
              justifyContent="center"
            >
              {categoryRecs.map((place) => (
                <PlaceCard key={place.id} place={place} />
              ))}
            </Box>
          )}
        </Box>
      )}

      {/* Call to Action */}
      <Box textAlign="center" py={{ base: 8, md: 16 }} px={{ base: 2, md: 0 }}>
        <Box
          bg="gradient-to-br from-teal-50 to-teal-100"
          p={{ base: 6, md: 12 }}
          borderRadius="3xl"
          border="1px"
          borderColor="teal.200"
        >
          <Heading
            size={{ base: "md", md: "lg" }}
            mb={4}
            color="teal.700"
            px={{ base: 2, md: 0 }}
          >
            Explore All Jakarta Destinations
          </Heading>
          <Text
            color="teal.600"
            fontSize={{ base: "md", md: "lg" }}
            mb={8}
            maxW="2xl"
            mx="auto"
            px={{ base: 2, md: 0 }}
            lineHeight="1.6"
          >
            Browse through our complete collection of tourist attractions, from
            historic landmarks to modern entertainment venues.
          </Text>
          <Button
            as="a"
            href="/places"
            size={{ base: "md", md: "lg" }}
            colorScheme="teal"
            borderRadius="full"
            px={{ base: 8, md: 12 }}
            py={{ base: 4, md: 6 }}
            fontSize={{ base: "sm", md: "lg" }}
            fontWeight="600"
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "xl",
            }}
            transition="all 0.2s"
          >
            🗺️ View All Places
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

// Halaman all places
const AllPlacesPage: React.FC = () => {
  return <PlaceList />;
};

const AppContent = () => {
  const { user } = useAuth();
  return (
    <Box minH="100vh">
      <Navbar />
      <Box py={{ base: 4, md: 8 }}>
        <Routes>
          <Route path="/" element={<HomePage userId={user?.id} />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/places/new"
            element={
              <PrivateRoute>
                <PlaceForm onSubmit={() => {}} />
              </PrivateRoute>
            }
          />
          <Route path="/places/:id" element={<PlaceDetail />} />
          <Route path="/places" element={<AllPlacesPage />} />
          <Route
            path="/recommendations/category"
            element={
              <PrivateRoute>
                <CategoryRecommendations category="museum" />
              </PrivateRoute>
            }
          />
          <Route
            path="/recommendations/hybrid"
            element={
              <PrivateRoute>
                {user ? <HybridRecommendations userId={user.id} /> : null}
              </PrivateRoute>
            }
          />
          <Route
            path="/recommendations/nearby"
            element={
              <PrivateRoute>
                <NearbyPlaces />
              </PrivateRoute>
            }
          />
        </Routes>
      </Box>
    </Box>
  );
};

const App = () => {
  return (
    <ChakraProvider>
      <AuthProvider>
        <Router>
          <AppContent />
          <PerformanceMonitor />
        </Router>
      </AuthProvider>
    </ChakraProvider>
  );
};

export default App;
