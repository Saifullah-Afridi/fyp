import { Container, Heading, HStack } from "@chakra-ui/react";
import React from "react";
import { Outlet } from "react-router-dom";

const adminLayout = () => {
  return (
    <Container maxW="90%">
      <Outlet></Outlet>
    </Container>
  );
};

export default adminLayout;
