import React, { useState, useEffect } from "react";
import {
  Box,
  Badge,
  Text,
  VStack,
  HStack,
  Collapse,
  Button,
} from "@chakra-ui/react";
import { recommendationCache } from "../../utils/cache";

const PerformanceMonitor: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [cacheStats, setCacheStats] = useState({
    size: 0,
    hits: 0,
    misses: 0,
    breakdown: {
      place: 0,
      user: 0,
      nearby: 0,
      category: 0,
    },
  });

  useEffect(() => {
    const interval = setInterval(() => {
      // Hitung breakdown cache berdasarkan key
      const breakdown = {
        place: 0,
        user: 0,
        nearby: 0,
        category: 0,
      };
      if ((recommendationCache as any).storage) {
        (recommendationCache as any).storage.forEach((_: any, key: string) => {
          if (key.includes("_place_")) breakdown.place++;
          else if (key.includes("_user_")) breakdown.user++;
          else if (key.includes("nearby_")) breakdown.nearby++;
          else if (key.includes("_category_")) breakdown.category++;
        });
      }
      setCacheStats({
        size: recommendationCache.size(),
        hits: parseInt(localStorage.getItem("cache_hits") || "0"),
        misses: parseInt(localStorage.getItem("cache_misses") || "0"),
        breakdown,
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (process.env.NODE_ENV !== "development") {
    return null;
  }

  const hitRate =
    cacheStats.hits + cacheStats.misses > 0
      ? (
          (cacheStats.hits / (cacheStats.hits + cacheStats.misses)) *
          100
        ).toFixed(1)
      : "0";

  return (
    <Box
      position="fixed"
      bottom={4}
      right={4}
      zIndex={1000}
      bg="blackAlpha.800"
      color="white"
      borderRadius="lg"
      p={2}
      minW="200px"
    >
      <Button
        size="xs"
        variant="ghost"
        color="white"
        onClick={() => setIsOpen(!isOpen)}
        w="full"
        justifyContent="space-between"
      >
        Performance Monitor
        <Badge colorScheme={parseFloat(hitRate) > 50 ? "green" : "orange"}>
          {hitRate}% hit rate
        </Badge>
      </Button>

      <Collapse in={isOpen}>
        <VStack spacing={2} mt={2} align="stretch">
          <HStack justify="space-between">
            <Text fontSize="xs">Cache Size:</Text>
            <Badge colorScheme="blue">{cacheStats.size}</Badge>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="xs">Cache Hits:</Text>
            <Badge colorScheme="green">{cacheStats.hits}</Badge>
          </HStack>
          <HStack justify="space-between">
            <Text fontSize="xs">Cache Misses:</Text>
            <Badge colorScheme="red">{cacheStats.misses}</Badge>
          </HStack>
          {/* Breakdown per endpoint */}
          <Box mt={2}>
            <Text fontSize="xs" fontWeight="bold">
              Breakdown per Endpoint:
            </Text>
            <HStack justify="space-between">
              <Text fontSize="xs">Place:</Text>
              <Badge colorScheme="purple">{cacheStats.breakdown.place}</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs">User:</Text>
              <Badge colorScheme="purple">{cacheStats.breakdown.user}</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs">Nearby:</Text>
              <Badge colorScheme="purple">{cacheStats.breakdown.nearby}</Badge>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="xs">Category:</Text>
              <Badge colorScheme="purple">
                {cacheStats.breakdown.category}
              </Badge>
            </HStack>
          </Box>
          <Button
            size="xs"
            colorScheme="red"
            variant="outline"
            onClick={() => {
              recommendationCache.clear();
              localStorage.removeItem("cache_hits");
              localStorage.removeItem("cache_misses");
            }}
          >
            Clear Cache
          </Button>
        </VStack>
      </Collapse>
    </Box>
  );
};

export default PerformanceMonitor;
