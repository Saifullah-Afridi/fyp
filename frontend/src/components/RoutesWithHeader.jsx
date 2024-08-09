import { Box } from "@chakra-ui/react";
import React from "react";
import Header from "./Header";
import { Outlet } from "react-router-dom";

const RoutesWithHeader = () => {
  return (
    <Box>
      <Header />
      <Outlet />
    </Box>
  );
};

export default RoutesWithHeader;
