import React, { useState } from "react";
import { Navigate } from "react-router-dom";

const ReceptionistPrivateRoutes = ({ children }) => {
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  if (!employee) {
    return <Navigate to="log-in" />;
  }
  if (employee.occupation === "doctor") {
    return <Navigate to="/doctor" />;
  }
  return children;
};

export default ReceptionistPrivateRoutes;
