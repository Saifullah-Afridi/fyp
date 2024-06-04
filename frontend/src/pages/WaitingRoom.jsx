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
  Button,
} from "@chakra-ui/react";

const WaitingRoom = () => {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get("http://localhost:3000/api/v1/patient");
        const today = new Date().toISOString().split("T")[0];
        const todayPatients = response.data.patients.filter((patient) => {
          const registrationDate = new Date(patient.createdAt);
          return (
            registrationDate instanceof Date &&
            !isNaN(registrationDate) &&
            registrationDate.toISOString().split("T")[0] === today
          );
        });

        if (todayPatients.length > 0) {
          setCurrentPatient(todayPatients[0]);
          setPatients(todayPatients.slice(1));
          setTotalPatients(todayPatients.length - 1);
        }
        setLoading(false);
      } catch (error) {
        setError("Error fetching patients");
        console.error("Error fetching patients:", error);
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  const handleNextPatient = () => {
    setPatients((prevPatients) => {
      const nextPatients = prevPatients.slice(1);
      setCurrentPatient(prevPatients[0]);
      setTotalPatients(nextPatients.length);
      announcePatient(prevPatients[0]);
      return nextPatients;
    });
  };

  const announcePatient = (patient) => {
    if (patient) {
      const msg = new SpeechSynthesisUtterance();
      msg.text = `${patient.patientName}, guardian: ${patient.guardianName}, ${patient.patientName}, guardian: ${patient.guardianName}, ${patient.patientName}, guardian: ${patient.guardianName}`;
      window.speechSynthesis.speak(msg);
    }
  };

  useEffect(() => {
    if (currentPatient) {
      announcePatient(currentPatient);
    }
  }, [currentPatient]);

  return (
    <Container py={6} maxWidth="95%">
      <Box bg="white" p={6} rounded="md" shadow="sm" w="100%">
        <HStack alignItems="center" gap="4rem" mb="1rem" w="100%">
          <Heading fontSize="30px" mb="20px" textColor="blue.400">
            Patients in Pending
          </Heading>
          <Text fontSize="18px" textColor="blue.400">
            Total Patients: {totalPatients}
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
          <>
            <Button
              colorScheme="blue"
              onClick={handleNextPatient}
              mb="20px"
              isDisabled={patients.length === 0}
            >
              Next Patient
            </Button>
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
            {/* Current patient details */}
            {currentPatient && (
              <Box bg="gray.50" p={6} rounded="md" shadow="sm">
                <Heading fontSize="24px" mb="4">
                  Current Patient Details
                </Heading>
                <Text>
                  <strong>Name:</strong> {currentPatient.patientName}
                </Text>
                <Text>
                  <strong>Age:</strong> {currentPatient.age}
                </Text>
                <Text>
                  <strong>Blood Group:</strong> {currentPatient.bloodGroup}
                </Text>
                <Text>
                  <strong>Address:</strong> {currentPatient.address}
                </Text>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default WaitingRoom;
