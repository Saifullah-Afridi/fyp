import { ListItem, Text, UnorderedList, VStack } from "@chakra-ui/react";
import React from "react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <VStack width="100%" alignItems="stretch">
      <Link to="/admin?tab=create-employee">
        <Text
          fontSize="18px"
          size="30px"
          fontWeight="bold"
          borderBottom="1px"
          borderBottomColor="gray.400"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Create Employee
        </Text>
      </Link>
      <Link to="/admin?tab=employees">
        <Text
          fontSize="18px"
          borderBottom="1px"
          borderBottomColor="gray.400"
          size="30px"
          fontWeight="bold"
          p="10px"
          _hover={{ bg: "gray.100" }}
        >
          {" "}
          Employees
        </Text>
      </Link>
    </VStack>
  );
};
