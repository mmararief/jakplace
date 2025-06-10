import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Image,
  Heading,
  Text,
  Stack,
  Badge,
  Button,
  useColorModeValue,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { Place } from "../../types";

interface PlaceCardProps {
  place: Place;
}

const PlaceCard: React.FC<PlaceCardProps> = ({ place }) => {
  const navigate = useNavigate();
  const { id, name, description, category, price, image_url, avgRating } =
    place;

  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.600", "gray.300");
  const priceColor = useColorModeValue("teal.600", "teal.300");

  return (
    <Box
      maxW="320px"
      w="full"
      bg={cardBg}
      boxShadow="xl"
      rounded="2xl"
      overflow="hidden"
      cursor="pointer"
      onClick={() => navigate(`/places/${id}`)}
      _hover={{
        transform: "translateY(-8px)",
        boxShadow: "2xl",
        transition: "all 0.3s ease-in-out",
      }}
      transition="all 0.3s ease-in-out"
      border="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <Box position="relative" h="220px" overflow="hidden">
        <Image
          src={image_url}
          alt={name}
          w="full"
          h="full"
          objectFit="cover"
          transition="transform 0.3s ease-in-out"
          _hover={{ transform: "scale(1.1)" }}
        />

        {/* Category Badge */}
        <Badge
          position="absolute"
          top={3}
          left={3}
          colorScheme="teal"
          variant="solid"
          borderRadius="full"
          px={3}
          py={1}
          fontSize="xs"
          fontWeight="600"
          textTransform="capitalize"
        >
          {category}
        </Badge>

        {/* Rating Badge */}
        {avgRating && (
          <Badge
            position="absolute"
            top={3}
            right={3}
            bg="blackAlpha.700"
            color="white"
            borderRadius="full"
            px={2}
            py={1}
            fontSize="xs"
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box color="yellow.400">⭐</Box>
            {avgRating.toFixed(1)}
          </Badge>
        )}
      </Box>

      <VStack p={6} spacing={4} align="stretch">
        <VStack spacing={2} align="stretch">
          <Heading
            fontSize="lg"
            fontWeight="700"
            color={useColorModeValue("gray.800", "white")}
            noOfLines={2}
            lineHeight="1.3"
          >
            {name}
          </Heading>

          <Text color={textColor} fontSize="sm" noOfLines={2} lineHeight="1.4">
            {description}
          </Text>
        </VStack>

        <HStack justify="space-between" align="center">
          <VStack spacing={1} align="start">
            <Text fontSize="xs" color={textColor} fontWeight="500">
              Entry Price
            </Text>
            <Text color={priceColor} fontWeight="700" fontSize="lg">
              {price === 0 ? "Free" : `Rp ${price.toLocaleString()}`}
            </Text>
          </VStack>

          <Button
            leftIcon={<ViewIcon />}
            colorScheme="teal"
            size="sm"
            borderRadius="full"
            fontWeight="600"
            px={6}
            _hover={{
              transform: "translateY(-2px)",
              boxShadow: "lg",
            }}
            transition="all 0.2s"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/places/${id}`);
            }}
          >
            View Details
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PlaceCard;
