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
  InputGroup,
  InputRightElement,
  Flex,
  HStack,
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaUserShield,
  FaCalendarAlt,
  FaSearch,
} from "react-icons/fa";

const borderColor = "#e2e8f0"; // Light gray border color
const focusBorderColor = "#3182ce"; // Blue color for focus
const errorBorderColor = "red.500"; // Red color for error
const filledBackgroundColor = "#e8f0fe"; // Blue background color for filled input

const RegistrationForm = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [searchNIC, setSearchNIC] = useState("");

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
        .min(3, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
      NIC: Yup.string()
        .required("Required")
        .length(13, "NIC must be exactly 13 characters"),
      address: Yup.string()
        .required("Required")
        .min(5, "Minimum length should be 5 characters"),
      guardianName: Yup.string()
        .required("Required")
        .min(3, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
      age: Yup.number()
        .required("Required")
        .min(1)
        .max(200)
        .positive("Age must be a positive number")
        .integer("Age must be an integer"),
      phoneNumber: Yup.string()
        .required("Required")
        .matches(
          /^03[0-9]{9}$/,
          "Phone number must be valid Pakistani format (03XXXXXXXXX)"
        ),
    }),
    onSubmit: async (values) => {
      try {
        // Register or update patient and create a visit record
        const response = await axios.post(
          "http://localhost:3000/api/v1/patient",
          values
        );

        if (response.data.status === "success") {
          setSuccessMessage("Patient registration is successful");
          setErrorMessage("");

          // Reset form fields
          formik.resetForm();
        }
      } catch (error) {
        setErrorMessage(error.response.data.message);
        setSuccessMessage("");
      }
    },
  });

  const handleClearAll = () => {
    formik.resetForm();
    setSuccessMessage("");
    setErrorMessage("");
    setSearchNIC("");
  };

  const handleSearch = async () => {
    if (!searchNIC.trim()) {
      // Optionally show an alert or error message if search input is empty
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/patient?nic=${searchNIC}`
      );

      if (response.data && Array.isArray(response.data.patients)) {
        if (response.data.patients.length > 0) {
          const patient = response.data.patients[0]; // Assuming the first result is the correct one
          formik.setValues({
            patientName: patient.patientName || "",
            NIC: patient.NIC || "",
            address: patient.address || "",
            guardianName: patient.guardianName || "",
            age: patient.age || "",
            phoneNumber: patient.phoneNumber || "",
          });
          setErrorMessage("");
        } else {
          setErrorMessage("No patient found with this NIC.");
          formik.resetForm();
        }
      } else {
        setErrorMessage("Unexpected response format.");
        formik.resetForm();
      }
    } catch (error) {
      console.error("Search error:", error);
      setErrorMessage("Failed to search patient. Please try again.");
    }
  };

  const getInputStyles = (fieldName) => {
    // Ensure fieldName is a string and not undefined
    if (typeof fieldName !== "string") {
      return {};
    }

    const value = formik.values[fieldName];
    const isFilled =
      typeof value === "string" ? value.trim().length > 0 : value != null; // Check for filled value
    const isError = formik.errors[fieldName] && formik.touched[fieldName];
    const backgroundColor = isError
      ? "red.50"
      : isFilled
      ? filledBackgroundColor
      : "white";

    return {
      borderColor: isError ? errorBorderColor : borderColor,
      backgroundColor,
      boxShadow: isError ? undefined : "0 0 0 1px #3182ce", // Blue shadow if not an error
    };
  };

  return (
    <Container maxWidth="95%" mx="auto">
      <Box bg="white" p={4} rounded="md" shadow="sm">
        <Heading textAlign="center" mb={3} fontSize="24px">
          OPD Registration
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
        <Box display="flex" justifyContent="flex-end" mb={1}>
          <InputGroup width="auto">
            <Input
              placeholder="Enter NIC to search"
              value={searchNIC}
              onChange={(e) => setSearchNIC(e.target.value)}
              borderColor={borderColor}
              _focus={{
                borderColor: focusBorderColor,
                boxShadow: "0 0 0 1px #3182ce",
              }}
              borderWidth="1px"
              borderRadius="md"
              p={2}
              height="30px"
              fontSize="sm"
            />
            <InputRightElement>
              <Button
                colorScheme="teal"
                onClick={handleSearch}
                aria-label="Search"
                variant="outline"
                size="sm"
                mt="-10px"
              >
                <FaSearch />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Flex direction="column" gap={1}>
            <Flex direction="row" alignItems="center" gap={4} mb={3}>
              <Box flex="1">
                <FormControl
                  isInvalid={
                    formik.errors.patientName && formik.touched.patientName
                  }
                >
                  <FormLabel htmlFor="patientName" fontSize="sm">
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaUser} mr={2} /> Patient Name
                  </FormLabel>
                  <Input
                    id="patientName"
                    {...formik.getFieldProps("patientName")}
                    {...getInputStyles("patientName")}
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
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaIdCard} mr={2} /> NIC
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
            </Flex>
            <Flex direction="row" alignItems="center" gap={4} mb={3}>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.address && formik.touched.address}
                >
                  <FormLabel htmlFor="address" fontSize="sm">
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaMapMarkerAlt} mr={2} /> Address
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
                    formik.errors.guardianName && formik.touched.guardianName
                  }
                >
                  <FormLabel htmlFor="guardianName" fontSize="sm">
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaUserShield} mr={2} /> Guardian Name
                  </FormLabel>
                  <Input
                    id="guardianName"
                    {...formik.getFieldProps("guardianName")}
                    {...getInputStyles("guardianName")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Flex>
            <Flex direction="row" alignItems="center" gap={4} mb={3}>
              <Box flex="1">
                <FormControl
                  isInvalid={formik.errors.age && formik.touched.age}
                >
                  <FormLabel htmlFor="age" fontSize="sm">
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaCalendarAlt} mr={2} /> Age
                  </FormLabel>
                  <Input
                    id="age"
                    type="number"
                    {...formik.getFieldProps("age")}
                    {...getInputStyles("age")}
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
                    <span style={{ color: "red" }}>*</span>{" "}
                    <Icon as={FaPhone} mr={2} /> Phone Number
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
            </Flex>
            <HStack>
              <Button
                type="button"
                colorScheme="red"
                mt={2}
                width="full"
                variant="outline"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button type="submit" colorScheme="teal" mt={2} width="full">
                Register
              </Button>
            </HStack>
          </Flex>
        </form>
      </Box>
    </Container>
  );
};

export default RegistrationForm;
