import React from "react";

import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import CreateEmployee from "./pages/admin/CreateEmployee";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import reciptionistLayout from "./layouts/reciptionist/reciptionistLayout";
import testadminpage from "./pages/TestAdmin";
import TestAdmin from "./pages/TestAdmin";
import Testreceptionist from "./pages/Testreceptionist";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/log-in" element={<LoginPage />} />

        <Route path="/create-employee" element={reciptionistLayout}>
          <Route index element={<RegistrationForm />} />
        </Route>

        <Route path="/login" element={<LoginPage />} />
        <Route path="/testadmin" element={<TestAdmin />} />
        <Route path="/testreceptionist" element={<Testreceptionist />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
