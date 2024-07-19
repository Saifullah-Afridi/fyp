import { Button, Heading, HStack, Text } from "@chakra-ui/react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
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
        <Button colorScheme="blue" onClick={handleLogout}>
          Log out
        </Button>
      </HStack>
    </HStack>
  );
};

export default Header;
