import React from "react";

import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import CreateEmployee from "./pages/admin/CreateEmployee";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import testadminpage from "./pages/TestAdmin";
import TestAdmin from "./pages/TestAdmin";
import Testreceptionist from "./pages/Testreceptionist";
import AdminLayout from "./layouts/adminLayout/AdminLayout";
import Employees from "./pages/admin/Employees";

import ReceptionistLayout from "./layouts/Receptionist/ReceptionistLayout";
import DoctorPage from "./pages/DoctorPage";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
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
        <Route path="/testadmin" element={<TestAdmin />} />
        <Route path="/testreceptionist" element={<Testreceptionist />} />
        <Route path="/doctor" element={<DoctorPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
