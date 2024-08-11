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
  Image,
} from "@chakra-ui/react";
import { FaUser, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const borderColor = "#e2e8f0"; // Light gray border color
const focusBorderColor = "#3182ce"; // Blue color for focus
const errorBorderColor = "red.500"; // Red color for error
const filledBackgroundColor = "#e8f0fe"; // Blue background color for filled input

const Login = () => {
  const navigate = useNavigate();
  const [employeeRole, setEmployeeRole] = useState("");

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      NIC: "",
      password: "",
    },
    validationSchema: Yup.object({
      NIC: Yup.string().required().length(13),
      password: Yup.string().required(),
    }),
    onSubmit: async (values) => {
      axios
        .post("http://localhost:3000/api/v1/employee/login", values)
        .then((response) => {
          localStorage.setItem("user", JSON.stringify(response.data.employee));
          localStorage.setItem("token", JSON.stringify(response.data.token));
          const user = JSON.parse(localStorage.getItem("user"));
          let userRole;
          if (user) {
            userRole = user.occupation;
            navigate(`/${userRole}`);
          }

          // if (userRole === "doctor") {
          //   navigate("/doctor");
          // }
          // if (userRole === "receptionist") {
          //   navigate("/receptionist");
          // }
          // setSuccessMessage("Patient Login");
          // setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage(error.response.data.message);
          setSuccessMessage("");
        });
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
      <Flex
        direction={{ base: "column", md: "row" }}
        justify="center"
        h="90vh"
        gap={5}
      >
        {/* Image Section */}
        <Box
          flex="1"
          display={{ base: "none", md: "block" }} // Hide on mobile
        >
          <Box
            rounded={5}
            mt={3}
            bgImage={"/login-screen.jpg"}
            bgPosition="center"
            bgRepeat="no-repeat"
            backgroundSize="cover"
            style={{ width: "100%", height: "95%", objectFit: "cover" }}
          />
        </Box>
        {/* Form Section */}
        <Box
          justifySelf="center"
          alignSelf="center"
          bg="white"
          h="100%"
          p={6}
          flex="1"
          maxWidth={{ base: "100%", md: "50%" }}
          mb={{ base: 6, md: 0 }}
        >
          <Heading textAlign="center" mt={20} mb={3} fontSize="24px">
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
                <FormControl
                  isInvalid={formik.errors.NIC && formik.touched.NIC}
                >
                  <FormLabel htmlFor="NIC" fontSize="sm">
                    <Icon as={FaUser} mr={2} />
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
                  <Box position="relative">
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
                      position="absolute"
                      right="2"
                      top="50%"
                      transform="translateY(-50%)"
                      zIndex="1"
                    >
                      <Icon as={showPassword ? FaEyeSlash : FaEye} />
                    </Button>
                  </Box>
                </FormControl>
              </Box>

              <Flex mt={4} gap="10px" align="center" justify="center">
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
      </Flex>
    </Container>
  );
};

export default Login;
