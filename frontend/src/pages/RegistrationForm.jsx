import React, { useState } from "react";
import axios from "axios";
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
  const [patientName, setPatientName] = useState("");
  const [NIC, setNIC] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    const patientDetail = {
      patientName,
      NIC,
      address,
      guardianName,
      age,
      phoneNumber,
    };

    console.log("Submitting Patient Details:", patientDetail);

    axios
      .post("http://localhost:3000/api/v1/patient", patientDetail)
      .then((res) => {
        console.log("Response from server:", res.data);
        setSuccessMessage("Patient registered successfully!");
        setErrorMessage("");
      })
      .catch((err) => {
        console.log("Error:", err);
        setErrorMessage("Failed to register patient. Please try again.");
        setSuccessMessage("");
      });
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
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2, 1fr)" w="100%" mt="2rem" gap={10}>
            <GridItem w={"100%"}>
              <Box>
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Patient Name
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={patientName}
                      onChange={(e) => setPatientName(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      NIC
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={NIC}
                      onChange={(e) => setNIC(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Address
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
            </GridItem>
            <GridItem w={"100%"}>
              <Box>
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Guardian Name
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={guardianName}
                      onChange={(e) => setGuardianName(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Age
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={age}
                      onChange={(e) => setAge(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
              <Box mt="1rem">
                <FormControl>
                  <HStack justifyItems="center">
                    <FormLabel w={"20%"} fontSize="14px">
                      Phone Number
                    </FormLabel>
                    <Input
                      type="text"
                      borderColor="black"
                      w="80%"
                      size="small"
                      borderRadius="4px"
                      value={phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                    />
                  </HStack>
                </FormControl>
              </Box>
            </GridItem>
          </Grid>
          <Box w="100%" display="flex" justifyContent="flex-end">
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
