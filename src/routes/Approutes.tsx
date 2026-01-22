import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
 import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import ManageDescriptionList from "../pages/Admin/Configuration/ManageDescription/ManageDescriptionList";
import AppLayout from "../layouts/AppLayout";
import ManageGradingList from "../pages/Admin/Configuration/ManageGrading/ManageGradingList";

const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      {/* Public login page at root */}
      <Route path="/Login" element={<Login />} />
      <Route path="/app" element={<AppLayout />}>
        <Route path="Configuration/Managetemplate" element={""} />
        <Route path="Configuration/Managedescriptions" element={<ManageDescriptionList />} />
        <Route path="Configuration/Managetanks" element={""} />
        <Route path="Configuration/Manageabsgrading" element={<ManageGradingList />} />
      </Route>

      {/* Legacy route - can be removed or kept for backward compatibility */}
      <Route path="/Layout" element={<AppLayout />} />

      {/* Fallback: send unknown paths to login */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;