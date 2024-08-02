import React, { useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminPrivateRoutes = () => {
  const [employee, setEmployee] = useState(
    JSON.parse(localStorage.getItem("user")) || null
  );
  if (!employee) {
    return <Navigate to="/login" replace={true} />;
  }

  if (employee.occupation === "doctor") {
    return <Navigate to="doctor" replace={true} />;
  }
  if (employee.occupation === "receptionist") {
    return <Navigate to="/receptionist" replace={true} />;
  }

  return <Outlet />;
};

export default AdminPrivateRoutes;
