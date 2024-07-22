import React, { useEffect, useState } from "react";
import axios from "axios";

const Doctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
        setError(error.response.data.message);
        setLoading(false);
      }
    };

    fetchEmployees();
  }, []);

  return (
    <div>
      <h1>Doctors</h1>
      {loading && <div>Loading.....</div>}
      {error && <div>Error.....</div>}
      {doctors.length > 0 && <div>{doctors[0].NIC}</div>}
    </div>
  );
};

export default Doctors;
