import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  useToast,
  Text,
} from "@chakra-ui/react";
import io from "socket.io-client";

const WaitingRoom = () => {
  const [patients, setPatients] = useState([]);
  const [currentVisit, setCurrentVisit] = useState(null);
  const toast = useToast();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient/todays-patients"
        );
        setPatients(response.data.patients);
      } catch (error) {
        toast({
          title: "Error fetching patients.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };

    fetchPatients();
  }, [toast]);

  useEffect(() => {
    const socket = io("http://localhost:3000");

    // Listen for the 'notify-waiting-room' event
    socket.on("update-waiting-room", (visit) => {
      console.log("hello from there");

      setCurrentVisit(visit._id); // Update current visit ID
      toast({
        title: "New Visit Notified.",
        description: `Visit ID ${visit._id} has been notified.`,
        status: "info",
        duration: 3000,
        isClosable: true,
      });
    });
    return () => {
      socket.disconnect();
    };
  }, [toast]);

  const handleUpdatePatient = async (patientId) => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/patient/update-status/${patientId}`,
        {
          status: "In Progress",
        }
      );
      toast({
        title: "Patient status updated.",
        description: "Patient status has been updated to 'In Progress'.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error updating patient status.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <Box w="95%" pt={5} mx="auto">
      <Box align="center">
        <Heading
          fontWeight="semibold"
          color="gray.600"
          borderBottom="2px"
          pb="3px"
          width="fit-content"
          fontSize="2xl"
          mb={3}
        >
          Waiting Room
        </Heading>
      </Box>
      {currentVisit && (
        <Text fontSize="lg" mb={4}>
          Current Visit ID: {currentVisit}
        </Text>
      )}
      {patients?.length > 0 ? (
        <Table variant="simple" colorScheme="blue" size="md">
          <Thead bgColor="green.200">
            <Tr>
              <Th>Patient Name</Th>
              <Th>Status</Th>
              <Th>Update Status</Th>
            </Tr>
          </Thead>
          <Tbody>
            {patients?.map((patient) => (
              <Tr key={patient._id}>
                <Td>{patient.patientName}</Td>
                <Td>{patient.status}</Td>
                <Td>
                  <Button
                    colorScheme="blue"
                    onClick={() => handleUpdatePatient(patient._id)}
                  >
                    Update to In Progress
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      ) : (
        <Box
          h="100vh"
          display="flex"
          justifyContent="center"
          alignItems="center"
          flexDir="column"
        >
          <Heading
            p={4}
            bgGradient="linear(to-r , red.300 , red.400)"
            width="fit-content"
            size="md"
          >
            No Patients Waiting
          </Heading>
        </Box>
      )}
    </Box>
  );
};

export default WaitingRoom;
