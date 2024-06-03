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
      return nextPatients;
    });
  };

  const handleSubmit = (values) => {
    console.log("Doctor Form Values:", values);
    // Add logic to handle the form submission (e.g., sending data to the server)
  };

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
            <Table variant="unstyled" colorScheme="teal" shadow="sm" mb="20px">
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
                <Grid
                  templateColumns="repeat(2, 1fr)"
                  gap={6}
                  mb="1rem"
                  px="20px"
                >
                  <GridItem>
                    <HStack mb="1rem">
                      <Text fontWeight="bold">Name :</Text>
                      <Text>{currentPatient.patientName}</Text>
                    </HStack>
                    <HStack mb="1rem">
                      <Text fontWeight="bold">Age :</Text>
                      <Text>{currentPatient.age}</Text>
                    </HStack>
                  </GridItem>
                  <GridItem>
                    <HStack mb="1rem">
                      <Text fontWeight="bold"> Blood Group :</Text>
                      <Text>{currentPatient.bloodGroup}</Text>
                    </HStack>
                    <HStack mb="1rem">
                      <Text fontWeight="bold">Address:</Text>
                      <Text>{currentPatient.address}</Text>
                    </HStack>
                  </GridItem>
                </Grid>

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
                      <VStack spacing={4} w="100%">
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
                        <HStack alignItems="center" justifyContent="flex-end">
                          <Button type="submit" colorScheme="green">
                            Submit
                          </Button>
                          <Button
                            colorScheme="blue"
                            onClick={handleNextPatient}
                            isDisabled={patients.length === 0}
                          >
                            Next Patient
                          </Button>
                        </HStack>
                      </VStack>
                    </Form>
                  )}
                </Formik>
              </Box>
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default DoctorPage;
