import React, { useState, useEffect } from "react";
import {
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useDisclosure,
} from "@chakra-ui/react";
import axios from "axios";
import { FaPrescriptionBottle } from "react-icons/fa";
import PrescriptionModal from "./PrescriptionModal"; // Import your modal component

const DoctorPage = () => {
  const [pendingPatients, setPendingPatients] = useState([]);
  const [currentPatient, setCurrentPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility

  const fetchPendingPatients = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setPendingPatients(response.data.visits);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pending patients");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPatients();
  }, []);

  const handlePrescribeClick = (patient) => {
    setCurrentPatient(patient);
    setIsModalOpen(true); // Show the modal when the button is clicked
  };

  return (
    <Box p={4}>
      <Heading mb={4}>Doctor Dashboard</Heading>
      {error && (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      )}
      {loading ? (
        <Spinner size="xl" />
      ) : (
        <Tabs>
          <TabList>
            <Tab>Pending Patients</Tab>
            <Tab>Current Patient</Tab>
          </TabList>

          <TabPanels>
            <TabPanel>
              <Box overflowX="auto">
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Patient Name</Th>
                      <Th>Prescribe</Th>
                    </Tr>
                  </Thead>
                  {pendingPatients.length > 0 ? (
                    <Tbody>
                      {pendingPatients.map((patient) => (
                        <Tr key={patient?.patient?._id}>
                          <Td>{patient?.patient?.patientName}</Td>
                          <Td>
                            <Button
                              colorScheme="blue"
                              leftIcon={<FaPrescriptionBottle />}
                              onClick={() => handlePrescribeClick(patient)}
                            >
                              Prescribe
                            </Button>
                          </Td>
                        </Tr>
                      ))}
                    </Tbody>
                  ) : (
                    <p>No Patient</p>
                  )}
                </Table>
              </Box>
            </TabPanel>
            <TabPanel>
              {currentPatient ? (
                <Box>
                  <Heading size="md" mb={4}>
                    Patient Details
                  </Heading>
                  <Box>
                    <p>
                      <strong>Name:</strong> {currentPatient.patientName}
                    </p>
                    <p>
                      <strong>Ward Name:</strong> {currentPatient.wardName}
                    </p>
                    <p>
                      <strong>Visit Category:</strong>{" "}
                      {currentPatient.visitCategory}
                    </p>
                  </Box>
                </Box>
              ) : (
                <Box>No patient selected.</Box>
              )}
            </TabPanel>
          </TabPanels>
        </Tabs>
      )}
      {isModalOpen && (
        <PrescriptionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)} // Close the modal
          patient={currentPatient}
        />
      )}
    </Box>
  );
};

export default DoctorPage;
