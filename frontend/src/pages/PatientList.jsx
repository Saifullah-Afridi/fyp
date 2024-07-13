import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Heading,
  Box,
} from "@chakra-ui/react";

const PatientList = ({ patients }) => {
  return (
    <Box>
      <Heading fontSize="24px" mb="20px">
        Patients in Pending
      </Heading>
      <Table variant="striped" colorScheme="teal">
        <Thead>
          <Tr>
            <Th>Serial Number</Th>
            <Th>Patient Name</Th>
            <Th>Time of Registration</Th>
            <Th>Patient ID</Th>
          </Tr>
        </Thead>
        <Tbody>
          {patients.map((patient, index) => (
            <Tr key={patient._id}>
              <Td>{index + 1}</Td>
              <Td>{patient.patientName}</Td>
              <Td>{new Date(patient.createdAt).toLocaleTimeString()}</Td>
              <Td>{patient._id}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default PatientList;
