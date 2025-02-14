import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import WorkflowCustomizationTool from "./components/WorkflowCustomizationTool";
import AddNewPluginPage from "./components/AddNewPluginPage";
import Navbar from "./components/Navbar";
import Login from "./components/user/Login";
import { WorkflowOverview } from "./components/exporter/WorkflowOverview";
import { WorkflowProgress } from "./components/exporter/WorkflowProgress";
import { ManufacturerDashboard } from "./components/manufacturer/ManufacturerDashboard";
import { ManufacturerWorkflowPage } from "./components/manufacturer/ManufaturerWorkflowPage";
import WorkflowCreation from "./components/exporter/WorkflowCreation";
import WorkflowDetailsPage from "./components/exporter/WorkflowDetails";
import MainSidebar from "./components/sidebar/MainSidebar";
import styled from "styled-components";

const ContentArea = styled.div`
  margin-left: 240px; /* Same as sidebar width */
`;

function App() {
  const location = useLocation(); // Get current route location

  const showNavbar = location.pathname !== "/login"; // Show Navbar only if not on Login page

  return (
    <div>
      {showNavbar && <Navbar />} {/* Conditionally render Navbar */}
      <MainSidebar role="Exporter"></MainSidebar>
      <ContentArea>
        <Routes>
          {/* Route for the Workflow Customization Tool */}
          <Route path="/new-workflow" element={<WorkflowCustomizationTool />} />
          {/* <Route path="/new-workflow" element={<WorkflowCreation />} /> */}

          {/* Route for the Login page */}
          <Route path="/" element={<Login />} />

          {/* Route for the Add New Plugin page */}
          <Route path="/add-plugin" element={<AddNewPluginPage />} />

          {/* Route for the exporter workflow page */}
          <Route path="/exporter-dashboard" element={<WorkflowOverview />} />

          {/* Route for the exporter workflow track page */}
          <Route path="/progress" element={<WorkflowProgress />} />

          <Route path="/workflow-details" element={<WorkflowDetailsPage />} />

          {/* Route for the manufacturer dashboard */}
          <Route
            path="/manufacturer-dashboard"
            element={<ManufacturerDashboard />}
          />

          {/* Route for the manufacturer workflow  */}
          <Route
            path="/manufacturer-workflow"
            element={<ManufacturerWorkflowPage />}
          />
        </Routes>
      </ContentArea>
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
