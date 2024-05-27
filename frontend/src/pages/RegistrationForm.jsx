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
} from "@chakra-ui/react";

const RegistrationForm = () => {
  const [patientName, setPatientName] = useState("");
  const [NIC, setNIC] = useState("");
  const [address, setAddress] = useState("");
  const [guardianName, setGuardianName] = useState("");
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

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

    console.log("hello");
    console.log("hellsdaso");

    axios
      .post("http://localhost:3000/api/v1/patient", patientDetail)
      .then((res) => {
        console.log(res);
        console.log("hello there");
      })
      .catch((err) => console.log(err));
    console.log("hello");
    console.log("hellsdaso");
  };

  return (
    <Container minWidth={"95%"}>
      <Heading textAlign="center" mt="1rem">
        OPD Registration
      </Heading>
      <VStack w={"100%"} alignItems="space-between">
        <form onSubmit={handleSubmit}>
          <Grid templateColumns="repeat(2,1fr)" w="100%" mt="2rem" gap={10}>
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
