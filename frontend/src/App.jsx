import React from "react";

import RegistrationForm from "./pages/RegistrationForm";
import DoctorPage from "./pages/DoctorPage";
import PatientList from "./pages/PatientList";
import WaitingRoom from "./pages/WaitingRoom";
import LoginPage from "./pages/LoginPage";
import CreateEmployee from "./pages/admin/CreateEmployee";
const App = () => {
  return (
    <div>
      <CreateEmployee></CreateEmployee>
      {/* <DoctorPage /> */}
      {/* <PatientList></PatientList> */}
      {/* <WaitingRoom /> */}
      {/* <LoginPage /> */}
    </div>
  );
};

export default App;
