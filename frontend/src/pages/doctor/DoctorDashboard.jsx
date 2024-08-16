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
  List,
  ListItem,
  HStack,
  Spinner,
  Card,
  CardHeader,
  CardBody,
  Divider,
} from "@chakra-ui/react";
import { FaBell, FaMinus, FaPlus, FaTrash } from "react-icons/fa";
import io from "socket.io-client";
const availableMedicines = [
  "Aspirin",
  "Paracetamol",
  "Ibuprofen",
  "Amoxicillin",
  "Azithromycin",
  "Metformin",
  "Lisinopril",
  "Atorvastatin",
  "Losartan",
  "Hydrochlorothiazide",
  "Omeprazole",
  "Simvastatin",
  "Gabapentin",
  "Cetirizine",
  "Diphenhydramine",
  "Loratadine",
  "Ranitidine",
  "Naproxen",
  "Tramadol",
  "Hydrocodone",
  "Codeine",
  "Clopidogrel",
  "Warfarin",
  "Furosemide",
  "Hydrochlorothiazide",
  "Prednisone",
  "Dexamethasone",
  "Methylprednisolone",
  "Albuterol",
  "Fluticasone",
  "Budesonide",
  "Salbutamol",
  "Levofloxacin",
  "Doxycycline",
  "Ciprofloxacin",
  "Metronidazole",
  "Clarithromycin",
  "Lorazepam",
  "Diazepam",
  "Clonazepam",
  "Temazepam",
  "Sertraline",
  "Fluoxetine",
  "Citalopram",
  "Escitalopram",
  "Venlafaxine",
  "Duloxetine",
  "Bupropion",
  "Trazodone",
  "Mirtazapine",
  "Atenolol",
  "Metoprolol",
  "Propranolol",
  "Carvedilol",
  "Bisoprolol",
  "Enalapril",
  "Ramipril",
  "Perindopril",
  "Ezetimibe",
  "Niacin",
  "Fenofibrate",
  "Lovastatin",
  "Rosuvastatin",
  "Nifedipine",
  "Amlodipine",
  "Verapamil",
  "Diltiazem",
  "Sildenafil",
  "Tadalafil",
  "Vardenafil",
  "Lorazepam",
  "Buspirone",
  "Hydroxyzine",
  "Pregabalin",
  "Ropinirole",
  "Pramipexole",
  "Latanoprost",
  "Timolol",
  "Brimonidine",
  "Travoprost",
  "Bimatoprost",
  "Diphenhydramine",
  "Hydroxyzine",
  "Fexofenadine",
  "Chlorpheniramine",
  "Desloratadine",
  "Mometasone",
  "Beclometasone",
  "Flunisolide",
  "Rivastigmine",
  "Donepezil",
  "Galantamine",
  "Memantine",
  "Sumatriptan",
  "Rizatriptan",
];
const socket = io("http://localhost:3000");

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
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [currentMedicineInput, setCurrentMedicineInput] = useState("");
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [showAllRecordsModal, setShowAllRecordsModal] = useState(false);
  const [previousVisits, setPreviousVisits] = useState([]);
  const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);

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
    // Setup socket listeners
    socket.on("notify-waiting-room", (visit) => {
      toast({
        title: "Patient notified.",
        description: `${visit.patient.patientName} is now the current patient.`,
        status: "success",
        duration: 3000,
        isClosable: true,
      });
    });

    // Clean up socket listeners on component unmount
    return () => {
      socket.off("notify-waiting-room");
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
    if (socket.connected) {
      socket.emit("notify-waiting-room", visit, () => {
        console.log("Notification sent");

        // Optionally disconnect after sending the notification
        socket.disconnect();
      });
    } else {
      console.error("Socket is not connected");
    }
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
    setCurrentMedicineInput(value);
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
      setVisits(
        response.data.visits.filter((visit) => visit.status !== "complete")
      );
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
      setVisits(
        response.data.visits.filter((visit) => visit.status !== "complete")
      );
      setStatus(!status);
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
  const handleMedicineInput = (value) => {
    setCurrentMedicineInput(value);
    setSelectedSuggestionIndex(-1); // Reset the selected suggestion index

    if (value) {
      const filteredMedicines = availableMedicines.filter((medicine) =>
        medicine.toLowerCase().startsWith(value.toLowerCase())
      );
      setMedicineSuggestions(filteredMedicines);
    } else {
      setMedicineSuggestions([]);
    }
  };
  const handleKeyDown = (e) => {
    if (medicineSuggestions.length > 0) {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex < medicineSuggestions.length - 1 ? prevIndex + 1 : 0
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedSuggestionIndex((prevIndex) =>
          prevIndex > 0 ? prevIndex - 1 : medicineSuggestions.length - 1
        );
      } else if (e.key === "Enter" && selectedSuggestionIndex >= 0) {
        e.preventDefault();
        const selectedMedicine = medicineSuggestions[selectedSuggestionIndex];
        setCurrentMedicineInput(selectedMedicine);
        setMedicineSuggestions([]); // Clear the suggestions
      }
    }
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
            h="90vh"
            display="flex"
            justifyContent="center"
            alignItems="center"
            flexDir="column"
          >
            <Heading
              borderRadius="7px"
              color="gray.700"
              p={4}
              fontWeight="semibold"
              bgGradient="linear(to-r , red.300 , red.400)"
              width="fit-content"
              size="md"
            >
              No Appointment is avaiable
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
          <HStack
            mt={4}
            width="90%"
            align="center"
            justifyContent="space-between"
          >
            <Text fontSize="lg" p={4}>
              Prescribe for {editingVisit?.patient?.patientName}
            </Text>
            <Button
              colorScheme="blue"
              variant="outline"
              onClick={fetchPreviousVisits}
            >
              View Previous Records
            </Button>
          </HStack>
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
                onChange={(e) => setPrescription(e.target.value)}
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
                  position="relative"
                >
                  <FormControl>
                    <Input
                      id={`medicine-name-${index}`}
                      value={medicine.name}
                      onChange={(e) => {
                        handleMedicineInput(e.target.value);
                        handleMedicineChange(index, "name", e.target.value);
                      }}
                      onKeyDown={handleKeyDown}
                      placeholder="Medicine Name"
                      {...inputFieldStyle}
                    />
                    {medicineSuggestions.length > 0 && (
                      <List
                        borderWidth="1px"
                        borderRadius="sm"
                        mt={1}
                        maxHeight="150px"
                        overflowY="auto"
                        position="absolute"
                        backgroundColor="white"
                        width="100%"
                        zIndex="1"
                        borderColor="gray.200"
                      >
                        {medicineSuggestions.map((suggestion, i) => (
                          <ListItem
                            key={i}
                            padding="2"
                            onClick={() => {
                              handleMedicineChange(index, "name", suggestion);
                              setMedicineSuggestions([]); // Clear the suggestions
                            }}
                            bg={
                              i === selectedSuggestionIndex
                                ? "blue.100"
                                : "white"
                            }
                            _hover={{
                              backgroundColor: "gray.100",
                              cursor: "pointer",
                            }}
                          >
                            {suggestion}
                          </ListItem>
                        ))}
                      </List>
                    )}
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

      {/* below is the modal for the previou record */}
      <Modal
        isOpen={showAllRecordsModal}
        onClose={() => setShowAllRecordsModal(false)}
        size="lg"
      >
        <ModalOverlay />
        <ModalContent
          width="60%"
          maxWidth="none"
          height="100vh"
          maxHeight="100vh"
          margin="0"
          padding="0"
        >
          <ModalHeader>
            All Previous Records of {previousVisits?.[0]?.patient?.patientName}
          </ModalHeader>
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
