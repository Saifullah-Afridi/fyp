import { Container } from "@chakra-ui/react";
import React, { useEffect } from "react";
import axios from "axios";

const DoctorPage = () => {
  useEffect(() => {
    axios
      .get("http://locahost:3000/patient")
      .then((res) => res.data)
      .catch((err) => console.log(err.message));
  }, []);
  return <Container py={6} maxWidth="90%"></Container>;
};

export default DoctorPage;
