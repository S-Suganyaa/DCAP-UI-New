import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./ProtectedRoute";
import Login from "../pages/Login/Login";
import ManageDescriptionList from "../pages/Admin/Configuration/ManageDescription/ManageDescriptionList";
import AppLayout from "../layouts/AppLayout";
import ManageGradingList from "../pages/Admin/Configuration/ManageGrading/ManageGradingList";
import Tanks from "../pages/Admin/Configuration/ManageTanks/Tanks";
import ManageTemplate from "../pages/Admin/Configuration/ManageTemplate/ManageTemplate";

import ProjectList from "../pages/Project/List";
import Success from "../Success";

const AppRoutes = () => (
    <BrowserRouter>
        <Routes>
            {/* Public login page at root */}
            <Route path="/" element={<Login />} />
            <Route path="/Login" element={<Login />} />

            {/* App routes - no authentication required for now */}
            {/* Success page for Microsoft login redirect */}
            <Route path="/success" element={<Success />} />

            <Route path="/app" element={<AppLayout />}>
                <Route index element={<ProjectList />} />
                <Route path="Project" element={<ProjectList />} />
                <Route path="Configuration/Managetemplate" element={<ManageTemplate />} />
                <Route path="Configuration/Managedescriptions" element={<ManageDescriptionList />} />
                <Route path="Configuration/ManageTanks" element={<Tanks />} />
                <Route path="Configuration/Manageabsgrading" element={<ManageGradingList />} />
            </Route>

            {/* Legacy route */}
            <Route path="/Layout" element={<AppLayout />} />

            {/* Fallback: send unknown paths to login */}
            <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
    </BrowserRouter>
);

export default AppRoutes;