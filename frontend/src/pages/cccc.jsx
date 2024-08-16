import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Box,
  Heading,
  useToast,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  FormControl,
  FormLabel,
  Textarea,
  Input,
  IconButton,
  Flex,
} from "@chakra-ui/react";
import { FaBell, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import io from "socket.io-client";

const DoctorDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [tests, setTests] = useState([]);
  const [medicines, setMedicines] = useState([]);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loadingDelete, setLoadingDelete] = useState(null); // Track which delete operation is in progress

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
  }, [toast]);

  useEffect(() => {
    const socket = io("http://localhost:3000");
    socket.on("notify-waiting-room", (visit) => {
      toast({
        title: "Patient notified.",
        description: `${visit.patient.patientName} is now the current patient.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });

    return () => {
      socket.disconnect();
    };
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
      setMedicines(editMedicines || []);
    }
  }, [editingVisit]);

  const handlePrescribeClick = (visit) => {
    setEditingVisit(visit);
    onOpen();
  };

  const handleNotify = (visit) => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("connected");
    });

    socket.emit("notify-waiting-room", visit);
    console.log("Notification sent");
  };

  const handleAddTest = () => setTests([...tests, ""]);
  const handleRemoveTest = (index) =>
    setTests(tests.filter((_, i) => i !== index));
  const handleTestChange = (index, value) =>
    setTests(tests.map((test, i) => (i === index ? value : test)));

  const handleAddMedicine = () =>
    setMedicines([...medicines, { name: "", dosage: "", duration: "" }]);
  const handleRemoveMedicine = (index) =>
    setMedicines(medicines.filter((_, i) => i !== index));
  const handleMedicineChange = (index, field, value) =>
    setMedicines(
      medicines.map((medicine, i) =>
        i === index ? { ...medicine, [field]: value } : medicine
      )
    );

  const handleSaveVisit = async (status) => {
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
          status,
        }
      );

      toast({
        title: `Visit ${status}.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      onClose();
      setEditingVisit(null);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
    } catch (error) {
      toast({
        title: `Error updating visit.`,
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

  const handleDeleteVisit = async (visit) => {
    setLoadingDelete(visit._id); // Start loading state for this delete operation

    const updatedVisits = visits.filter((v) => v._id !== visit._id);
    setVisits(updatedVisits);
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
            mb={6}
          >
            Today Appointments
          </Heading>
        </Box>
        {visits.length > 0 ? (
          <Table
            variant="simple"
            colorScheme="blue"
            size="md"
            width="95%"
            mx="auto"
          >
            <Thead bgColor="green.200">
              <Tr>
                <Th>Patient Name</Th>
                <Th>Status</Th>
                <Th>Prescribe</Th>
                <Th>Notify</Th>
                <Th>Delete</Th>
              </Tr>
            </Thead>
            <Tbody>
              {visits.map((visit) => (
                <Tr key={visit._id}>
                  <Td>{visit.patient.patientName}</Td>
                  <Td>{visit.status}</Td>

                  <Td>
                    <Button
                      colorScheme="blue"
                      onClick={() => handlePrescribeClick(visit)}
                    >
                      Prescribe
                    </Button>
                  </Td>
                  <Td>
                    <Button
                      leftIcon={<FaBell />}
                      colorScheme="yellow"
                      onClick={() => handleNotify(visit)}
                      aria-label="Notify"
                    >
                      Notify
                    </Button>
                  </Td>
                  <Td>
                    <IconButton
                      colorScheme="red"
                      icon={<FaTrash />}
                      aria-label="Delete"
                      isDisabled={visit.status !== "complete"}
                      isLoading={loadingDelete === visit._id}
                      onClick={() => handleDeleteVisit(visit)}
                    />
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        ) : (
          <Box
            h="100vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
          >
            <Heading
              p={4}
              bgGradient="linear(to-r , red.300 , red.400)"
              width="fit-content"
              size="md"
            >
              No Appointment for day
            </Heading>
          </Box>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={handleCancel} closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent
          width="70%"
          maxWidth="none"
          height="100vh"
          maxHeight="100vh"
          margin="0"
          padding="0"
        >
          <Text fontSize="lg" p={4}>
            Prescribe for {editingVisit?.patient?.patientName}
          </Text>
          <ModalCloseButton />
          <ModalBody
            padding="4"
            display="flex"
            flexDirection="column"
            alignItems="center"
          >
            <FormControl mb={4}>
              <FormLabel>Prescription</FormLabel>
              <Textarea
                value={prescription}
                onChange={(e) => setPrescription(e.target.value)}
                placeholder="Enter prescription"
                minHeight="150px"
              />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Tests</FormLabel>
              {tests.map((test, index) => (
                <Flex key={index} alignItems="center" mb={2}>
                  <Input
                    placeholder={`Test ${index + 1}`}
                    value={test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    mr={2}
                  />
                  <IconButton
                    icon={<FaMinus />}
                    aria-label="Remove Test"
                    onClick={() => handleRemoveTest(index)}
                  />
                </Flex>
              ))}
              <Button onClick={handleAddTest}>Add Test</Button>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Medicines</FormLabel>
              {medicines.map((medicine, index) => (
                <Flex key={index} alignItems="center" mb={2}>
                  <Input
                    placeholder="Medicine Name"
                    value={medicine.name}
                    onChange={(e) =>
                      handleMedicineChange(index, "name", e.target.value)
                    }
                    mr={2}
                  />
                  <Input
                    placeholder="Dosage"
                    value={medicine.dosage}
                    onChange={(e) =>
                      handleMedicineChange(index, "dosage", e.target.value)
                    }
                    mr={2}
                  />
                  <Input
                    placeholder="Duration"
                    value={medicine.duration}
                    onChange={(e) =>
                      handleMedicineChange(index, "duration", e.target.value)
                    }
                    mr={2}
                  />
                  <IconButton
                    icon={<FaMinus />}
                    aria-label="Remove Medicine"
                    onClick={() => handleRemoveMedicine(index)}
                  />
                </Flex>
              ))}
              <Button onClick={handleAddMedicine}>Add Medicine</Button>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => handleSaveVisit("pending")}
            >
              Save and Pending
            </Button>
            <Button
              colorScheme="green"
              onClick={() => handleSaveVisit("complete")}
              ml={3}
            >
              Save and Complete
            </Button>
            <Button colorScheme="red" onClick={handleCancel} ml={3}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
