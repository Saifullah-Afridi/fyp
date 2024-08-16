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
  Heading,
  Text,
  IconButton,
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
  const [status, setStatus] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(null);
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
      setMedicines(
        editMedicines.map((m) => ({
          name: m.name,
          dosage: m.dosage,
          duration: m.duration,
        })) || []
      );
    }
  }, [editingVisit]);

  const handleNotify = (visit) => {
    const socket = io("http://localhost:3000");
    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("connected");
    });

    socket.emit("notify-waiting-room", visit);
    console.log("Notification sent");
  };
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
    onClose();
  };
  const inputFieldStyle = {
    height: "30px",
    borderWidth: "1px",
    boxShadow: "0 0 0 1px #3182ce",
    borderColor: "blue.300",
    outline: "none",
    borderRadius: "3px",
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
            mb={3}
          >
            {" "}
            Today Appoientments
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
                <Th>Remove</Th>
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
                    <Button
                      colorScheme="red"
                      leftIcon={<FaTrash />}
                      aria-label="Delete"
                      isDisabled={visit.status !== "complete"}
                      isLoading={loadingDelete === visit._id}
                      onClick={() => handleDeleteVisit(visit)}
                    >
                      Remove
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

      {/* Modal for editing visit */}

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
                {...inputFieldStyle}
                id="prescription"
                placeholder="Enter prescription"
                value={prescription}
                height="60px"
                resize="vertical"
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
                      {...inputFieldStyle}
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
                      {...inputFieldStyle}
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
                      {...inputFieldStyle}
                    />
                  </FormControl>
                  <IconButton
                    icon={<FaMinus />}
                    colorScheme="red"
                    height="30px"
                    ml={2}
                    onClick={() => handleRemoveMedicine(index)}
                  ></IconButton>
                </Box>
              ))}

              <Button
                leftIcon={<FaPlus />}
                onClick={handleAddMedicine}
                colorScheme="blue"
                size="sm"
              >
                Add Medicine
              </Button>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel fontSize="sm" htmlFor="tests">
                Tests
              </FormLabel>
              {tests.map((test, index) => (
                <Flex key={index} align="center" mb={2}>
                  <Input
                    value={test}
                    onChange={(e) => handleTestChange(index, e.target.value)}
                    placeholder={`Test ${index + 1}`}
                    {...inputFieldStyle}
                  />
                  <IconButton
                    height="30px"
                    ml={2}
                    icon={<FaMinus />}
                    onClick={() => handleRemoveTest(index)}
                    colorScheme="red"
                  ></IconButton>
                </Flex>
              ))}
              <Button
                leftIcon={<FaPlus />}
                onClick={handleAddTest}
                colorScheme="blue"
                px="30px"
                size="sm"
              >
                Add Test
              </Button>
            </FormControl>
            <Box display="flex" gap={3}>
              <Button
                flex={1}
                variant="outline"
                colorScheme="red"
                onClick={handleCancel}
              >
                Cancel
              </Button>
              <Button flex={1} colorScheme="blue" onClick={handlePending}>
                Save as Pending
              </Button>
              <Button flex={1} colorScheme="green" onClick={handleComplete}>
                Mark as Complete
              </Button>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default DoctorDashboard;
