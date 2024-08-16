import React from "react";
import ReactDOM from "react-dom";
import {
  Box,
  Button,
  Flex,
  Spinner,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Text,
} from "@chakra-ui/react";

const PreviousVisitsDisplay = ({
  isLoadingPrevious,
  previousVisits,
  onClose,
}) => {
  return ReactDOM.createPortal(
    <Box
      position="fixed"
      top="0"
      left="0"
      right="0"
      bottom="0"
      bg="white"
      boxShadow="md"
      p="4"
      zIndex="1600" // Ensure this is high
      maxH="90vh"
      overflowY="auto"
    >
      <Flex justify="space-between" align="center" mb="4">
        <Text fontSize="lg" fontWeight="bold">
          Previous Visits
        </Text>
        <Button colorScheme="blue" onClick={onClose}>
          Close
        </Button>
      </Flex>
      {isLoadingPrevious ? (
        <Flex justify="center" align="center" h="100%">
          <Spinner />
        </Flex>
      ) : (
        <Box>
          {previousVisits.length > 0 ? (
            <Table variant="simple" colorScheme="blue">
              <Thead bgColor="blue.200">
                <Tr>
                  <Th>Date</Th>
                  <Th>Prescription</Th>
                  <Th>Tests</Th>
                  <Th>Medicines</Th>
                </Tr>
              </Thead>
              <Tbody>
                {previousVisits.map((visit) => (
                  <Tr key={visit._id}>
                    <Td>{new Date(visit.createdAt).toLocaleDateString()}</Td>
                    <Td>{visit.prescription}</Td>
                    <Td>{visit.tests.join(", ")}</Td>
                    <Td>
                      {visit.medicines.map((med, i) => (
                        <Text key={i}>
                          {med.name} ({med.dosage}, {med.duration})
                        </Text>
                      ))}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          ) : (
            <Text>No previous visits found.</Text>
          )}
        </Box>
      )}
    </Box>,
    document.body
  );
};

export default PreviousVisitsDisplay;
