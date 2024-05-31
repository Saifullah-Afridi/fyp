import { Container, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import axios from "axios";

const DoctorPage = () => {
  const [patientData, setPatientData] = useState([]);
  useEffect(() => {
    axios
      .get("http://localhost:3000/api/v1/patient")
      .then((res) => {
        setPatientData(res.data);
        console.log(res.data.patients);
      })
      .catch((err) => console.log(err.message));
  }, []);
  return (
    <Container py={6} maxWidth="90%">
      <Text>Doctor page</Text>
    </Container>
  );
};

export default DoctorPage;
