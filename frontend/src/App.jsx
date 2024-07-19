import React, { useEffect, useState } from "react";

import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import CreateEmployee from "./pages/admin/CreateEmployee";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/adminLayout/AdminLayout";
import Employees from "./pages/admin/Employees";

import ReceptionistLayout from "./layouts/Receptionist/ReceptionistLayout";
import DoctorPage from "./pages/DoctorPage";
import PatientList from "./pages/PatientList";
import axios from "axios";

const App = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axios.get(
          "http://localhost:3000/api/v1/patient"
        );
        const today = new Date().toISOString().split("T")[0];
        const todayPatients = response.data.patients.filter((patient) => {
          const registrationDate = new Date(patient.createdAt);
          return (
            registrationDate instanceof Date &&
            !isNaN(registrationDate) &&
            registrationDate.toISOString().split("T")[0] === today
          );
        });
        setPatients(todayPatients);
      } catch (error) {
        console.error("Error fetching patients:", error);
      }
    };

    fetchPatients();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/log-in" element={<LoginPage />} />

        <Route path="/receptionist" element={<ReceptionistLayout />}>
          <Route index element={<RegistrationForm />} />
        </Route>

        {/* admin routes  */}
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CreateEmployee />} />
          <Route path="employees" element={<Employees />} />
        </Route>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/doctor"
          element={<DoctorPage patients={patients} setPatients={setPatients} />}
        />
        <Route
          path="/patient-list"
          element={<PatientList patients={patients} />}
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
