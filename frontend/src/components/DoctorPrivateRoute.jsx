import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
const DoctorPrivateRoute = ({ children }) => {
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  if (!employee) {
    return <Navigate to="/login" replace={true} />;
  }
  if (employee.occupation === "receptionist") {
    return <Navigate to="/receptionist" replace={true} />;
  }

  return children;
};

export default DoctorPrivateRoute;
