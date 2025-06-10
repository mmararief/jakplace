import React from "react";
import { useNavigate, Link as RouterLink, useLocation } from "react-router-dom";
import {
  Box,
  Flex,
  Text,
  Button,
  Stack,
  Link,
  useColorModeValue,
  HStack,
} from "@chakra-ui/react";
import {
  AddIcon,
  ViewIcon,
  SearchIcon,
  AtSignIcon,
  SmallCloseIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const NavLink = ({
    to,
    children,
    icon: IconComponent,
  }: {
    to: string;
    children: React.ReactNode;
    icon?: any;
  }) => {
    const isActive = location.pathname === to;
    return (
      <Link
        as={RouterLink}
        to={to}
        display="flex"
        alignItems="center"
        gap={2}
        px={4}
        py={2}
        borderRadius="lg"
        bg={isActive ? "teal.500" : "transparent"}
        color={isActive ? "white" : useColorModeValue("gray.700", "gray.200")}
        fontWeight={isActive ? "600" : "500"}
        _hover={{
          bg: isActive ? "teal.600" : useColorModeValue("gray.100", "gray.700"),
          textDecoration: "none",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
      >
        {IconComponent && <IconComponent />}
        {children}
      </Link>
    );
  };

  return (
    <Box
      bg={bgColor}
      borderBottom="1px"
      borderColor={borderColor}
      shadow="sm"
      position="sticky"
      top={0}
      zIndex={100}
    >
      <Flex
        maxW="container.xl"
        mx="auto"
        px={6}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <HStack spacing={2}>
            <Box color="teal.500" fontSize="xl">
              📍
            </Box>
            <Text
              fontSize="xl"
              fontWeight="bold"
              bgGradient="linear(to-r, teal.500, teal.300)"
              bgClip="text"
            >
              Wisata Jakarta
            </Text>
          </HStack>
        </Link>

        {/* Navigation Links */}
        {user ? (
          <HStack spacing={2}>
            <NavLink to="/" icon={() => <span>🏠</span>}>
              Home
            </NavLink>
            <NavLink to="/places" icon={() => <span>📍</span>}>
              Places
            </NavLink>
            <NavLink to="/recommendations/nearby" icon={() => <span>🧭</span>}>
              Nearby
            </NavLink>
            <Button
              leftIcon={<span>🚪</span>}
              variant="ghost"
              colorScheme="red"
              onClick={handleLogout}
              _hover={{
                bg: "red.50",
                transform: "translateY(-1px)",
              }}
              transition="all 0.2s"
            >
              Logout
            </Button>
          </HStack>
        ) : (
          <HStack spacing={4}>
            <Button
              as={RouterLink}
              to="/login"
              variant="ghost"
              colorScheme="teal"
            >
              Sign In
            </Button>
            <Button
              as={RouterLink}
              to="/register"
              colorScheme="teal"
              _hover={{ transform: "translateY(-1px)" }}
              transition="all 0.2s"
            >
              Sign Up
            </Button>
          </HStack>
        )}
      </Flex>
    </Box>
  );
};

export default Navbar;
