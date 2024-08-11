import React, { useState } from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Button,
  Stack,
  IconButton,
  List,
  ListItem,
  Box,
  Flex,
} from "@chakra-ui/react";
import { Field, Form, Formik, FieldArray } from "formik";
import * as Yup from "yup";
import { FaPlus, FaMinus } from "react-icons/fa";
import { toast } from "react-toastify";
import axios from "axios";

const availableMedicines = ["Aspirin", "Paracetamol", "Ibuprofen"]; // Example medicine list

const PrescriptionModal = ({ isOpen, onClose, patient }) => {
  const [medicineSuggestions, setMedicineSuggestions] = useState([]);
  const [currentMedicineInput, setCurrentMedicineInput] = useState("");

  const initialValues = {
    prescription: "",
    medicines: [{ medicineName: "", dosage: "", duration: "" }],
    tests: [""],
  };

  const validationSchema = Yup.object({
    prescription: Yup.string().required("Prescription is required"),
    medicines: Yup.array().of(
      Yup.object({
        medicineName: Yup.string().required("Medicine name is required"),
        dosage: Yup.string().required("Dosage is required"),
        duration: Yup.string().required("Duration is required"),
      })
    ),
    tests: Yup.array().of(Yup.string().required("Test is required")),
  });

  const handleSubmit = async (values) => {
    try {
      const res = await axios.patch(
        `http://localhost:3000/api/v1/visit/update-visit/${patient._id}`,
        values
      );
      if (res) {
        toast.success("Prescription updated successfully");
      }
    } catch (error) {
      console.log(error);
      toast.error(error);

      // toast.error(error.response.data.message);
    }
    // Implement submit logic here
  };

  const handleMedicineChange = (value, index, formik) => {
    formik.setFieldValue(`medicines.${index}.medicineName`, value);
    setCurrentMedicineInput(value); // Update the input state
  };

  const handleMedicineInput = (value) => {
    setCurrentMedicineInput(value);
    if (value) {
      const filteredMedicines = availableMedicines.filter((medicine) =>
        medicine.toLowerCase().startsWith(value.toLowerCase())
      );
      setMedicineSuggestions(filteredMedicines);
    } else {
      setMedicineSuggestions([]);
    }
  };

  const getInputStyles = (formik, fieldName) => {
    const isFilled = formik.values[fieldName]?.trim().length > 0;
    const isError = formik.errors[fieldName] && formik.touched[fieldName];
    const errorBorderColor = "red.500"; // Red border color for errors
    const borderColor = "gray.300"; // Default border color
    const filledBackgroundColor = "gray.100"; // Background color when input is filled

    return {
      borderColor: isError ? errorBorderColor : borderColor,
      backgroundColor: isError
        ? "red.50" // Light red background for errors
        : isFilled
        ? filledBackgroundColor // Light gray background when input is filled
        : "white", // Default background color
      boxShadow: isError ? undefined : "0 0 0 1px #3182ce", // Blue shadow if not an error
      outline: "none", // Ensure outline is removed
      borderWidth: "1px", // Explicit border width to ensure it appears correctly
    };
  };
  // console.log(patient);

  console.log(patient);

  return (
    <>
      {patient && (
        <Modal isOpen={isOpen} onClose={onClose} size="full">
          <ModalOverlay />
          <ModalContent
            width="70%"
            maxWidth="none"
            height="100vh"
            maxHeight="100vh"
            margin="0"
            padding="0"
          >
            <ModalHeader fontSize="lg">
              Prescription for {patient.patient.patientName}
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody
              padding="4"
              display="flex"
              flexDirection="column"
              overflowY="auto"
              height="calc(100vh - 80px)"
            >
              <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}
              >
                {(formik) => (
                  <Form
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      flex: 1,
                    }}
                  >
                    <FormControl
                      mb={4}
                      isInvalid={
                        formik.errors.prescription &&
                        formik.touched.prescription
                      }
                    >
                      <FormLabel htmlFor="prescription" fontSize="sm">
                        Prescription Details
                      </FormLabel>
                      <Field
                        as={Textarea}
                        id="prescription"
                        name="prescription"
                        size="sm"
                        height="50px"
                        resize="vertical"
                        style={getInputStyles(formik, "prescription")}
                      />
                    </FormControl>
                    <FieldArray name="medicines">
                      {({ remove, push }) => (
                        <Box mb={3}>
                          <FormLabel fontSize="sm">Medicines</FormLabel>
                          {formik.values.medicines.map((medicine, index) => (
                            <Box key={index} mb={2} position="relative">
                              <Stack direction="row" spacing={2} align="center">
                                <Box flex="1" position="relative">
                                  <FormControl
                                    isInvalid={
                                      formik.errors.medicines?.[index]
                                        ?.medicineName &&
                                      formik.touched.medicines?.[index]
                                        ?.medicineName
                                    }
                                  >
                                    <Input
                                      width="250px"
                                      borderRadius="5px"
                                      height="35px"
                                      value={medicine.medicineName}
                                      onChange={(e) => {
                                        handleMedicineInput(e.target.value);
                                        handleMedicineChange(
                                          e.target.value,
                                          index,
                                          formik
                                        );
                                      }}
                                      placeholder="Enter Medicine Name"
                                      style={getInputStyles(
                                        formik,
                                        `medicines.${index}.medicineName`
                                      )}
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
                                      >
                                        {medicineSuggestions.map(
                                          (suggestion, i) => (
                                            <ListItem
                                              key={i}
                                              padding="2"
                                              onClick={() => {
                                                handleMedicineChange(
                                                  suggestion,
                                                  index,
                                                  formik
                                                );
                                                setMedicineSuggestions([]);
                                              }}
                                              _hover={{
                                                backgroundColor: "gray.100",
                                              }}
                                            >
                                              {suggestion}
                                            </ListItem>
                                          )
                                        )}
                                      </List>
                                    )}
                                  </FormControl>
                                </Box>
                                <FormControl
                                  isInvalid={
                                    formik.errors.medicines?.[index]?.dosage &&
                                    formik.touched.medicines?.[index]?.dosage
                                  }
                                >
                                  <Field
                                    as={Input}
                                    name={`medicines.${index}.dosage`}
                                    placeholder="Dosage"
                                    size="sm"
                                    height="35px"
                                    style={getInputStyles(
                                      formik,
                                      `medicines.${index}.dosage`
                                    )}
                                  />
                                </FormControl>
                                <FormControl
                                  isInvalid={
                                    formik.errors.medicines?.[index]
                                      ?.duration &&
                                    formik.touched.medicines?.[index]?.duration
                                  }
                                >
                                  <Field
                                    as={Input}
                                    name={`medicines.${index}.duration`}
                                    placeholder="Duration"
                                    size="sm"
                                    height="35px"
                                    style={getInputStyles(
                                      formik,
                                      `medicines.${index}.duration`
                                    )}
                                  />
                                </FormControl>
                                <IconButton
                                  aria-label="Remove medicine"
                                  icon={<FaMinus />}
                                  onClick={() => remove(index)}
                                  size="sm"
                                  colorScheme="red"
                                />
                              </Stack>
                            </Box>
                          ))}
                          <Button
                            leftIcon={<FaPlus />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() =>
                              push({
                                medicineName: "",
                                dosage: "",
                                duration: "",
                              })
                            }
                          >
                            Add Medicine
                          </Button>
                        </Box>
                      )}
                    </FieldArray>
                    <FormControl
                      mb={3}
                      isInvalid={formik.errors.tests && formik.touched.tests}
                    >
                      <FormLabel htmlFor="tests" fontSize="sm">
                        Tests
                      </FormLabel>
                      <FieldArray name="tests">
                        {({ remove, push }) => (
                          <Box mb={4}>
                            {formik.values.tests.map((test, index) => (
                              <Box key={index} mb={2} position="relative">
                                <Stack
                                  direction="row"
                                  spacing={2}
                                  align="center"
                                >
                                  <FormControl
                                    isInvalid={
                                      formik.errors.tests?.[index] &&
                                      formik.touched.tests?.[index]
                                    }
                                  >
                                    <Field
                                      as={Input}
                                      name={`tests.${index}`}
                                      placeholder="Test"
                                      size="sm"
                                      height="35px"
                                      style={getInputStyles(
                                        formik,
                                        `tests.${index}`
                                      )}
                                    />
                                  </FormControl>
                                  <IconButton
                                    aria-label="Remove test"
                                    icon={<FaMinus />}
                                    onClick={() => remove(index)}
                                    size="sm"
                                    colorScheme="red"
                                  />
                                </Stack>
                              </Box>
                            ))}
                            <Button
                              leftIcon={<FaPlus />}
                              colorScheme="blue"
                              size="sm"
                              onClick={() => push("")}
                            >
                              Add Test
                            </Button>
                          </Box>
                        )}
                      </FieldArray>
                    </FormControl>
                    <Flex mt={3} gap={2}>
                      <Button flex={1} colorScheme="red" onClick={onClose}>
                        Cancel
                      </Button>
                      <Button flex={1} colorScheme="blue" type="submit">
                        Submit
                      </Button>
                    </Flex>
                  </Form>
                )}
              </Formik>
            </ModalBody>
          </ModalContent>
        </Modal>
      )}
    </>
  );
};

export default PrescriptionModal;
