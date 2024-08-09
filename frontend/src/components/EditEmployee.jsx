import React, { useState, useEffect } from "react";
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
  VStack,
} from "@chakra-ui/react";
import {
  FaUser,
  FaIdCard,
  FaMapMarkerAlt,
  FaPhone,
  FaStethoscope,
  FaLock,
} from "react-icons/fa";
import { useParams } from "react-router-dom";

const borderColor = "#e2e8f0"; // Light gray border color
const focusBorderColor = "#3182ce"; // Blue color for focus
const errorBorderColor = "red.500"; // Red color for error
const filledBackgroundColor = "#e8f0fe"; // Blue background color for filled input

const EditEmployee = () => {
  const { id } = useParams();

  const [employee, setEmployee] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(
          `http://localhost:3000/api/v1/employee/${id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response);

        setEmployee(response.data.employee);
      } catch (error) {
        console.log(error);

        setErrorMessage("Error fetching employee details.");
      }
    };
    fetchEmployee();
  }, [id]);

  const formik = useFormik({
    initialValues: {
      name: employee?.name || "",
      NIC: employee?.NIC || "",
      address: employee?.address || "",
      phoneNumber: employee?.phoneNumber || "",
      speciality: employee?.speciality || "",
      ward: employee?.ward || "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string()
        .required("Required")
        .min(6, "The minimum length of password should be 6")
        .trim(),
      confirmPassword: Yup.string()
        .required("Required")
        .oneOf([Yup.ref("password"), null], "Passwords must match"),
    }),
    enableReinitialize: true,
    onSubmit: async (values) => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        await axios.patch(
          `http://localhost:3000/api/v1/employee/${id}`,
          {
            password: values.password,
            confirmPassword: values.confirmPassword,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSuccessMessage("Employee updated successfully!");
        setErrorMessage("");
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
    <Container maxW="95%" mx="auto" py="1rem">
      <Box
        bg="white"
        p="4"
        rounded="md"
        shadow="sm"
        border="1px"
        borderColor={borderColor}
      >
        <Heading textAlign="center" mb="4">
          Edit Employee
        </Heading>
        {successMessage && (
          <Alert status="success" borderRadius="md" mb="4">
            <AlertIcon />
            {successMessage}
          </Alert>
        )}
        {errorMessage && (
          <Alert status="error" borderRadius="md" mb="4">
            <AlertIcon />
            {errorMessage}
          </Alert>
        )}
        <form onSubmit={formik.handleSubmit}>
          <VStack spacing="4" align="stretch">
            <Flex justify="space-between" gap="4">
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="name" fontSize="sm">
                    <Icon as={FaUser} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Employee Name
                  </FormLabel>
                  <Input
                    id="name"
                    value={formik.values.name}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="NIC" fontSize="sm">
                    <Icon as={FaIdCard} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    NIC
                  </FormLabel>
                  <Input
                    id="NIC"
                    value={formik.values.NIC}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
            </Flex>

            <Flex justify="space-between" gap="4">
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="address" fontSize="sm">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Address
                  </FormLabel>
                  <Input
                    id="address"
                    value={formik.values.address}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="phoneNumber" fontSize="sm">
                    <Icon as={FaPhone} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Phone Number
                  </FormLabel>
                  <Input
                    id="phoneNumber"
                    value={formik.values.phoneNumber}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
            </Flex>

            <Flex justify="space-between" gap="4">
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="speciality" fontSize="sm">
                    <Icon as={FaStethoscope} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Speciality
                  </FormLabel>
                  <Input
                    id="speciality"
                    value={formik.values.speciality}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
              <Box flex="1">
                <FormControl>
                  <FormLabel htmlFor="ward" fontSize="sm">
                    <Icon as={FaMapMarkerAlt} mr={2} />
                    <Text as="span" color="red.500">
                      *
                    </Text>{" "}
                    Ward
                  </FormLabel>
                  <Input
                    id="ward"
                    value={formik.values.ward}
                    readOnly
                    borderWidth="1px"
                    borderRadius="md"
                    p="2"
                    height="30px"
                    fontSize="sm"
                    borderColor={borderColor}
                    _hover={{ borderColor: focusBorderColor }}
                  />
                </FormControl>
              </Box>
            </Flex>

            <Flex justify="space-between" gap="4">
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
                    p="2"
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
                    p="2"
                    height="30px"
                    fontSize="sm"
                  />
                </FormControl>
              </Box>
            </Flex>

            <Flex mt="4" gap="10px" justify="space-between">
              <Button
                flex="1"
                colorScheme="teal"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Update Employee
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
          </VStack>
        </form>
      </Box>
    </Container>
  );
};

export default EditEmployee;
