import React, { useEffect, useState } from "react";
import { Button, Container, Heading, HStack, Text } from "@chakra-ui/react";
import { Outlet, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
const ReceptionistLayout = () => {
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    setEmployee(storedUser);
  }, [employee]);

  useEffect(() => {
    if (!employee) {
      navigate("/login");
    } else {
      const { occupation } = employee;
      if (occupation === "admin") {
        navigate("/admin");
      } else if (occupation === "doctor") {
        navigate("/doctor");
      }
    }
  }, [employee]);

  return (
    <Container maxW="90%">
      <Header />
      <Outlet />
    </Container>
  );
};

export default ReceptionistLayout;
