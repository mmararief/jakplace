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
import { login } from "../../api/auth";
import { useAuth } from "../../contexts/AuthContext";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { loginUser } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await loginUser(email, password);
      toast({
        title: "Login successful!",
        status: "success",
        duration: 3000,
      });
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);
      toast({
        title: "Login failed",
        description: "Please check your credentials and try again",
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
        <VStack spacing={4} as="form" onSubmit={handleSubmit}>
          <Heading>Login to Wisata Jakarta</Heading>

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

          <Button
            type="submit"
            colorScheme="teal"
            width="full"
            isLoading={isLoading}
          >
            Login
          </Button>

          <Text>
            Don't have an account?{" "}
            <Button
              variant="link"
              colorScheme="teal"
              onClick={() => navigate("/register")}
            >
              Register here
            </Button>
          </Text>
        </VStack>
      </Box>
    </Container>
  );
};

export default Login;
