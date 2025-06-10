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
      maxW={{ base: "280px", sm: "300px", md: "320px" }}
      w="full"
      bg={cardBg}
      boxShadow="xl"
      rounded="2xl"
      overflow="hidden"
      cursor="pointer"
      onClick={() => navigate(`/places/${id}`)}
      _hover={{
        transform: { base: "translateY(-4px)", md: "translateY(-8px)" },
        boxShadow: "2xl",
        transition: "all 0.3s ease-in-out",
      }}
      transition="all 0.3s ease-in-out"
      border="1px"
      borderColor={useColorModeValue("gray.100", "gray.700")}
    >
      <Box
        position="relative"
        h={{ base: "180px", md: "220px" }}
        overflow="hidden"
      >
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
          top={{ base: 2, md: 3 }}
          left={{ base: 2, md: 3 }}
          colorScheme="teal"
          variant="solid"
          borderRadius="full"
          px={{ base: 2, md: 3 }}
          py={1}
          fontSize={{ base: "2xs", md: "xs" }}
          fontWeight="600"
          textTransform="capitalize"
        >
          {category}
        </Badge>

        {/* Rating Badge */}
        {avgRating && (
          <Badge
            position="absolute"
            top={{ base: 2, md: 3 }}
            right={{ base: 2, md: 3 }}
            bg="blackAlpha.700"
            color="white"
            borderRadius="full"
            px={{ base: 1.5, md: 2 }}
            py={1}
            fontSize={{ base: "2xs", md: "xs" }}
            display="flex"
            alignItems="center"
            gap={1}
          >
            <Box color="yellow.400">⭐</Box>
            {avgRating.toFixed(1)}
          </Badge>
        )}
      </Box>

      <VStack
        p={{ base: 4, md: 6 }}
        spacing={{ base: 3, md: 4 }}
        align="stretch"
      >
        <VStack spacing={2} align="stretch">
          <Heading
            fontSize={{ base: "md", md: "lg" }}
            fontWeight="700"
            color={useColorModeValue("gray.800", "white")}
            noOfLines={2}
            lineHeight="1.3"
          >
            {name}
          </Heading>

          <Text
            color={textColor}
            fontSize={{ base: "xs", md: "sm" }}
            noOfLines={2}
            lineHeight="1.4"
          >
            {description}
          </Text>
        </VStack>

        <HStack
          justify="space-between"
          align="center"
          flexWrap={{ base: "wrap", md: "nowrap" }}
        >
          <VStack
            spacing={1}
            align="start"
            minW={{ base: "auto", md: "120px" }}
          >
            <Text
              fontSize={{ base: "2xs", md: "xs" }}
              color={textColor}
              fontWeight="500"
            >
              Entry Price
            </Text>
            <Text
              color={priceColor}
              fontWeight="700"
              fontSize={{ base: "md", md: "lg" }}
            >
              {price === 0 ? "Free" : `Rp ${price.toLocaleString()}`}
            </Text>
          </VStack>

          <Button
            leftIcon={<ViewIcon />}
            colorScheme="teal"
            size={{ base: "xs", md: "sm" }}
            borderRadius="full"
            fontWeight="600"
            px={{ base: 4, md: 6 }}
            fontSize={{ base: "xs", md: "sm" }}
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
            {/* Tampilkan text lebih pendek di mobile */}
            <Box display={{ base: "block", md: "none" }}>View</Box>
            <Box display={{ base: "none", md: "block" }}>View Details</Box>
          </Button>
        </HStack>
      </VStack>
    </Box>
  );
};

export default PlaceCard;
