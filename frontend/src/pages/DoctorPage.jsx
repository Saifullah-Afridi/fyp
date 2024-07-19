import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Heading,
  Box,
  Container,
  Text,
  HStack,
  Spinner,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  VStack,
  IconButton,
} from "@chakra-ui/react";
import { Formik, FieldArray, Form } from "formik";
import Header from "../components/Header";

const DoctorPage = ({ patients, setPatients }) => {
  const [currentPatient, setCurrentPatient] = useState(null);

  useEffect(() => {
    if (patients.length > 0) {
      setCurrentPatient(patients[0]);
    }
  }, [patients]);

  const handleNextPatient = () => {
    setPatients((prevPatients) => {
      if (prevPatients.length > 1) {
        const [current, ...rest] = prevPatients;
        setCurrentPatient(rest[0]);
        return rest;
      } else {
        setCurrentPatient(null);
        return [];
      }
    });
  };

  const handleSubmit = (values) => {
    console.log("Doctor Form Values:", values);
    // Add logic to handle the form submission (e.g., sending data to the server)
  };

  return (
    <Container maxWidth="95%">
      <Box bg="white" p={2} rounded="md" shadow="sm" w="100%">
        <Header />
        <HStack alignItems="center" gap="4rem" mb="1rem" w="100%">
          <Heading fontSize="30px" mb="20px" textColor="blue.400">
            Patients in Pending
          </Heading>
          <Text fontSize="18px" textColor="blue.400">
            Total Patients: {patients.length}
          </Text>
        </HStack>
        {patients.length === 0 ? (
          <Spinner size="xl" />
        ) : (
          <>
            <Button
              colorScheme="blue"
              onClick={handleNextPatient}
              mb="20px"
              isDisabled={!currentPatient}
            >
              Next Patient
            </Button>
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

                <Formik
                  initialValues={{
                    prescription: "",
                    note: "",
                    medicines: [""],
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
                          <FormLabel>Doctor's Note</FormLabel>
                          <Textarea
                            name="note"
                            value={values.note}
                            onChange={handleChange}
                          />
                        </FormControl>

                        <FormControl>
                          <FormLabel>Medicines</FormLabel>
                          <FieldArray name="medicines">
                            {({ push, remove }) => (
                              <VStack spacing={2}>
                                {values.medicines.map((medicine, index) => (
                                  <HStack key={index} w="100%">
                                    <Input
                                      name={`medicines[${index}]`}
                                      value={medicine}
                                      onChange={handleChange}
                                      placeholder="Enter medicine"
                                    />
                                    <IconButton
                                      icon={<i className="fas fa-minus" />}
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
