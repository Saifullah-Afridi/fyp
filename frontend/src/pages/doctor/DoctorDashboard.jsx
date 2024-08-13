import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Input,
  Textarea,
  useToast,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Stack,
  FormControl,
  FormLabel,
  Flex,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";

const DoctorDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [tests, setTests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient/todays-patients"
        );
        setVisits(response.data.visits);
      } catch (error) {
        toast({
          title: "Error fetching visits.",
          description: error.message,
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    };
    fetchVisits();
  }, [toast]);

  useEffect(() => {
    if (editingVisit) {
      const {
        prescription: editPrescription,
        tests: editTests,
        medicines: editMedicines,
      } = editingVisit;

      setPrescription(editPrescription || "");
      setTests(editTests || []);
      setMedicines(
        editMedicines.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          duration: m.duration,
        })) || []
      );
    }
  }, [editingVisit]);

  const handlePrescribeClick = (visit) => {
    setEditingVisit(visit);
    onOpen();
  };

  const handleAddTest = () => {
    setTests([...tests, ""]);
  };

  const handleRemoveTest = (index) => {
    setTests(tests.filter((_, i) => i !== index));
  };

  const handleTestChange = (index, value) => {
    setTests(tests.map((test, i) => (i === index ? value : test)));
  };

  const handleAddMedicine = () => {
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  };

  const handleRemoveMedicine = (index) => {
    setMedicines(medicines.filter((_, i) => i !== index));
  };

  const handleMedicineChange = (index, field, value) => {
    setMedicines(
      medicines.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine
      )
    );
  };

  const handlePending = async () => {
    if (!editingVisit) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-visit/${editingVisit._id}`,
        {
          prescription,
          tests,
          medicines,
        }
      );
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-status/${editingVisit._id}`,
        {
          status: "pending",
        }
      );

      toast({
        title: "Visit status updated to Pending.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setEditingVisit(null);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
    } catch (error) {
      toast({
        title: "Error updating visit status.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleComplete = async () => {
    if (!editingVisit) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-visit/${editingVisit._id}`,
        {
          prescription,
          tests,
          medicines,
        }
      );
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-status/${editingVisit._id}`,
        {
          status: "complete",
        }
      );

      toast({
        title: "Visit completed.",
        description: "The visit has been marked as complete.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setEditingVisit(null);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
    } catch (error) {
      toast({
        title: "Error completing visit.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  const handleCancel = () => {
    setEditingVisit(null);
    setPrescription("");
    setTests([]);
    setMedicines([]);
    onClose();
  };

  return (
    <div>
      <h1>Today's Patients</h1>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>Patient Name</Th>
            <Th>Status</Th>
            <Th>Tests</Th>
            <Th>Actions</Th>
          </Tr>
        </Thead>
        <Tbody>
          {visits?.map((visit) => (
            <Tr key={visit._id}>
              <Td>{visit.patient.patientName}</Td>
              <Td>{visit.status}</Td>
              <Td>{visit.tests.join(", ")}</Td>
              <Td>
                <Button
                  colorScheme="blue"
                  onClick={() => handlePrescribeClick(visit)}
                >
                  Prescribe
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {/* Modal for editing visit */}
      <Modal isOpen={isOpen} onClose={handleCancel}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Prescribe for {editingVisit?.patient?.patientName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel htmlFor="prescription">Prescription Details</FormLabel>
              <Textarea
                id="prescription"
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription"
                borderColor="gray.300"
                borderRadius="md"
                height="150px"
                resize="vertical"
                focusBorderColor="blue.500"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="tests">Tests</FormLabel>
              {tests.map((test, index) => (
                <Flex key={index} align="center" mb={2}>
                  <Input
                    value={test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    placeholder={`Test ${index + 1}`}
                    borderColor="gray.300"
                    borderRadius="md"
                    mr={2}
                  />
                  <Button
                    onClick={() => handleRemoveTest(index)}
                    colorScheme="red"
                  >
                    Remove
                  </Button>
                </Flex>
              ))}
              <Button onClick={handleAddTest} colorScheme="teal">
                Add Test
              </Button>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel htmlFor="medicines">Medicines</FormLabel>
              {medicines.map((medicine, index) => (
                <Box
                  key={index}
                  mb={4}
                  borderWidth="1px"
                  borderRadius="md"
                  p={3}
                >
                  <FormControl mb={2}>
                    <FormLabel htmlFor={`medicine-name-${index}`}>
                      Name
                    </FormLabel>
                    <Input
                      id={`medicine-name-${index}`}
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      placeholder="Medicine Name"
                      borderColor="gray.300"
                      borderRadius="md"
                    />
                  </FormControl>
                  <FormControl mb={2}>
                    <FormLabel htmlFor={`medicine-dosage-${index}`}>
                      Dosage
                    </FormLabel>
                    <Input
                      id={`medicine-dosage-${index}`}
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      placeholder="Dosage"
                      borderColor="gray.300"
                      borderRadius="md"
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor={`medicine-duration-${index}`}>
                      Duration
                    </FormLabel>
                    <Input
                      id={`medicine-duration-${index}`}
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, "duration", e.target.value)
                      }
                      placeholder="Duration"
                      borderColor="gray.300"
                      borderRadius="md"
                    />
                  </FormControl>
                  <Button
                    onClick={() => handleRemoveMedicine(index)}
                    colorScheme="red"
                    mt={2}
                  >
                    Remove
                  </Button>
                </Box>
              ))}
              <Button onClick={handleAddMedicine} colorScheme="teal">
                Add Medicine
              </Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handlePending}>
              Save as Pending
            </Button>
            <Button colorScheme="green" mr={3} onClick={handleComplete}>
              Mark as Complete
            </Button>
            <Button onClick={handleCancel}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
