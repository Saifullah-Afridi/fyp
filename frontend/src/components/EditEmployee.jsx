import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  Button,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  Input,
  Spinner,
  Text,
  VStack,
} from "@chakra-ui/react";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const EditEmployee = () => {
  const { id } = useParams();

  const [name, setName] = useState("");
  const [NIC, setNIC] = useState("");
  const [address, setAddress] = useState("");
  const [occupation, setOccupation] = useState("");
  const [phoneNumber, setPhonenNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `http://localhost:3000/api/v1/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        console.log(res);
        const employee = res.data.employee;
        setName(employee.name);
        setNIC(employee.NIC);
        setAddress(employee.address);
        setOccupation(employee.occupation);
        setLoading(false);
      } catch (error) {
        console.log(error);
      }
    };
    fetchEmployee();
  }, []);
  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .patch(
        `http://localhost:3000/api/v1/employee/${id}`,
        { password, confirmPassword },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        setError("");
        setSuccessMessage(res.data.message);
      })
      .catch((error) => {
        setSuccessMessage("");
        setError(error.response.data.message);
      });
  };
  return (
    <Container maxW="90%" mx="auto" py="1rem">
      <Heading textAlign="center">Edit Employee</Heading>
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Box
          maxWidth="70%"
          mx="auto"
          py="2rem"
          px="1rem"
          mt="3rem"
          boxShadow="lg"
          borderRadius="7px"
        >
          <Flex justify="space-between">
            <HStack>
              <Text fontWeight="bold">Name</Text>
              <Text>{name}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">NIC</Text>
              <Text>{NIC}</Text>
            </HStack>
          </Flex>
          <Flex justify="space-between" my="1rem">
            <HStack>
              <Text fontWeight="bold">Role</Text>
              <Text>{occupation}</Text>
            </HStack>
            <HStack>
              <Text fontWeight="bold">Address</Text>
              <Text>{address}</Text>
            </HStack>
          </Flex>
          <Heading py="1rem" textAlign="center" size="md">
            Change Password
          </Heading>
          <form onSubmit={handleSubmit}>
            <HStack py="1rem">
              <FormControl>
                <FormLabel>Passwordd</FormLabel>
                <Input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </FormControl>
              <FormControl>
                <FormLabel>Confirm Password</FormLabel>
                <Input
                  type="text"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </FormControl>
            </HStack>
            <Button
              type="submit"
              py="1rem"
              width="full"
              colorScheme="blue"
              variant="solid"
            >
              Update Password
            </Button>
          </form>
          {successMessage && (
            <Alert
              status="success"
              width="70%"
              mx="auto"
              mt="15px"
              borderRadius="7px"
            >
              <AlertIcon />
              <AlertTitle>Success</AlertTitle>
              <AlertDescription>{successMessage}</AlertDescription>
            </Alert>
          )}
          {error && (
            <Alert
              status="error"
              width="70%"
              mx="auto"
              mt="15px"
              borderRadius="7px"
            >
              <AlertIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </Box>
      )}
    </Container>
  );
};

export default EditEmployee;
