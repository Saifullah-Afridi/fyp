import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { Box } from "@chakra-ui/react";
import { Sidebar } from "../../components/Sidebar";
import CreateReceptionist from "../../pages/admin/CreateReceptionist";
import CreateDoctor from "../../pages/admin/CreateDoctor";
import Employees from "../../pages/admin/Employees";
import PatientSummary from "../../pages/admin/PatientSummary";

const AdminLayout = () => {
  const location = useLocation();
  const [tab, setTab] = useState(null);

  useEffect(() => {
    const queryString = new URLSearchParams(location.search);
    const newTab = queryString.get("tab");
    setTab(newTab);
  }, [location.search]);

  return (
    <Box width="100%" height="100vh" display="flex">
      <Box>
        <Sidebar />
      </Box>
      <Box
        flex="1"
        p="4"
        ml="250px" // Added margin-left to account for the fixed sidebar
        height="100vh"
        overflowY="auto"
      >
        {tab === null && <PatientSummary />}
        {tab === "summary" && <PatientSummary />}
        {tab === "create-receptionist" && <CreateReceptionist />}
        {tab === "create-doctor" && <CreateDoctor />}
        {tab === "employees" && <Employees />}
      </Box>
    </Box>
  );
};

export default AdminLayout;
