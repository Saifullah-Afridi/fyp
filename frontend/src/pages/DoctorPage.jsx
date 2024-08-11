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
  Input,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  IconButton,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Flex,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Formik, FieldArray, Form } from "formik";
import { FaTrash } from "react-icons/fa";

const DoctorPage = () => {
  const [patients, setPatients] = useState([]);
  const [totalPatients, setTotalPatients] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient/todays-patients"
        );
        const todayPatients = response.data.visits;

        if (todayPatients.length > 0) {
          setCurrentPatient(todayPatients[0].patientId);
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
    if (patients.length === 0) return;

    setPatients((prevPatients) => {
      const nextPatients = prevPatients.slice(1);
      setCurrentPatient(nextPatients[0]?.patientId || null);
      setTotalPatients(nextPatients.length);
      return nextPatients;
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/api/v1/visit/record",
        {
          patientId: currentPatient._id,
          ...values,
        }
      );
      console.log("Submission Response:", response);
    } catch (error) {
      console.error("Error submitting form:", error);
    }
  };

  return (
    <Container py={6} maxWidth="1200px">
      <Flex direction={{ base: "column", md: "row" }}>
        {/* Sidebar */}
        <Box
          w={{ base: "100%", md: "250px" }}
          p={4}
          bg="gray.100"
          borderRight="1px solid"
          borderColor="gray.200"
          display={{ base: "none", md: "block" }}
        >
          <Heading fontSize="lg" mb={6} textColor="blue.500">
            Dashboard
          </Heading>
          <Button
            w="100%"
            mb={4}
            colorScheme="blue"
            variant="outline"
            onClick={() => setCurrentPatient(null)}
          >
            Pending Patients
          </Button>
          <Button
            w="100%"
            colorScheme="blue"
            variant="outline"
            onClick={() => setCurrentPatient({})}
          >
            Current Patient
          </Button>
        </Box>

        {/* Main Content */}
        <Box
          flex="1"
          p={4}
          bg="white"
          borderLeft={{ base: "none", md: "1px solid" }}
          borderColor="gray.200"
        >
          {error && (
            <Alert status="error" mb="20px">
              <AlertIcon />
              {error}
            </Alert>
          )}

          <Tabs variant="enclosed" isFitted>
            <TabList>
              <Tab>Pending Patients</Tab>
              <Tab>Current Patient</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Grid templateColumns={{ base: "1fr", md: "2fr 1fr" }} gap={6}>
                  <GridItem>
                    {loading ? (
                      <Spinner size="xl" />
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
                        <Table
                          variant="striped"
                          colorScheme="teal"
                          shadow="sm"
                          mb="20px"
                        >
                          <Thead>
                            <Tr>
                              <Th>Serial Number</Th>
                              <Th>Patient Name</Th>
                              <Th>Time of Registration</Th>
                              <Th>Patient ID</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {patients.map((visit, index) => (
                              <Tr key={visit.patientId._id}>
                                <Td>{index + 1}</Td>
                                <Td>{visit.patientId.patientName}</Td>
                                <Td>
                                  {new Date(visit.date).toLocaleTimeString()}
                                </Td>
                                <Td>{visit.patientId._id}</Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </>
                    )}
                  </GridItem>
                  <GridItem>
                    <Text fontSize="lg" mb="4">
                      Total Patients: {totalPatients}
                    </Text>
                  </GridItem>
                </Grid>
              </TabPanel>

              <TabPanel>
                {currentPatient ? (
                  <Box bg="gray.50" p={6} rounded="md" shadow="md">
                    <Heading fontSize="24px" mb="4">
                      Current Patient Details
                    </Heading>
                    <Text mb="4">
                      <strong>Name:</strong> {currentPatient.name}
                    </Text>
                    <Formik
                      initialValues={{
                        prescription: "",
                        tests: [""],
                        medicines: [{ name: "", dosage: "", days: "" }],
                      }}
                      onSubmit={handleSubmit}
                    >
                      {({ values, handleChange }) => (
                        <Form>
                          <VStack spacing={4} align="stretch">
                            <FormControl>
                              <FormLabel>Doctor's Prescription</FormLabel>
                              <Textarea
                                name="prescription"
                                value={values.prescription}
                                onChange={handleChange}
                              />
                            </FormControl>

                            <FormControl>
                              <FormLabel>Tests Required</FormLabel>
                              <FieldArray name="tests">
                                {({ push, remove }) => (
                                  <VStack spacing={2}>
                                    {values.tests.map((test, index) => (
                                      <HStack key={index} w="100%">
                                        <Input
                                          name={`tests[${index}]`}
                                          value={test}
                                          onChange={handleChange}
                                          placeholder="Enter test"
                                        />
                                        <IconButton
                                          icon={<FaTrash />}
                                          onClick={() => remove(index)}
                                          colorScheme="red"
                                          variant="outline"
                                        />
                                      </HStack>
                                    ))}
                                    <Button
                                      onClick={() => push("")}
                                      colorScheme="blue"
                                      variant="outline"
                                    >
                                      Add Test
                                    </Button>
                                  </VStack>
                                )}
                              </FieldArray>
                            </FormControl>

                            <FormControl>
                              <FormLabel>Medicines</FormLabel>
                              <FieldArray name="medicines">
                                {({ push, remove }) => (
                                  <VStack spacing={2}>
                                    {values.medicines.map((medicine, index) => (
                                      <HStack key={index} w="100%">
                                        <Input
                                          name={`medicines[${index}].name`}
                                          value={medicine.name}
                                          onChange={handleChange}
                                          placeholder="Medicine Name"
                                        />
                                        <Input
                                          name={`medicines[${index}].dosage`}
                                          value={medicine.dosage}
                                          onChange={handleChange}
                                          placeholder="Dosage per Day"
                                        />
                                        <Input
                                          name={`medicines[${index}].days`}
                                          value={medicine.days}
                                          onChange={handleChange}
                                          placeholder="Total Days"
                                        />
                                        <IconButton
                                          icon={<FaTrash />}
                                          onClick={() => remove(index)}
                                          colorScheme="red"
                                          variant="outline"
                                        />
                                      </HStack>
                                    ))}
                                    <Button
                                      onClick={() =>
                                        push({ name: "", dosage: "", days: "" })
                                      }
                                      colorScheme="blue"
                                      variant="outline"
                                    >
                                      Add Medicine
                                    </Button>
                                  </VStack>
                                )}
                              </FieldArray>
                            </FormControl>

                            <Button type="submit" colorScheme="green">
                              Submit
                            </Button>
                          </VStack>
                        </Form>
                      )}
                    </Formik>
                  </Box>
                ) : (
                  <Text>No current patient selected</Text>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </Box>
      </Flex>
    </Container>
  );
};

export default DoctorPage;
