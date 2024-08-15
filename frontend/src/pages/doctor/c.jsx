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
import { FaBell, FaMinus, FaPlus } from "react-icons/fa";
import io from "socket.io-client";

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
      console.log("coneecccccted");
    });

    socket.emit("notify-waiting-room", visit);
    console.log("coneeccccctedsdfdsfds");
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
            Today Appointments
          </Heading>
        </Box>
        {visits.length > 0 ? (
          <Table variant="simple" colorScheme="blue" size="md">
            <Thead bgColor="green.200">
              <Tr>
                <Th>Patient Name</Th>
                <Th>Status</Th>
                <Th>Tests</Th>
                <Th>Prescribe</Th>
                <Th>Notify</Th>
              </Tr>
            </Thead>
            <Tbody>
              {visits.map((visit) => (
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
            overflowY="auto"
            height="calc(100vh - 80px)"
          >
            <FormControl mb={4}>
              <FormLabel fontSize="sm" htmlFor="prescription">
                Prescription Details
              </FormLabel>
              <Textarea
                id="prescription"
                placeholder="Enter prescription"
                value={prescription}
                height="60px"
                resize="vertical"
                onChange={(e) => setPrescription(e.target.value)} // Added onChange handler
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize="sm" htmlFor="medicines">
                Medicines
              </FormLabel>
              {medicines.map((medicine, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap="5px"
                  alignItems="center"
                  mb={2}
                >
                  <FormControl>
                    <Input
                      id={`medicine-name-${index}`}
                      value={medicine.name}
                      onChange={(e) =>
                        handleMedicineChange(index, "name", e.target.value)
                      }
                      placeholder="Medicine Name"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      id={`medicine-dosage-${index}`}
                      value={medicine.dosage}
                      onChange={(e) =>
                        handleMedicineChange(index, "dosage", e.target.value)
                      }
                      placeholder="Dosage"
                    />
                  </FormControl>
                  <FormControl>
                    <Input
                      id={`medicine-duration-${index}`}
                      value={medicine.duration}
                      onChange={(e) =>
                        handleMedicineChange(index, "duration", e.target.value)
                      }
                      placeholder="Duration"
                    />
                  </FormControl>
                  <IconButton
                    icon={<FaMinus />}
                    colorScheme="red"
                    height="30px"
                    ml={2}
                    onClick={() => handleRemoveMedicine(index)}
                    aria-label="Remove medicine"
                  />
                </Box>
              ))}
              <Button colorScheme="blue" onClick={handleAddMedicine} size="sm">
                Add Medicine
              </Button>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel fontSize="sm" htmlFor="tests">
                Tests
              </FormLabel>
              {tests.map((test, index) => (
                <Box
                  key={index}
                  display="flex"
                  gap="5px"
                  alignItems="center"
                  mb={2}
                >
                  <Input
                    id={`test-${index}`}
                    value={test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    placeholder="Test Name"
                  />
                  <IconButton
                    icon={<FaMinus />}
                    colorScheme="red"
                    height="30px"
                    ml={2}
                    onClick={() => handleRemoveTest(index)}
                    aria-label="Remove test"
                  />
                </Box>
              ))}
              <Button colorScheme="blue" onClick={handleAddTest} size="sm">
                Add Test
              </Button>
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Flex justify="space-between" width="100%">
              <Button
                colorScheme="blue"
                onClick={() => handleSaveVisit("complete")}
              >
                Save & Complete
              </Button>
              <Button
                colorScheme="yellow"
                onClick={() => handleSaveVisit("pending")}
              >
                Save & Pending
              </Button>
              <Button colorScheme="red" onClick={handleCancel}>
                Cancel
              </Button>
            </Flex>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
