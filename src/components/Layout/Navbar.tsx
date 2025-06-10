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
  VStack,
  IconButton,
  Drawer,
  DrawerBody,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
  useDisclosure,
  useBreakpointValue,
} from "@chakra-ui/react";
import {
  AddIcon,
  ViewIcon,
  SearchIcon,
  AtSignIcon,
  SmallCloseIcon,
  HamburgerIcon,
  CloseIcon,
} from "@chakra-ui/icons";
import { useAuth } from "../../contexts/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const bgColor = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const isMobile = useBreakpointValue({ base: true, md: false });

  const handleLogout = () => {
    logout();
    navigate("/login");
    onClose();
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
        onClick={isMobile ? onClose : undefined}
      >
        {IconComponent && <IconComponent />}
        {children}
      </Link>
    );
  };

  const NavigationItems = () => (
    <>
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
        size={isMobile ? "md" : "sm"}
        w={isMobile ? "full" : "auto"}
        justifyContent={isMobile ? "flex-start" : "center"}
        _hover={{
          bg: "red.50",
          transform: "translateY(-1px)",
        }}
        transition="all 0.2s"
      >
        Logout
      </Button>
    </>
  );

  const AuthButtons = () => (
    <>
      <Button
        as={RouterLink}
        to="/login"
        variant="ghost"
        colorScheme="teal"
        size={isMobile ? "md" : "sm"}
        w={isMobile ? "full" : "auto"}
        onClick={isMobile ? onClose : undefined}
      >
        Sign In
      </Button>
      <Button
        as={RouterLink}
        to="/register"
        colorScheme="teal"
        size={isMobile ? "md" : "sm"}
        w={isMobile ? "full" : "auto"}
        _hover={{ transform: "translateY(-1px)" }}
        transition="all 0.2s"
        onClick={isMobile ? onClose : undefined}
      >
        Sign Up
      </Button>
    </>
  );

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
        px={{ base: 4, md: 6 }}
        py={4}
        align="center"
        justify="space-between"
      >
        {/* Logo */}
        <Link as={RouterLink} to="/" _hover={{ textDecoration: "none" }}>
          <HStack spacing={2}>
            <Box color="teal.500" fontSize={{ base: "lg", md: "xl" }}>
              📍
            </Box>
            <Text
              fontSize={{ base: "lg", md: "xl" }}
              fontWeight="bold"
              bgGradient="linear(to-r, teal.500, teal.300)"
              bgClip="text"
            >
              Wisata Jakarta
            </Text>
          </HStack>
        </Link>

        {/* Desktop Navigation */}
        {!isMobile && (
          <>
            {user ? (
              <HStack spacing={2}>
                <NavigationItems />
              </HStack>
            ) : (
              <HStack spacing={4}>
                <AuthButtons />
              </HStack>
            )}
          </>
        )}

        {/* Mobile Hamburger Menu */}
        {isMobile && (
          <IconButton
            aria-label="Open menu"
            icon={<HamburgerIcon />}
            variant="ghost"
            colorScheme="teal"
            size="lg"
            onClick={onOpen}
          />
        )}

        {/* Mobile Drawer */}
        <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton size="lg" />
            <DrawerHeader borderBottomWidth="1px">
              <HStack spacing={2}>
                <Box color="teal.500" fontSize="lg">
                  📍
                </Box>
                <Text
                  fontSize="lg"
                  fontWeight="bold"
                  bgGradient="linear(to-r, teal.500, teal.300)"
                  bgClip="text"
                >
                  Wisata Jakarta
                </Text>
              </HStack>
            </DrawerHeader>

            <DrawerBody>
              <VStack spacing={4} align="stretch" mt={6}>
                {user ? <NavigationItems /> : <AuthButtons />}
              </VStack>
            </DrawerBody>
          </DrawerContent>
        </Drawer>
      </Flex>
    </Box>
  );
};

export default Navbar;
