import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from 'react-data-table-component';
import { Link } from 'react-router-dom';
import { Button, Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, useDisclosure, useToast } from '@chakra-ui/react';

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("token"));
        const response = await axios.get(
          "http://localhost:3000/api/v1/employee",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        const employees = response.data.employees;
        const doctorsArray = employees.filter(
          (employee) => employee.occupation === "doctor"
        );
        setDoctors(doctorsArray);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Define columns for the DataTable
  const columns = [
    {
      name: 'Name',
      selector: row => row.name,
      sortable: true,
    },
    {
      name: 'NIC',
      selector: row => row.NIC,
      sortable: true,
    },
    {
      name: 'Specialty',
      selector: row => row.specialty,
      sortable: true,
    },
    {
      name: 'Actions',
      cell: row => (
        <div>
          <Link to={`/edit-doctor/${row._id}`}>
            <Button colorScheme="blue" mr={2}>Edit</Button>
          </Link>
          <Button colorScheme="red" onClick={() => {
            setSelectedDoctor(row);
            onOpen();
          }}>
            Delete
          </Button>
        </div>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(`http://localhost:3000/api/v1/employee/${selectedDoctor._id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setDoctors(doctors.filter(doc => doc._id !== selectedDoctor._id));
      toast({
        title: "Doctor deleted.",
        description: "The doctor has been deleted successfully.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: error.response?.data?.message || "An error occurred",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      onClose();
    }
  };

  return (
    <div>
      <h1>Doctors</h1>
      {loading && <div>Loading.....</div>}
      {error && <div>Error: {error}</div>}
      {doctors.length > 0 && (
        <DataTable
          columns={columns}
          data={doctors}
          pagination
        />
      )}

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Doctor</ModalHeader>
          <ModalBody>
            Are you sure you want to delete this doctor?
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              No
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Yes
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Doctors;
