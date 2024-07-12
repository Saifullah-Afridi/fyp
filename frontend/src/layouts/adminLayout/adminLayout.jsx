import { Container, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const adminLayout = () => {
  return (
    <HStack justifyContent="space-between">
      <Heading>Main Bar</Heading>
      <Container>
        <Outlet></Outlet>
      </Container>
    </HStack>
  );
};

export default adminLayout;
