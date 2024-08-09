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
  FormLabel,
  FormControl,
  Button,
  Alert,
  AlertIcon,
  Text,
  Icon,
  Input,
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
      name: "",
      NIC: "",
      address: "",
      occupation: "",
      phoneNumber: "",
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
      occupation: Yup.string()
        .required("Required")
        .min(4, "Minimum length should be 3 characters")
        .max(15, "Maximum length should be 15 characters"),
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
    }),
    onSubmit: (values) => {
      axios
        .post("http://localhost:3000/api/v1/employee", values)
        .then((response) => {
          setSuccessMessage("Employee registered successfully!");
          setErrorMessage("");
        })
        .catch((error) => {
          setErrorMessage("Failed to register patient. Please try again.");
          setSuccessMessage("");
        });
    },
  });

  return (
    <Container minWidth="full">
      <Box bg="white" p={4} rounded="md" shadow="sm" w="100%">
        <Heading textAlign="center" mb={6}>
          Create Employee
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
                isInvalid={formik.errors.name && formik.touched.name}
              >
                <FormLabel htmlFor="name">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaUser} mr={2} />
                  Employee Name
                </FormLabel>
                <Input id="name" {...formik.getFieldProps("name")} />
                {formik.errors.name && formik.touched.name && (
                  <Text color="red.500">{formik.errors.name}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl isInvalid={formik.errors.NIC && formik.touched.NIC}>
                <FormLabel htmlFor="NIC">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaIdCard} mr={2} />
                  NIC
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
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaMapMarkerAlt} mr={2} />
                  Address
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
                  formik.errors.phoneNumber && formik.touched.phoneNumber
                }
              >
                <FormLabel htmlFor="phoneNumber">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaPhone} mr={2} />
                  Phone Number
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
                <FormLabel htmlFor="password">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaPhone} mr={2} />
                  Password
                </FormLabel>
                <Input
                  id="password"
                  type="password"
                  {...formik.getFieldProps("password")}
                />
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
                <FormLabel htmlFor="confirmPassword">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaPhone} mr={2} />
                  Confirm Password
                </FormLabel>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...formik.getFieldProps("confirmPassword")}
                />
                {formik.errors.confirmPassword &&
                  formik.touched.confirmPassword && (
                    <Text color="red.500">{formik.errors.confirmPassword}</Text>
                  )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.occupation && formik.touched.occupation
                }
              >
                <FormLabel htmlFor="occupation">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaUserShield} mr={2} />
                  Occupation
                </FormLabel>
                <Input
                  id="occupation"
                  {...formik.getFieldProps("occupation")}
                />
                {formik.errors.occupation && formik.touched.occupation && (
                  <Text color="red.500">{formik.errors.occupation}</Text>
                )}
              </FormControl>
            </GridItem>
            <GridItem>
              <FormControl
                isInvalid={
                  formik.errors.speciality && formik.touched.speciality
                }
              >
                <FormLabel htmlFor="speciality">
                  <Text as="span" color="red.500" mr={1}>
                    *
                  </Text>
                  <Icon as={FaCalendarAlt} mr={2} />
                  Speciality
                </FormLabel>
                <Input
                  id="speciality"
                  {...formik.getFieldProps("speciality")}
                />
                {formik.errors.speciality && formik.touched.speciality && (
                  <Text color="red.500">{formik.errors.speciality}</Text>
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
