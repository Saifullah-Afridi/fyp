import React, { useState } from "react";
import axios from "axios";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Container,
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
  Heading,
} from "@chakra-ui/react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const borderColor = "#e2e8f0"; // Light gray border color
const focusBorderColor = "#3182ce"; // Blue color for focus
const errorBorderColor = "red.500"; // Red color for error
const filledBackgroundColor = "#e8f0fe"; // Blue background color for filled input

const Login = () => {
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      nic: "",
      password: "",
    },
    validationSchema: Yup.object({
      nic: Yup.string()
        .required("Required")
        .length(13, "NIC must be exactly 13 characters long"),
      password: Yup.string().required("Required").trim(),
    }),
    onSubmit: async (values) => {
      try {
        await axios.post("http://localhost:3000/api/v1/login", values);
        setSuccessMessage("Login successful!");
        setErrorMessage("");
        formik.resetForm();
      } catch (error) {
        setErrorMessage("Login failed. Please check your credentials.");
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
    <Container maxWidth="70%" mx="auto" py={20}>
      <Box
        bg="white"
        p={6}
        rounded="md"
        shadow="md"
        borderWidth="1px"
        borderColor={borderColor}
        mx="auto"
      >
        <Heading textAlign="center" mb={3} fontSize="24px">
          Login
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
            <Box>
              <FormControl isInvalid={formik.errors.nic && formik.touched.nic}>
                <FormLabel htmlFor="nic" fontSize="sm">
                  <Icon as={FaUser} mr={2} />
                  <Text as="span" color="red.500">
                    *
                  </Text>{" "}
                  NIC
                </FormLabel>
                <Input
                  id="nic"
                  {...formik.getFieldProps("nic")}
                  {...getInputStyles("nic")}
                  borderWidth="1px"
                  borderRadius="md"
                  p={2}
                  height="30px"
                  fontSize="sm"
                />
              </FormControl>
            </Box>
            <Box>
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
                <Flex>
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    {...formik.getFieldProps("password")}
                    {...getInputStyles("password")}
                    borderWidth="1px"
                    borderRadius="md"
                    p={2}
                    height="30px"
                    fontSize="sm"
                    flex="1"
                  />
                  <Button
                    variant="link"
                    colorScheme="teal"
                    onClick={() => setShowPassword(!showPassword)}
                    ml={-10} // Adjust margin to align the button correctly
                  >
                    <Icon as={showPassword ? FaEyeSlash : FaEye} />
                  </Button>
                </Flex>
              </FormControl>
            </Box>
            <Flex mt={4} gap="10px" align="center" justify="space-between">
              <Button
                flex="1"
                variant="outline"
                colorScheme="teal"
                onClick={handleClearAll}
              >
                Clear All
              </Button>
              <Button
                flex="1"
                colorScheme="teal"
                type="submit"
                isLoading={formik.isSubmitting}
              >
                Login
              </Button>
            </Flex>
          </Box>
        </form>
      </Box>
    </Container>
  );
};

export default Login;
