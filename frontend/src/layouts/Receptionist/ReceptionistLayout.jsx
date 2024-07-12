import React, { useEffect, useState } from "react";
import { Button, Container, Heading, HStack, Text } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
const ReceptionistLayout = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [role, setRole] = useState("");
  useEffect(() => {
    let employee = localStorage.getItem("user");
    employee = JSON.parse(employee);
    if (employee) {
      console.log(employee);
      setName(employee.name);
      setRole(employee.occupation);
    }
    if (!employee) {
      navigate("/login");
    }
  }, []);
  useEffect(() => {
    if (role === "admin") {
      navigate("/admin");
    }
    if (role === "doctor") {
      navigate("/doctor");
    }
  });
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
            Reciption: {name}
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
