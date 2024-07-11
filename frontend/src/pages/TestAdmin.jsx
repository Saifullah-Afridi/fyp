// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// const TestAdmin = () => {
//   const navigation = useNavigate();
//   const [employeeRole, setEmployeeRole] = useState("");
//   useEffect(() => {
//     console.log("jdjdj");
//     const user = JSON.parse(localStorage.getItem("user"));
//     let userRole;
//     if (user) {
//       userRole = user.occupation;
//     }
//     if (userRole === "admin") {
//       navigation("/testadmin");
//     }
//     if (userRole === "receptionist") {
//       navigation("/testreceptionist");
//     }
//     if (!userRole) {
//       navigation("/login");
//     }
//   }, []);

//   return <div>TestAdmin</div>;
// };

// export default TestAdmin;
import React from "react";

const TestAdmin = () => {
  return <div>TestAdmin</div>;
};

export default TestAdmin;
