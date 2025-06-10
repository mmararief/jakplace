import React, { useEffect, useState } from "react";
import {
  Container,
  SimpleGrid,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Box,
  Select,
  HStack,
  Spinner,
  Text,
  useToast,
  VStack,
  Flex,
  Badge,
} from "@chakra-ui/react";
import { SearchIcon } from "@chakra-ui/icons";
import { getPlaces } from "../../api/places";
import PlaceCard from "./PlaceCard";
import { Place } from "../../types";

const PlaceList: React.FC = () => {
  const [places, setPlaces] = useState<Place[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const toast = useToast();

  useEffect(() => {
    const fetchPlaces = async () => {
      try {
        const data = await getPlaces();
        setPlaces(data);
      } catch (error) {
        toast({
          title: "Error fetching places",
          description: "Please try again later",
          status: "error",
          duration: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPlaces();
  }, [toast]);

  const categories = Array.from(new Set(places.map((place) => place.category)));

  const filteredPlaces = places.filter((place) => {
    const matchesSearch =
      place.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      place.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || place.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (loading) {
    return (
      <Container maxW="container.xl" centerContent py={20}>
        <VStack spacing={4}>
          <Spinner size="xl" color="teal.500" thickness="4px" />
          <Text color="gray.500" fontSize="lg">
            Loading amazing places...
          </Text>
        </VStack>
      </Container>
    );
  }

  return (
    <Container maxW="container.xl" py={8}>
      {/* Header */}
      <VStack spacing={6} mb={10} textAlign="center">
        <HStack spacing={3}>
          <Box fontSize="2xl" color="teal.500">
            📍
          </Box>
          <Heading
            size="xl"
            bgGradient="linear(to-r, teal.500, teal.300)"
            bgClip="text"
          >
            Discover Jakarta's Tourist Attractions
          </Heading>
        </HStack>
        <Text color="gray.600" fontSize="lg" maxW="2xl">
          Explore the beauty and culture of Jakarta through these amazing
          destinations
        </Text>
      </VStack>

      {/* Search and Filter Section */}
      <Box
        bg="white"
        p={6}
        borderRadius="2xl"
        shadow="lg"
        mb={8}
        border="1px"
        borderColor="gray.100"
      >
        <Flex
          direction={{ base: "column", md: "row" }}
          gap={4}
          align={{ base: "stretch", md: "center" }}
        >
          <Box flex={1}>
            <InputGroup size="lg">
              <InputLeftElement pointerEvents="none">
                <SearchIcon color="gray.400" />
              </InputLeftElement>
              <Input
                placeholder="Search places by name or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                borderRadius="xl"
                bg="gray.50"
                border="none"
                _focus={{
                  bg: "white",
                  boxShadow: "0 0 0 3px rgba(56, 178, 172, 0.1)",
                }}
              />
            </InputGroup>
          </Box>

          <HStack spacing={2}>
            <Box color="gray.500">🔍</Box>
            <Select
              placeholder="All Categories"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              minW="200px"
              size="lg"
              borderRadius="xl"
              bg="gray.50"
              border="none"
              _focus={{
                bg: "white",
                boxShadow: "0 0 0 3px rgba(56, 178, 172, 0.1)",
              }}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </Select>
          </HStack>
        </Flex>

        {/* Filter Summary */}
        <HStack mt={4} spacing={4}>
          <Text fontSize="sm" color="gray.600" fontWeight="500">
            {filteredPlaces.length} place
            {filteredPlaces.length !== 1 ? "s" : ""} found
          </Text>
          {selectedCategory && (
            <Badge
              colorScheme="teal"
              variant="subtle"
              borderRadius="full"
              px={3}
            >
              Category: {selectedCategory}
            </Badge>
          )}
          {searchTerm && (
            <Badge
              colorScheme="blue"
              variant="subtle"
              borderRadius="full"
              px={3}
            >
              Search: "{searchTerm}"
            </Badge>
          )}
        </HStack>
      </Box>

      {/* Results */}
      {filteredPlaces.length === 0 ? (
        <Box textAlign="center" py={20}>
          <VStack spacing={4}>
            <Box fontSize="4xl" color="gray.300">
              📍
            </Box>
            <Heading size="md" color="gray.500">
              No places found
            </Heading>
            <Text color="gray.400" maxW="md">
              Try adjusting your search terms or category filter to find what
              you're looking for.
            </Text>
          </VStack>
        </Box>
      ) : (
        <SimpleGrid
          columns={{ base: 1, md: 2, lg: 3, xl: 4 }}
          spacing={8}
          justifyItems="center"
        >
          {filteredPlaces.map((place) => (
            <PlaceCard key={place.id} place={place} />
          ))}
        </SimpleGrid>
      )}
    </Container>
  );
};

export default PlaceList;
