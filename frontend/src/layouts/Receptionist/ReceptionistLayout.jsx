import React, { useEffect, useState } from "react";
import { Button, Container, Heading, HStack, Text } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
const ReceptionistLayout = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setEmployee(storedUser);
  }, [employee]);

  useEffect(() => {
    if (!employee) {
      navigate("/login");
    } else {
      const { occupation } = employee;
      if (occupation === "admin") {
        navigate("/admin");
      } else if (occupation === "doctor") {
        navigate("/doctor");
      }
    }
  }, [employee]);
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <Container maxW="90%">
      <HStack
        justify="space-between"
        my="1rem"
        borderBottom="2px solid"
        borderColor="gray.200"
        py="5px"
        shadow="sm"
      >
        <Heading>HMS</Heading>
        <HStack gap="15px">
          <Text fontSize="18px" color="gray.700">
            Reciption: {employee?.name}
          </Text>
          <Button colorScheme="blue" onClick={handleLogout}>
            Log out
          </Button>
        </HStack>
      </HStack>
      <Outlet />
    </Container>
  );
};

export default ReceptionistLayout;
