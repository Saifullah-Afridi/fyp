import React, { useEffect, useState } from "react";

import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import AdminLayout from "./layouts/adminLayout/AdminLayout";

import DoctorPage from "./pages/DoctorPage";
import PatientList from "./pages/PatientList";
import axios from "axios";
import WaitingRoom from "./pages/WaitingRoom";
import Doctors from "./pages/admin/Employees";
import EditEmployee from "./components/EditEmployee";
import ReceptionistPrivateRoutes from "./components/ReceptionistPrivateRoutes";
import Header from "./components/Header";
import AdminPrivateRoutes from "./components/AdminPrivateRoutes";

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
      <Header />
      <Routes>
        <Route index element={<LoginPage />} />
        <Route path="/log-in" element={<LoginPage />} />
        <Route
          path="/receptionist"
          element={
            <ReceptionistPrivateRoutes>
              <RegistrationForm />
            </ReceptionistPrivateRoutes>
          }
        />
        {/* doctor routes */}
        <Route
          path="/doctor"
          element={<DoctorPage patients={patients} setPatients={setPatients} />}
        />
        {/* admin routes  */}
        <Route element={<AdminPrivateRoutes />}>
          <Route path="/admin" element={<AdminLayout />} />
        </Route>
        {/* <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<CreateEmployee />} />
          <Route path="create-employee" element={<CreateEmployee />} />
          <Route path="doctors" element={<Doctors />}></Route>
        </Route> */}
        <Route path="edit-employee/:id" element={<EditEmployee />} />{" "}
        <Route
          path="/patient-list"
          element={<PatientList patients={patients} />}
        />
        <Route path="/list" element={<WaitingRoom />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
