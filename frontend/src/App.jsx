import { BrowserRouter, Routes, Route } from "react-router-dom";
import RegistrationForm from "./pages/RegistrationForm";
import LoginPage from "./pages/LoginPage";
import AdminLayout from "./layouts/adminLayout/AdminLayout";
import DoctorPage from "./pages/DoctorPage";
import PatientList from "./pages/PatientList";
import WaitingRoom from "./pages/WaitingRoom";
import EditEmployee from "./components/EditEmployee";
import ReceptionistPrivateRoutes from "./components/ReceptionistPrivateRoutes";
import Header from "./components/Header";
import AdminPrivateRoutes from "./components/AdminPrivateRoutes";
import DoctorPrivateRoute from "./components/DoctorPrivateRoute";
import RoutesWithHeader from "./components/RoutesWithHeader";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<RoutesWithHeader />}>
          {/* login routes    */}
          <Route index element={<LoginPage />} />
          <Route path="/log-in" element={<LoginPage />} />
          {/* public routes */}
          <Route path="waiting-room" element={<WaitingRoom />} />
          {/* reciptionist routes */}
          <Route
            path="/receptionist"
            element={
              <ReceptionistPrivateRoutes>
                <RegistrationForm />
              </ReceptionistPrivateRoutes>
            }
          />

          {/* docots routes */}
          <Route
            path="/doctor"
            element={
              <DoctorPrivateRoute>
                <DoctorPage />
              </DoctorPrivateRoute>
            }
          />
        </Route>
        {/* admin routes  */}
        <Route element={<AdminPrivateRoutes />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="edit-employee/:id" element={<EditEmployee />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
