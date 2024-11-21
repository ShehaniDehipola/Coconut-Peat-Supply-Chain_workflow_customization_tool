import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import WorkflowCustomizationTool from './components/WorkflowCustomizationTool';
import AddNewPluginPage from './components/AddNewPluginPage';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route for the Workflow Customization Tool */}
        <Route path="/" element={<WorkflowCustomizationTool />} />

        {/* Route for the Add New Plugin page */}
        <Route path="/add-plugin" element={<AddNewPluginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
