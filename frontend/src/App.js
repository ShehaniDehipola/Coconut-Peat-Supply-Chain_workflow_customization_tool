import React, { useState } from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import WorkflowCustomizationTool from './components/WorkflowCustomizationTool';
import AddNewPluginPage from './components/AddNewPluginPage';
import Navbar from './components/Navbar';
import Login from './components/user/Login';
import { WorkflowOverview } from './components/exporter/WorkflowOverview';
import { WorkflowProgress } from './components/exporter/WorkflowProgress';
import { ManufacturerDashboard } from './components/manufacturer/ManufacturerDashboard';
import { ManufacturerWorkflowPage } from './components/manufacturer/ManufaturerWorkflowPage';
import WorkflowCreation from './components/exporter/WorkflowCreation';
import WorkflowDetails from './components/exporter/WorkflowDetails';
import MainSidebar from './components/sidebar/MainSidebar';
import styled from 'styled-components';
import { useUser } from './context/UserContext';
import AllWorkflowsPage from './components/exporter/AllWorkflowsPage';
import ManufacturerWorkflowsPage from './components/manufacturer/ManufacturerWorkflowsPage';
import ExporterWorkflow from './components/exporter/ExporterWorkflow';
import NewManufacturers from "./components/exporter/NewManufacturers";

const ContentArea = styled.div`
  margin-left: ${(props) => (props.expanded ? '0px' : '60px')};
  margin-top: 60px;
  transition: margin-left 0.3s ease-in-out;
`;

function App() {
  const location = useLocation(); // Get current route location
  const { user } = useUser(); // Get user from context
  const [expanded, setExpanded] = useState(true);

  const hideUI = ['/', '/login', '/signup'].includes(location.pathname); // Check if the path is login or signup

  return (
    <div>
      {!hideUI && <Navbar />} {/* Conditionally render Navbar */}
      {!hideUI && <MainSidebar role={user?.role} />}{' '}
      {/* Conditionally render Sidebar */}
      {/* Only apply ContentArea if hideUI is false */}
      {hideUI ? (
        <Routes>
          <Route
            path='/'
            element={<Login />}
          />
        </Routes>
      ) : (
        <ContentArea expanded={!hideUI && expanded}>
          <Routes>
            {/* Route for the Workflow Customization Tool */}
            <Route
              path='/new-workflow'
              element={<WorkflowCustomizationTool />}
            />
            {/* <Route path="/new-workflow" element={<WorkflowCreation />} /> */}

            {/* Route for the Login page */}
            <Route
              path='/'
              element={<Login />}
            />

            {/* Route for the Add New Plugin page */}
            <Route
              path='/add-plugin'
              element={<AddNewPluginPage />}
            />

            {/* Route for the exporter workflow page */}
            <Route
              path='/exporter-dashboard'
              element={<WorkflowOverview />}
            />

            {/* Route for the exporter workflow page */}
            <Route
              path='/all-workflows'
              element={<AllWorkflowsPage />}
            />

            {/* Route for the exporter workflow track page */}
            <Route
              path='/progress'
              element={<WorkflowProgress />}
            />

            {/* Route for the exporter workflow track page */}
            <Route
              path='/workflow-info/:workflowId'
              element={<ExporterWorkflow />}
            />

            <Route
              path='/workflow-details'
              element={<WorkflowDetails />}
            />

            {/* Route for the manufacturer dashboard */}
            <Route
              path='/manufacturer-dashboard'
              element={<ManufacturerDashboard />}
            />

            {/* Route for the manufacturer workflow  */}
            <Route
              path='/manufacturer-workflows'
              element={<ManufacturerWorkflowsPage />}
            />

            {/* Route for the manufacturer list  */}
            <Route
                path='/manufacturers'
                element={<NewManufacturers />}
            />


            <Route
              path='/each-workflow/:workflowId'
              element={<ManufacturerWorkflowPage />}
            />
          </Routes>
        </ContentArea>
      )}
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
