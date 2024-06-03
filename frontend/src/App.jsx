import React from "react";

import RegistrationForm from "./pages/RegistrationForm";
import DoctorPage from "./pages/DoctorPage";
import PatientList from "./pages/PatientList";

const App = () => {
  return (
    <div>
      {/* <RegistrationForm></RegistrationForm> */}
      <DoctorPage />
      {/* <PatientList></PatientList> */}
    </div>
  );
};

export default App;
