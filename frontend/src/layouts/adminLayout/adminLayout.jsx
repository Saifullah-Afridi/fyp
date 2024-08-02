import { Container, Heading, HStack, Grid, GridItem } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Sidebar } from "../../components/Sidebar";
import CreateEmployee from "../../pages/admin/CreateEmployee";
import Employees from "../../pages/admin/Employees";

const AdminLayout = () => {
  const location = useLocation();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const queryString = new URLSearchParams(location.search);
    const newTab = queryString.get("tab");
    setTab(newTab);
  }, [location.search]);

  return (
    <Grid
      width="95%"
      mx="auto"
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
        borderRight="1px"
        borderRightColor="gray.500"
        height="100vh"
        overflowY="auto"
        boxShadow="md"
        zIndex="sticky"
      >
        <Sidebar />
      </GridItem>
      <GridItem p="4" overflowY="auto">
        {tab === null && <CreateEmployee />}
        {tab === "create-employee" && <CreateEmployee />}
        {tab === "employees" && <Employees />}
      </GridItem>
    </Grid>
  );
};

export default AdminLayout;
