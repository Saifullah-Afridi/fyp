// Import necessary libraries
import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
} from "@chakra-ui/react";

const PatientList = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    // Fetch all patients from backend
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient"
        );
        // Filter patients registered today
        const today = new Date().toISOString().split("T")[0]; // Get current date in YYYY-MM-DD format
        const todayPatients = response.data.patients.filter((patient) => {
          const registrationDate = new Date(patient.createdAt);
          console.log(registrationDate);
          // Check if registration date is valid
          return (
            registrationDate instanceof Date &&
            !isNaN(registrationDate) &&
            registrationDate.toISOString().split("T")[0] === today
          );
        });
        setPatients(todayPatients);
        console.log(todayPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Box>
      <Heading fontSize="24px" mb="20px">
        Patient In pending
      </Heading>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Serial Number</Th>
            <Th>Patient Name</Th>
            <Th>Time of Registration</Th>
            <Th>Patient ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.map((patient, index) => (
            <Tr key={patient._id}>
              <Td>{index + 1}</Td>
              <Td>{patient.patientName}</Td>
              <Td>{new Date(patient.createdAt).toLocaleTimeString()}</Td>
              <Td>{patient._id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PatientList;
