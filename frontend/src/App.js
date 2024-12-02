import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import WorkflowCustomizationTool from './components/WorkflowCustomizationTool';
import AddNewPluginPage from './components/AddNewPluginPage';
import Navbar from './components/Navbar';
import Login from './components/user/Login';
import { WorkflowOverview } from './components/exporter/WorkflowOverview';
import { WorkflowProgress } from './components/exporter/WorkflowProgress';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { ManufacturerWorkflowPage } from './components/manufacturer/ManufaturerWorkflowPage';

function App() {
  const location = useLocation(); // Get current route location

  const showNavbar = location.pathname !== "/login"; // Show Navbar only if not on Login page

  return (
    <div>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <Routes>
        {/* Route for the Workflow Customization Tool */}
        <Route path="/" element={<WorkflowCustomizationTool />} />

        {/* Route for the Login page */}
        <Route path="/login" element={<Login />} />

        {/* Route for the Add New Plugin page */}
        <Route path="/add-plugin" element={<AddNewPluginPage />} />

         {/* Route for the exporter workflow page */}
        <Route path="/workflow" element={<WorkflowOverview />} />

         {/* Route for the exporter workflow track page */}
        <Route path="/progress" element={<WorkflowProgress />} />

         {/* Route for the manufacturer dashboard */}
        <Route path="/manufacturer-dashboard" element={<ManufacturerDashboard />} />

        {/* Route for the manufacturer workflow  */}
        <Route path="/manufacturer-workflow" element={<ManufacturerWorkflowPage />} />
      </Routes>
    </div>
  );
}

export default function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}

