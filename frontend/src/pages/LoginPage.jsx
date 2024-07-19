import {
  Flex,
  Box,
  FormControl,
  FormLabel,
  Input,
  Checkbox,
  Stack,
  Button,
  Heading,
  Text,
  useColorModeValue,
  Alert,
  AlertIcon,
} from "@chakra-ui/react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const navigate = useNavigate();
  const [employeeRole, setEmployeeRole] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const formik = useFormik({
    initialValues: {
      NIC: "",
      password: "",
    },
    validationSchema: Yup.object({
      NIC: Yup.string().min(4, "The minimum length of password should be 4"),
      password: Yup.string(),
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:3000/api/v1/employee/login", values)
        .then((response) => {
          console.log(response);
          localStorage.setItem("user", JSON.stringify(response.data.employee));
          const user = JSON.parse(localStorage.getItem("user"));
          let userRole;
          if (user) {
            userRole = user.occupation;
          }
          if (userRole === "admin") {
            navigate("/admin");
          }
          if (userRole === "doctor") {
            navigate("/doctor");
          }
          if (userRole === "receptionist") {
            navigate("/receptionist");
          }
          setSuccessMessage("Patient Login");
          setErrorMessage("");
        })
        .catch((error) => {
          console.log(error);
          setErrorMessage(error.response.data.message);
          setSuccessMessage("");
        });
    },
  });

  return (
    <Flex
      minH={"100vh"}
      align={"center"}
      justify={"center"}
      bg={useColorModeValue("gray.50", "gray.800")}
    >
      <Stack spacing={8} mx={"auto"} py={12} px={6} width="65%">
        <Stack align={"center"}>
          <Heading fontSize={"4xl"}>Login </Heading>
        </Stack>
        <Box
          rounded={"lg"}
          bg={useColorModeValue("white", "gray.700")}
          boxShadow={"lg"}
          p={8}
        >
          {errorMessage && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              {errorMessage}
            </Alert>
          )}
          <form onSubmit={formik.handleSubmit}>
            <Stack spacing={10}>
              <FormControl isInvalid={formik.errors.NIC && formik.touched.NIC}>
                <FormLabel>NIC</FormLabel>
                <Input
                  type=""
                  placeholder="NIC..."
                  name="NIC"
                  value={formik.values.NIC}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.NIC && formik.touched.NIC && (
                  <Text color="red.500">{formik.errors.NIC}</Text>
                )}
              </FormControl>
              <FormControl
                isInvalid={formik.errors.password && formik.touched.password}
              >
                <FormLabel>Password</FormLabel>
                <Input
                  type="password"
                  placeholder="Password..."
                  name="password"
                  value={formik.values.password}
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                />
                {formik.errors.password && formik.touched.password && (
                  <Text color="red.500">{formik.errors.password}</Text>
                )}
              </FormControl>
              <Stack spacing={10}>
                <Button
                  type="submit"
                  bg={"blue.400"}
                  color={"white"}
                  _hover={{
                    bg: "blue.500",
                  }}
                >
                  Login
                </Button>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
