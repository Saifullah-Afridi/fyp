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
  const [editingVisitId, setEditingVisitId] = useState(null);
  const [prescription, setPrescription] = useState("");
  const [tests, setTests] = useState("");
  const [medicines, setMedicines] = useState("");
  const [currenVisit, setCurrrentVisit] = useState({});
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

  const handlePrescribeClick = (visitId) => {
    setEditingVisitId(visitId);
    axios
      .get(`http://localhost:3000/api/v1/visit/getSingleVisit/${visitId}`)
      .then((res) => setCurrrentVisit(res.data.visit))
      .catch((err) => console.log(err.response.data.message));
  };

  const handleSubmit = async () => {
    try {
      await axios.patch(
        `http://localhost:3000/api/v1/visit/update-visit/${editingVisitId}`,
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

      toast({
        title: "Prescription updated.",
        description:
          "The visit record has been successfully updated with the prescription.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });

      setEditingVisitId(null);
      const response = await axios.get(
        "http://localhost:3000/api/v1/patient/todays-patients"
      );
      setVisits(response.data.visits);
    } catch (error) {
      toast({
        title: "Error updating prescription.",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    <div>
      <h1>Today's Patsdfsdfsients</h1>
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
                <Button onClick={() => handlePrescribeClick(visit._id)}>
                  Prescribe
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>

      {editingVisitId && (
        <div>
          <h2>Prescribe </h2>
          <Input
            value={currenVisit.prescription}
            onChange={(e) => setPrescription(e.target.value)}
            placeholder="Enter prescription"
          />
          <Textarea
            value={currenVisit.tests}
            onChange={(e) => setTests(e.target.value)}
            placeholder="Enter tests (comma separated)"
          />
          <Textarea
            value={currenVisit.medicines}
            onChange={(e) => setMedicines(e.target.value)}
            placeholder="Enter medicines (format: name (dosage, days), comma separated)"
          />
          <Button onClick={handleSubmit}>Submit Prescription</Button>
        </div>
      )}
    </div>
  );
};

export default DoctorDashboard;
