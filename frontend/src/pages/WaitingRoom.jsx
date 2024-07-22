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
  Container,
  Text,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";

const WaitingRoom = () => {
  const [patients, setPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient"
        );
        const today = new Date().toISOString().split("T")[0];
        const todayPatients = response.data.patients.filter((patient) => {
          const registrationDate = new Date(patient.createdAt);
          return (
            registrationDate instanceof Date &&
            !isNaN(registrationDate) &&
            registrationDate.toISOString().split("T")[0] === today
          );
        });

        setPatients(todayPatients.slice(1));
        setCurrentPatient(todayPatients[0]);
        setLoading(false);
      } catch (error) {
        setError("Error fetching patients");
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();

    const interval = setInterval(fetchPatients, 5000); // Poll every 5 seconds
    return () => clearInterval(interval); // Clean up the interval on component unmount
  }, []);

  return (
    <Container py={6} maxWidth="95%">
      <Box bg="white" p={6} rounded="md" shadow="sm" w="100%">
        <HStack alignItems="center" gap="4rem" mb="1rem" w="100%">
          <Heading fontSize="30px" mb="20px" textColor="blue.400">
            Patients in Pending
          </Heading>
          <Text fontSize="18px" textColor="blue.400">
            Total Patients: {patients.length}
          </Text>
        </HStack>
        {loading ? (
          <Spinner size="xl" />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Table variant="striped" colorScheme="teal" shadow="sm" mb="20px">
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
        )}
      </Box>
    </Container>
  );
};

export default WaitingRoom;
