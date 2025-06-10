import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  useToast,
  Container,
} from "@chakra-ui/react";
import { register } from "../../api/auth";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [preferences, setPreferences] = useState<string[]>([]);
  const [age, setAge] = useState<number | undefined>(undefined);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await register({
        name,
        email,
        password,
        preferences: preferences.filter((p) => p.trim() !== ""),
        age: age || 0,
      });
      toast({
        title: "Registration successful!",
        description: "Please login to continue.",
        status: "success",
        duration: 3000,
      });
      navigate("/login");
    } catch (err) {
      toast({
        title: "Registration failed",
        description: "Please try again.",
        status: "error",
        duration: 3000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Container maxW="container.sm" py={10}>
      <Box
        p={8}
        maxWidth="500px"
        borderWidth={1}
        borderRadius={8}
        boxShadow="lg"
        mx="auto"
      >
        <VStack spacing={4} as="form" onSubmit={handleRegister}>
          <Heading>Register</Heading>
          <FormControl isRequired>
            <FormLabel>Name</FormLabel>
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your name"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Email</FormLabel>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
            />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Preferences (comma separated)</FormLabel>
            <Input
              type="text"
              value={preferences.join(", ")}
              onChange={(e) => setPreferences(e.target.value.split(", "))}
              placeholder="e.g. Museum, Taman, Kuliner"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Age</FormLabel>
            <Input
              type="number"
              value={age || ""}
              onChange={(e) => setAge(Number(e.target.value))}
              placeholder="Enter your age"
            />
          </FormControl>
          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
          >
            Register
          </Button>
          <Text>
            Already have an account?{" "}
            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => navigate("/login")}
            >
              Login here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Register;
