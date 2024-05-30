import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Heading,
  Grid,
  GridItem,
  Box,
  HStack,
  Input,
  FormLabel,
  FormControl,
  Button,
  VStack,
  Alert,
  AlertIcon,
  Text,
  Icon,
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
} from "react-icons/fa";

const RegistrationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      patientName: "",
      NIC: "",
      address: "",
      guardianName: "",
      age: "",
      phoneNumber: "",
    },
    validationSchema: Yup.object({
      patientName: Yup.string()
        .required("Required")
        .min(3, "The minimum length of the name should be 3")
        .max(15, "The maximum length of the name should be 15"),
      NIC: Yup.string()
        .required("Required")
        .min(13, "The minimum length of the NIC should be 13")
        .max(13, "The maximum length of the NIC should be 13")
        .matches(/^\d+$/, "NIC must be a number"),
      address: Yup.string()
        .required("Required")
        .min(4, "The address should be of length of 4"),
      guardianName: Yup.string()
        .required("Required")
        .min(3, "The minimum length of the name should be 3")
        .max(15, "The maximum length of the name should be 15"),
      age: Yup.string()
        .required("Required")
        .min(1, "Age must be a positive number")
        .matches(/^\d+$/, "Age must be a number"),
      phoneNumber: Yup.string()
        .required("Required")
        .min(11, "The phone number is wrong")
        .matches(/^\d+$/, "Phone number is wrong"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:3000/api/v1/patient", values)
        .then((res) => {
          setSuccessMessage("Patient registered successfully!");
          setErrorMessage("");
          // resetForm();
        })
        .catch((err) => {
          setErrorMessage("Failed to register patient. Please try again.");
          setSuccessMessage("");
        });
    },
  });

  const handleClear = () => {
    formik.resetForm();
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Container py={6} maxWidth="90%">
      <Box bg="white" p={6} rounded="md" shadow="sm" w="100%">
        <Heading textAlign="center" mb={8}>
          OPD Registration
        </Heading>
        {successMessage && (
          <Alert status="success" mb={4}>
            <AlertIcon />
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" gap={6}>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.patientName && formik.touched.patientName
                }
              >
                <HStack w="100%">
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaUser} mr={2} /> Patient Name
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter patient name"
                    {...formik.getFieldProps("patientName")}
                  />
                </HStack>
                {formik.errors.patientName && formik.touched.patientName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.patientName}
                  </Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={formik.errors.NIC && formik.touched.NIC}>
                <HStack>
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaIdCard} mr={2} /> NIC
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter NIC"
                    {...formik.getFieldProps("NIC")}
                  />
                </HStack>
                {formik.errors.NIC && formik.touched.NIC && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.NIC}
                  </Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={formik.errors.address && formik.touched.address}
              >
                <HStack>
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaMapMarkerAlt} mr={2} /> Address
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter address"
                    {...formik.getFieldProps("address")}
                  />
                </HStack>
                {formik.errors.address && formik.touched.address && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.address}
                  </Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.guardianName && formik.touched.guardianName
                }
              >
                <HStack>
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaUserShield} mr={2} /> Guardian Name
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter guardian name"
                    {...formik.getFieldProps("guardianName")}
                  />
                </HStack>
                {formik.errors.guardianName && formik.touched.guardianName && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.guardianName}
                  </Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={formik.errors.age && formik.touched.age}>
                <HStack>
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaCalendarAlt} mr={2} /> Age
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter age"
                    {...formik.getFieldProps("age")}
                  />
                </HStack>
                {formik.errors.age && formik.touched.age && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.age}
                  </Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                }
              >
                <HStack>
                  <FormLabel fontSize="sm" w="40%">
                    <Icon as={FaPhone} mr={2} /> Phone Number
                  </FormLabel>
                  <Input
                    type="text"
                    placeholder="Enter phone number"
                    {...formik.getFieldProps("phoneNumber")}
                  />
                </HStack>
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <Text color="red.500" fontSize="sm" mt={1}>
                    {formik.errors.phoneNumber}
                  </Text>
                )}
              </FormControl>
            </GridItem>
          </Grid>
          <HStack justify="flex-end" mt={6}>
            <Button colorScheme="red" onClick={handleClear}>
              Clear All
            </Button>
            <Button colorScheme="blue" type="submit" w="100px">
              Save
            </Button>
          </HStack>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
