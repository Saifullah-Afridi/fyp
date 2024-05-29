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
} from "@chakra-ui/react";

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
      patientName: Yup.string().required("Required"),
      NIC: Yup.string().required("Required"),
      address: Yup.string().required("Required"),
      guardianName: Yup.string().required("Required"),
      age: Yup.number()
        .required("Required")
        .min(0, "Age must be a positive number"),
      phoneNumber: Yup.string().required("Required"),
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
    <Container minWidth={"95%"}>
      <Heading textAlign="center" mt="1rem">
        OPD Registration
      </Heading>
      {successMessage && (
        <Alert status="success" mt="1rem">
          <AlertIcon />
          {successMessage}
        </Alert>
      )}
      {errorMessage && (
        <Alert status="error" mt="1rem">
          <AlertIcon />
          {errorMessage}
        </Alert>
      )}
      <VStack w={"100%"} alignItems="space-between">
        <form onSubmit={formik.handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" w="100%" mt="2rem" gap={10}>
            <GridItem w={"100%"}>
              <Box>
                <FormControl
                  isInvalid={
                    formik.errors.patientName && formik.touched.patientName
                  }
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Patient Name
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      name="patientName"
                      size="small"
                      borderRadius="4px"
                      value={formik.values.patientName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl
                  isInvalid={formik.errors.NIC && formik.touched.NIC}
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      NIC
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      name="NIC"
                      size="small"
                      borderRadius="4px"
                      value={formik.values.NIC}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl
                  isInvalid={formik.errors.address && formik.touched.address}
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Address
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      name="address"
                      size="small"
                      borderRadius="4px"
                      value={formik.values.address}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
            </GridItem>
            <GridItem w={"100%"}>
              <Box>
                <FormControl
                  isInvalid={
                    formik.errors.guardianName && formik.touched.guardianName
                  }
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Guardian Name
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      name="guardianName"
                      borderRadius="4px"
                      value={formik.values.guardianName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl
                  isInvalid={formik.errors.age && formik.touched.age}
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Age
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      name="age"
                      size="small"
                      borderRadius="4px"
                      value={formik.values.age}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl
                  isInvalid={
                    formik.errors.phoneNumber && formik.touched.phoneNumber
                  }
                >
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Phone Number
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      name="phoneNumber"
                      size="small"
                      borderRadius="4px"
                      value={formik.values.phoneNumber}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                  </HStack>
                </FormControl>
              </Box>
            </GridItem>
          </Grid>
          <Box w="100%" display="flex" justifyContent="flex-end" gap="10px">
            <Button
              type="button"
              mt="2rem"
              bg="red.400"
              w={"10%"}
              _hover={{ bg: "red.600" }}
              onClick={handleClear}
            >
              Clear All
            </Button>{" "}
            <Button type="submit" mt="2rem" colorScheme="blue" w={"10%"}>
              Save
            </Button>
          </Box>
        </form>
      </VStack>
    </Container>
  );
};

export default RegistrationForm;
