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
  Heading,
  Text,
  IconButton,
  Spinner,
  ModalFooter,
  Card,
  CardBody,
  CardHeader,
  Divider,
} from "@chakra-ui/react";
import { FaMinus, FaPlus } from "react-icons/fa";

const DoctorDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [tests, setTests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const [previousVisits, setPreviousVisits] = useState([]);
  const [showAllRecordsModal, setShowAllRecordsModal] = useState(false);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [status, setStatus] = useState(false);

  useEffect(() => {
    const fetchVisits = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient/todays-patients"
        );
        setVisits(
          response.data.visits.filter((visit) => visit.status !== "complete")
        );
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
  }, [toast, status]);

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
        editMedicines?.map((m) => ({
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

      // Close the modal
      onClose();

      setEditingVisit(null);
      setPreviousVisits([]);
      setShowAllRecordsModal(false);
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

      // Close the modal
      onClose();

      setEditingVisit(null);
      setPreviousVisits([]);
      setShowAllRecordsModal(false);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
      setStatus(true);
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
    setPreviousVisits([]);
    setShowAllRecordsModal(false);
    onClose();
  };

  const fetchPreviousVisits = async () => {
    if (!editingVisit) return;
    setIsLoadingPrevious(true);
    try {
      const response = await axios.get(
        `http://localhost:3000/api/v1/visit/all-visits/${editingVisit.patient._id}`
      );
      setPreviousVisits(response.data.visits);
      setShowAllRecordsModal(true);
    } catch (error) {
      toast({
        title: "Error fetching previous visits.",
        description: error.response.data.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoadingPrevious(false);
    }
  };

  const inputFieldStyle = {
    height: "30px",
    borderWidth: "1px",
    boxShadow: "0 0 0 1px #3182ce",
    borderColor: "blue.300",
    outline: "none",
    borderRadius: "3px",
  };

  return (
    <div>
      <Box w="95%" pt={5} mx="auto">
        <Box align="center">
          <Heading
            fontWeight="semibold"
            color="gray.600"
            borderBottom="2px"
            pb="3px"
            width="fit-content"
            fontSize="2xl"
            mb={3}
          >
            Today's Appointments
          </Heading>
        </Box>
        {visits.length > 0 ? (
          <Table variant="simple" colorScheme="blue" size="md">
            <Thead bgColor="green.200">
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
        ) : (
          <Box
            textAlign="center"
            py={10}
            px={6}
            bg="gray.100"
            borderRadius="md"
          >
            <Text fontSize="lg">No appointments for today.</Text>
          </Box>
        )}
      </Box>
      {/* Prescription Modal */}
      <Modal isOpen={isOpen} onClose={handleCancel} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Prescription for {editingVisit?.patient.patientName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack spacing={4}>
              <FormControl>
                <FormLabel htmlFor="prescription">Prescription</FormLabel>
                <Textarea
                  id="prescription"
                  value={prescription}
                  onChange={(e) => setPrescription(e.target.value)}
                  style={inputFieldStyle}
                />
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="tests">Tests</FormLabel>
                {tests.map((test, index) => (
                  <Flex key={index} align="center">
                    <Input
                      value={test}
                      onChange={(e) => handleTestChange(index, e.target.value)}
                      placeholder={`Test ${index + 1}`}
                      style={inputFieldStyle}
                    />
                    <IconButton
                      ml={2}
                      icon={<FaMinus />}
                      aria-label="Remove Test"
                      onClick={() => handleRemoveTest(index)}
                    />
                    <IconButton
                      ml={2}
                      icon={<FaPlus />}
                      aria-label="Add Test"
                      onClick={handleAddTest}
                    />
                  </Flex>
                ))}
              </FormControl>
              <FormControl>
                <FormLabel htmlFor="medicines">Medicines</FormLabel>
                {medicines.map((medicine, index) => (
                  <Stack key={index} spacing={3}>
                    <FormControl>
                      <FormLabel htmlFor={`medicineName-${index}`}>
                        Medicine Name
                      </FormLabel>
                      <Input
                        id={`medicineName-${index}`}
                        value={medicine.name}
                        onChange={(e) =>
                          handleMedicineChange(index, "name", e.target.value)
                        }
                        placeholder="Medicine Name"
                        style={inputFieldStyle}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor={`dosage-${index}`}>Dosage</FormLabel>
                      <Input
                        id={`dosage-${index}`}
                        value={medicine.dosage}
                        onChange={(e) =>
                          handleMedicineChange(index, "dosage", e.target.value)
                        }
                        placeholder="Dosage"
                        style={inputFieldStyle}
                      />
                    </FormControl>
                    <FormControl>
                      <FormLabel htmlFor={`duration-${index}`}>
                        Duration
                      </FormLabel>
                      <Input
                        id={`duration-${index}`}
                        value={medicine.duration}
                        onChange={(e) =>
                          handleMedicineChange(
                            index,
                            "duration",
                            e.target.value
                          )
                        }
                        placeholder="Duration"
                        style={inputFieldStyle}
                      />
                    </FormControl>
                    <IconButton
                      ml={2}
                      icon={<FaMinus />}
                      aria-label="Remove Medicine"
                      onClick={() => handleRemoveMedicine(index)}
                    />
                    <IconButton
                      ml={2}
                      icon={<FaPlus />}
                      aria-label="Add Medicine"
                      onClick={handleAddMedicine}
                    />
                  </Stack>
                ))}
              </FormControl>
              <Button colorScheme="blue" onClick={fetchPreviousVisits}>
                View All Previous Records
              </Button>
            </Stack>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" onClick={handlePending}>
              Save & Mark as Pending
            </Button>
            <Button colorScheme="green" onClick={handleComplete} ml={3}>
              Save & Mark as Complete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Previous Records Modal */}
      <Modal
        isOpen={showAllRecordsModal}
        onClose={() => setShowAllRecordsModal(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>All Previous Records</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isLoadingPrevious ? (
              <Flex justify="center" align="center" height="300px">
                <Spinner size="xl" />
              </Flex>
            ) : previousVisits.length > 0 ? (
              previousVisits.map((visit) => (
                <Card key={visit._id} mb={4}>
                  <CardHeader>
                    <Heading size="md">
                      Visit on {new Date(visit.date).toLocaleDateString()}
                    </Heading>
                  </CardHeader>
                  <CardBody>
                    <Text>
                      <strong>Patient Name:</strong> {visit.patient.patientName}
                    </Text>
                    <Text>
                      <strong>Prescription:</strong> {visit.prescription}
                    </Text>
                    <Text>
                      <strong>Tests:</strong> {visit.tests.join(", ")}
                    </Text>
                    <Text>
                      <strong>Medicines:</strong>{" "}
                      {visit.medicines
                        .map((m) => `${m.name} (${m.dosage}, ${m.duration})`)
                        .join(", ")}
                    </Text>
                    <Text>
                      <strong>Status:</strong> {visit.status}
                    </Text>
                  </CardBody>
                  <Divider />
                </Card>
              ))
            ) : (
              <Box
                textAlign="center"
                py={10}
                px={6}
                bg="gray.100"
                borderRadius="md"
              >
                <Text fontSize="lg">No previous records found.</Text>
              </Box>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => setShowAllRecordsModal(false)}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
