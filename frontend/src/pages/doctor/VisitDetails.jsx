// src/components/VisitDetails.js
import React, { useState, useEffect } from "react";
import {
  Box,
  FormControl,
  FormLabel,
  Input,
  Button,
  Textarea,
  Select,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axios from "axios";
import { useParams } from "react-router-dom";

const VisitDetails = () => {
  const { id } = useParams();
  const [visit, setVisit] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [formData, setFormData] = useState({
    prescription: "",
    tests: "",
    medicines: "",
  });
  const toast = useToast();

  useEffect(() => {
    const fetchVisit = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/v1/visit/getSingleVisit/${id}`
        );
        setVisit(response.data.visit);
        setFormData({
          prescription: response.data.visit.prescription || "",
          tests: response.data.visit.tests.join(", ") || "",
          medicines:
            response.data.visit.medicines
              .map((m) => `${m.name} (${m.dosage}, ${m.days} days)`)
              .join(", ") || "",
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchVisit();
  }, [id]);

  const handleSubmit = async () => {
    try {
      await axios.patch(`/api/visits/update-visit/${id}`, formData);
      toast({
        title: "Visit updated.",
        description: "The visit record has been successfully updated.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) return <Spinner size="xl" />;
  if (error) return <Box color="red.500">{error}</Box>;

  return (
    <Box p={4} mt="50px">
      <h1>LOl</h1>
      <FormControl mb={4}>
        <FormLabel>Prescription</FormLabel>
        <Textarea
          value={formData.prescription}
          onChange={(e) =>
            setFormData({ ...formData, prescription: e.target.value })
          }
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Tests</FormLabel>
        <Input
          value={formData.tests}
          onChange={(e) => setFormData({ ...formData, tests: e.target.value })}
        />
      </FormControl>
      <FormControl mb={4}>
        <FormLabel>Medicines</FormLabel>
        <Input
          value={formData.medicines}
          onChange={(e) =>
            setFormData({ ...formData, medicines: e.target.value })
          }
        />
      </FormControl>
      <Button onClick={handleSubmit} colorScheme="blue">
        Update Visit
      </Button>
    </Box>
  );
};

export default VisitDetails;
