import { Container, Heading, HStack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import { Grid, GridItem } from "@chakra-ui/react";
const adminLayout = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setEmployee(storedUser);
  }, []);

  useEffect(() => {
    if (!employee) {
      navigate("/login");
    } else {
      const { occupation } = employee;
      if (occupation === "admin") {
        navigate("/admin");
      } else if (occupation === "doctor") {
        navigate("/doctor");
      } else if (occupation === "recreceptionist") {
        navigate("/receptionist");
      }
    }
  }, []);
  return (
    <Grid
      width="100%"
      templateColumns="250px 1fr"
      templateRows="1fr"
      columnGap="5px"
      height="100vh"
      overflow="hidden"
    >
      <GridItem
        bg="teal.100"
        position="sticky"
        top="0"
        height="100vh"
        overflowY="auto"
        boxShadow="md"
        zIndex="sticky"
      >
        <Sidebar />
      </GridItem>
      <GridItem p="4" overflowY="auto">
        <Outlet />
      </GridItem>
    </Grid>
  );
};

export default adminLayout;
