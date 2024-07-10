import React, { useState, useRef } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Heading,
  Grid,
  GridItem,
  Box,
  FormLabel,
  FormControl,
  Button,
  Alert,
  AlertIcon,
  Text,
  Icon,
  Input,
  Image,
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
} from "react-icons/fa";

const CreateEmployee = () => {
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
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      patientName: Yup.string()
        .required("Required")
        .min(3, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
      NIC: Yup.string()
        .required("Required")
        .length(13, "NIC must be exactly 13 characters"),
      address: Yup.string()
        .required("Required")
        .min(4, "Minimum length should be 10 characters"),
      guardianName: Yup.string()
        .required("Required")
        .min(3, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
      age: Yup.number()
        .required("Required")
        .positive("Age must be a positive number")
        .integer("Age must be an integer"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(
          /^03[0-9]{9}$/,
          "Phone number must be valid Pakistani format (03XXXXXXXXX)"
        ),
      password: Yup.string()
        .required("Required")
        .min(6, "The minimum length of password should be 6")
        .trim(),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
      imageSrc: Yup.string().url("Invalid image URL"),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:3000/api/v1/patient", values)
        .then((response) => {
          setSuccessMessage("Patient registered successfully!");
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage("Failed to register patient. Please try again.");
          setSuccessMessage("");
        });
    },
  });

  return (
    <Container py={6} maxWidth="container.md">
      <Box bg="white" p={6} rounded="md" shadow="sm">
        <Heading textAlign="center" mb={6}>
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
                <FormLabel htmlFor="patientName">
                  <Icon as={FaUser} mr={2} /> Patient Name
                </FormLabel>
                <Input
                  id="patientName"
                  {...formik.getFieldProps("patientName")}
                />
                {formik.errors.patientName && formik.touched.patientName && (
                  <Text color="red.500">{formik.errors.patientName}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={formik.errors.NIC && formik.touched.NIC}>
                <FormLabel htmlFor="NIC">
                  <Icon as={FaIdCard} mr={2} /> NIC
                </FormLabel>
                <Input id="NIC" {...formik.getFieldProps("NIC")} />
                {formik.errors.NIC && formik.touched.NIC && (
                  <Text color="red.500">{formik.errors.NIC}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={formik.errors.address && formik.touched.address}
              >
                <FormLabel htmlFor="address">
                  <Icon as={FaMapMarkerAlt} mr={2} /> Address
                </FormLabel>
                <Input id="address" {...formik.getFieldProps("address")} />
                {formik.errors.address && formik.touched.address && (
                  <Text color="red.500">{formik.errors.address}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.guardianName && formik.touched.guardianName
                }
              >
                <FormLabel htmlFor="guardianName">
                  <Icon as={FaUserShield} mr={2} /> Guardian Name
                </FormLabel>
                <Input
                  id="guardianName"
                  {...formik.getFieldProps("guardianName")}
                />
                {formik.errors.guardianName && formik.touched.guardianName && (
                  <Text color="red.500">{formik.errors.guardianName}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={formik.errors.age && formik.touched.age}>
                <FormLabel htmlFor="age">
                  <Icon as={FaCalendarAlt} mr={2} /> Age
                </FormLabel>
                <Input id="age" {...formik.getFieldProps("age")} />
                {formik.errors.age && formik.touched.age && (
                  <Text color="red.500">{formik.errors.age}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                }
              >
                <FormLabel htmlFor="phoneNumber">
                  <Icon as={FaPhone} mr={2} /> Phone Number
                </FormLabel>
                <Input
                  id="phoneNumber"
                  {...formik.getFieldProps("phoneNumber")}
                />
                {formik.errors.phoneNumber && formik.touched.phoneNumber && (
                  <Text color="red.500">{formik.errors.phoneNumber}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={formik.errors.password && formik.touched.password}
              >
                <FormLabel htmlFor="Password">
                  <Icon as={FaPhone} mr={2} /> Password
                </FormLabel>
                <Input id="Password" {...formik.getFieldProps("password")} />
                {formik.errors.password && formik.touched.password && (
                  <Text color="red.500">{formik.errors.password}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.confirmPassword &&
                  formik.touched.confirmPassword
                }
              >
                <FormLabel htmlFor="confirmPasswordd">
                  <Icon as={FaPhone} mr={2} /> Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <Text color="red.500">{formik.errors.confirmPassword}</Text>
                  )}
              </FormControl>
            </GridItem>
          </Grid>
          <Box mt={4} display="flex" justifyContent="flex-end" gap="10px">
            <Button colorScheme="red" onClick={() => formik.resetForm()}>
              Clear All
            </Button>
            <Button colorScheme="blue" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateEmployee;
