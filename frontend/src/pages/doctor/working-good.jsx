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
} from "@chakra-ui/react";

const DoctorDashboard = () => {
  const [visits, setVisits] = useState([]);
  const [editingVisit, setEditingVisit] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [tests, setTests] = useState("");
  const [medicines, setMedicines] = useState("");
  const toast = useToast();

  useEffect(() => {
    // Fetch today's patients when the component mounts
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
      setTests(editTests.join(", ") || "");
      setMedicines(
        editMedicines
          .map((m) => `${m.name} (${m.dosage}, ${m.days})`)
          .join(", ") || ""
      );
    }
  }, [editingVisit]);

  const handlePrescribeClick = (visit) => {
    setEditingVisit(visit);
  };

  const handlePending = async () => {
    if (!editingVisit) return;

    try {
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-visit/${editingVisit._id}`,
        {
          prescription,

          tests: tests.split(",").map((test) => test.trim()),
          medicines: medicines
            .split(",")
            .map((medicine) => {
              const parts = medicine.split("(");
              if (parts.length === 2) {
                const [name, details] = parts;
                const [dosage, days] = details
                  .replace(")", "")
                  .split(",")
                  .map((d) => d.trim());
                return { name: name.trim(), dosage, days };
              } else {
                return { name: medicine.trim(), dosage: "", days: "" };
              }
            })
            .filter((m) => m.name !== ""),
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
          tests: tests.split(",").map((test) => test.trim()),
          medicines: medicines
            .split(",")
            .map((medicine) => {
              const parts = medicine.split("(");
              if (parts.length === 2) {
                const [name, details] = parts;
                const [dosage, days] = details
                  .replace(")", "")
                  .split(",")
                  .map((d) => d.trim());
                return { name: name.trim(), dosage, days };
              } else {
                return { name: medicine.trim(), dosage: "", days: "" };
              }
            })
            .filter((m) => m.name !== ""),
        }
      );
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-status/${editingVisit._id}`,
        {
          status: "complete",
        }
      );
      setEditingVisit(null);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
      toast({
        title: "Visit completed.",
        description: "The visit has been marked as complete.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
    setTests("");
    setMedicines("");
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
                <Button onClick={() => handlePrescribeClick(visit)}>
                  Prescribe
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {editingVisit && (
        <div style={{ marginTop: "20px" }}>
          <h2>Prescribe for {editingVisit.patient.patientName}</h2>
          <Input
            value={prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Enter prescription"
          />
          <Textarea
            value={tests}
            onChange={(e) => setTests(e.target.value)}
            placeholder="Enter tests (comma separated)"
          />
          <Textarea
            value={medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="Enter medicines (format: name (dosage, days), comma separated)"
          />
          <Button onClick={handlePending} colorScheme="yellow" mt={4}>
            Mark as Pending
          </Button>
          <Button onClick={handleCancel} colorScheme="red" mt={4} ml={4}>
            Cancel
          </Button>
          <Button onClick={handleComplete} colorScheme="green" mt={4} ml={4}>
            Complete Visit
          </Button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
