import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
  Heading,
  Box,
  FormLabel,
  FormControl,
  Button,
  Alert,
  AlertIcon,
  Icon,
  Input,
  Text,
  Flex,
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaStethoscope,
  FaLock,
} from "react-icons/fa";

const borderColor = "#e2e8f0"; // Light gray border color
const focusBorderColor = "#3182ce"; // Blue color for focus
const errorBorderColor = "red.500"; // Red color for error
const filledBackgroundColor = "#e8f0fe"; // Blue background color for filled input

const CreateDoctor = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      name: "",
      NIC: "",
      address: "",
      phoneNumber: "",
      speciality: "",
      ward: "", // Added ward field
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .required("Required")
        .min(3, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
      NIC: Yup.string()
        .required("Required")
        .length(13, "NIC must be exactly 13 characters"),
      address: Yup.string()
        .required("Required")
        .min(4, "Minimum length should be 4 characters"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(
          /^03[0-9]{9}$/,
          "Phone number must be valid Pakistani format (03XXXXXXXXX)"
        ),
      speciality: Yup.string().required("Required"),
      ward: Yup.string().required("Required"), // Added ward validation
      password: Yup.string()
        .required("Required")
        .min(6, "The minimum length of password should be 6")
        .trim(),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    onSubmit: async (values) => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from local storage

        await axios.post(
          "http://localhost:3000/api/v1/employee",
          {
            ...values,
            occupation: "doctor",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`, // Add the token to the Authorization header
            },
          }
        );
        setSuccessMessage("Doctor created successfully!");
        setErrorMessage("");
        formik.resetForm();
      } catch (error) {
        setErrorMessage(error.response.data.message);

        setSuccessMessage("");
      }
    },
  });

  const getInputStyles = (fieldName) => {
    const isFilled = formik.values[fieldName]?.trim().length > 0;
    const isError = formik.errors[fieldName] && formik.touched[fieldName];
    const backgroundColor = isError
      ? "red.50"
      : isFilled
      ? filledBackgroundColor
      : "white";

    return {
      borderColor: isError ? errorBorderColor : borderColor,
      backgroundColor,
      boxShadow: isError ? undefined : `0 0 0 1px ${focusBorderColor}`, // Blue shadow if not an error
    };
  };

  const handleClearAll = () => {
    formik.resetForm();
    setSuccessMessage("");
    setErrorMessage("");
  };

  return (
    <Container maxWidth="95%" mx="auto">
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Heading textAlign="center" mb={3} fontSize="24px">
          Create Doctor
        </Heading>
        {successMessage && (
          <Alert status="success" mb={2}>
            <AlertIcon />
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" mb={2}>
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <Box display="flex" flexDirection="column" gap={4}>
            <Box display="flex" gap={4}>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.name && formik.touched.name}
                >
                  <FormLabel htmlFor="name" fontSize="sm">
                    <Icon as={FaUser} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Doctor Name
                  </FormLabel>
                  <Input
                    id="name"
                    {...formik.getFieldProps("name")}
                    {...getInputStyles("name")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.NIC && formik.touched.NIC}
                >
                  <FormLabel htmlFor="NIC" fontSize="sm">
                    <Icon as={FaIdCard} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    NIC
                  </FormLabel>
                  <Input
                    id="NIC"
                    {...formik.getFieldProps("NIC")}
                    {...getInputStyles("NIC")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" gap={4}>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.address && formik.touched.address}
                >
                  <FormLabel htmlFor="address" fontSize="sm">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Address
                  </FormLabel>
                  <Input
                    id="address"
                    {...formik.getFieldProps("address")}
                    {...getInputStyles("address")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl
                  isInvalid={
                    formik.errors.phoneNumber && formik.touched.phoneNumber
                  }
                >
                  <FormLabel htmlFor="phoneNumber" fontSize="sm">
                    <Icon as={FaPhone} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Phone Number
                  </FormLabel>
                  <Input
                    id="phoneNumber"
                    {...formik.getFieldProps("phoneNumber")}
                    {...getInputStyles("phoneNumber")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" gap={4}>
              <Box flex="1">
                <FormControl
                  isInvalid={
                    formik.errors.speciality && formik.touched.speciality
                  }
                >
                  <FormLabel htmlFor="speciality" fontSize="sm">
                    <Icon as={FaStethoscope} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Speciality
                  </FormLabel>
                  <Input
                    id="speciality"
                    {...formik.getFieldProps("speciality")}
                    {...getInputStyles("speciality")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.ward && formik.touched.ward}
                >
                  <FormLabel htmlFor="ward" fontSize="sm">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Ward
                  </FormLabel>
                  <Input
                    id="ward"
                    {...formik.getFieldProps("ward")}
                    {...getInputStyles("ward")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Box>
            <Box display="flex" gap={4}>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.password && formik.touched.password}
                >
                  <FormLabel htmlFor="password" fontSize="sm">
                    <Icon as={FaLock} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Password
                  </FormLabel>
                  <Input
                    id="password"
                    type="password"
                    {...formik.getFieldProps("password")}
                    {...getInputStyles("password")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl
                  isInvalid={
                    formik.errors.confirmPassword &&
                    formik.touched.confirmPassword
                  }
                >
                  <FormLabel htmlFor="confirmPassword" fontSize="sm">
                    <Icon as={FaLock} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Confirm Password
                  </FormLabel>
                  <Input
                    id="confirmPassword"
                    type="password"
                    {...formik.getFieldProps("confirmPassword")}
                    {...getInputStyles("confirmPassword")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Box>
            <Flex mt={4} gap="10px" align="center" justify="space-between">
              <Button
                flex="1"
                colorScheme="teal"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Create Doctor
              </Button>
              <Button
                flex="1"
                variant="outline"
                colorScheme="teal"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
            </Flex>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default CreateDoctor;
