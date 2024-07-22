import { ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <VStack width="100%" alignItems="stretch" mt="15px">
      <Link to="create-employee">
        <Text
          fontSize="18px"
          size="30px"
          fontWeight="bold"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Create Employee
        </Text>
      </Link>
      <Link to="doctors">
        <Text
          fontSize="18px"
          size="30px"
          fontWeight="bold"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Doctors
        </Text>
      </Link>
      <Link to="/doctor-employees">
        <Text
          fontSize="18px"
          size="30px"
          fontWeight="bold"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Reciptanist
        </Text>
      </Link>
      <Link to="/doctor-employees">
        <Text
          fontSize="18px"
          size="30px"
          fontWeight="bold"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Doctors
        </Text>
      </Link>
    </VStack>
  );
};
