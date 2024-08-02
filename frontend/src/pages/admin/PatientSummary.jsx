import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardBody,
  Heading,
  Text,
  Flex,
  Spinner,
  Alert,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react";

const PatientSummary = () => {
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        setLoading(true);
        setError("");
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient/summary"
        );
        setSummary(response.data.data);
        setLoading(false);
        setError("");
      } catch (err) {
        setLoading(false);
        console.log(err);

        setError(err.response.data.message);
      }
    };

    fetchSummary();
  }, []);

  return (
    <Box p={4} maxW="100vw" maxH="100vh" overflow="hidden">
      <Heading textAlign="center" mb={6}>
        Patient Summary
      </Heading>
      {loading && <Spinner />}
      {error && (
        <Alert status="error">
          <AlertTitle>Error:</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      {summary && (
        <Flex gap={6} mb={6} justify="space-between">
          <Card
            width={{ base: "full", sm: "45%" }}
            boxShadow="md"
            borderRadius="md"
          >
            <CardBody>
              <Heading size="sm" mb={2}>
                Patients Today
              </Heading>
              <Text fontSize="2xl" fontWeight="bold">
                {summary.patientsToday}
              </Text>
            </CardBody>
          </Card>
          <Card
            width={{ base: "full", sm: "45%" }}
            boxShadow="md"
            borderRadius="md"
          >
            <CardBody>
              <Heading size="sm" mb={2}>
                Patients This Month
              </Heading>
              <Text fontSize="2xl" fontWeight="bold">
                {summary.patientsThisMonth}
              </Text>
            </CardBody>
          </Card>
          <Card
            width={{ base: "full", sm: "45%" }}
            boxShadow="md"
            borderRadius="md"
          >
            <CardBody>
              <Heading size="sm" mb={2}>
                Patients Last Month
              </Heading>
              <Text fontSize="2xl" fontWeight="bold">
                {summary.patientsLastMonth}
              </Text>
            </CardBody>
          </Card>
          <Card
            width={{ base: "full", sm: "45%" }}
            boxShadow="md"
            borderRadius="md"
          >
            <CardBody>
              <Heading size="sm" mb={2}>
                Patients This Year
              </Heading>
              <Text fontSize="2xl" fontWeight="bold">
                {summary.patientsThisYear}
              </Text>
            </CardBody>
          </Card>
        </Flex>
      )}
    </Box>
  );
};

export default PatientSummary;
