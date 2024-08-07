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
    setPatients((prevPatients) => {
      const nextPatients = prevPatients.slice(1);
      setCurrentPatient(nextPatients[0].patientId);
      setTotalPatients(nextPatients.length);
      return nextPatients;
    });
  };

  const handleSubmit = async (values) => {
    try {
      const response = await axios.post(
        `http://localhost:3000/api/v1/visit/record`,
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
                {patients.map((visit, index) => (
                  <Tr key={visit.patientId._id}>
                    <Td>{index + 1}</Td>
                    <Td>{visit.patientId.patientName}</Td>
                    <Td>{new Date(visit.date).toLocaleTimeString()}</Td>
                    <Td>{visit.patientId._id}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
            {currentPatient && (
              <Box bg="gray.50" p={6} rounded="md" shadow="sm">
                <Heading fontSize="24px" mb="4">
                  Current Patient Details
                </Heading>
                <Text>
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
            )}
          </>
        )}
      </Box>
    </Container>
  );
};

export default DoctorPage;
