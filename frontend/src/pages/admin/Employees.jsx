import React, { useEffect, useState } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import { Link } from "react-router-dom";
import {
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  useDisclosure,
  useToast,
  Box,
  Heading,
  Input,
  Select,
} from "@chakra-ui/react";

const Employees = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all"); // State for filter
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
        setEmployees(response.data.employees);
        setLoading(false);
      } catch (error) {
        setError(error.response?.data?.message || "An error occurred");
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  // Filter employees to exclude those with occupation "admin"
  const filteredEmployees = employees
    .filter((employee) => employee.occupation !== "admin")
    .filter((employee) => {
      if (filter === "all") return true;
      return employee.occupation === filter;
    })
    .filter((employee) =>
      [employee.name, employee.phoneNumber] // Only filter by name and phone number
        .filter(Boolean) // Remove undefined or null values
        .some((field) => field.toLowerCase().includes(search.toLowerCase()))
    );

  // Define columns for the DataTable
  const columns = [
    {
      name: "Name",
      selector: (row) => row.name || "N/A", // Fallback to "N/A" if name is undefined
      sortable: true,
    },
    {
      name: "Role",
      selector: (row) => row.occupation || "N/A", // Display occupation as role
      sortable: true,
    },
    {
      name: "Phone Number",
      selector: (row) => row.phoneNumber || "N/A", // Fallback to "N/A" if phoneNumber is undefined
      sortable: false, // Remove sorting for phone number
    },
    {
      name: "Delete",
      cell: (row) => (
        <Button
          colorScheme="red"
          onClick={() => {
            setSelectedEmployee(row);
            onOpen();
          }}
        >
          Delete
        </Button>
      ),
    },
    {
      name: "Edit",
      cell: (row) => (
        <Link to={`/admin/edit-employee/${row._id}`}>
          <Button colorScheme="blue" ml={2}>
            Edit
          </Button>
        </Link>
      ),
    },
  ];

  const handleDelete = async () => {
    try {
      const token = JSON.parse(localStorage.getItem("token"));
      await axios.delete(
        `http://localhost:3000/api/v1/employee/${selectedEmployee._id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setEmployees(employees.filter((emp) => emp._id !== selectedEmployee._id));
      toast({
        title: "Employee deleted.",
        description: "The employee has been deleted successfully.",
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

  // Custom styles for the DataTable
  const customStyles = {
    headCells: {
      style: {
        backgroundColor: "#007BFF", // Blue color for the header
        color: "#FFFFFF", // White text color
        fontSize: "16px", // Font size
        fontWeight: "bold", // Font weight
        padding: "10px", // Padding
      },
    },
    cells: {
      style: {
        fontSize: "16px", // Font size for cell content
        padding: "10px", // Padding
      },
    },
    // table: {
    //   style: {
    //     border: "1px solid #007BFF", // Blue border for the table
    //     borderRadius: "8px", // Rounded corners
    //     overflow: "hidden", // Ensure border radius works properly
    //   },
    // },
    rows: {
      style: {
        borderBottom: "1px solid #007BFF", // Blue border for each row
        borderLeft: "1px solid #007BFF", // Blue border for left side of each row
        borderRight: "1px solid #007BFF", // Blue border for right side of each row
      },
    },
  };

  return (
    <Box p={4}>
      <Heading textAlign="center" mb={4}>
        Employees
      </Heading>
      {loading && <div>Loading.....</div>}
      {error && <div>Error: {error}</div>}
      <Box
        mb={4}
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Input
          placeholder="Search by name or phone number"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          mr={4}
          width="60%"
        />
        <Select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          width="30%"
        >
          <option value="all">All</option>
          <option value="doctor">Doctor</option>
          <option value="receptionist">Receptionist</option>
        </Select>
      </Box>
      {employees.length > 0 && (
        <DataTable
          columns={columns}
          data={filteredEmployees}
          pagination
          customStyles={customStyles}
        />
      )}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Employee</ModalHeader>
          <ModalBody>Are you sure you want to delete this employee?</ModalBody>
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
    </Box>
  );
};

export default Employees;
