# Workflow Customization Tool

A dynamic, customizable workflow system designed for industries such as manufacturing, enabling non-technical also known as domain-specific users to easily create, manage, and optimize workflows. This tool simplifies complex processes with a drag-and-drop interface, real-time Domain-Specific-Language preview, and seamless integration with backend systems.

---

## Features

- **Drag-and-Drop Interface**: Easily design workflows with a visual canvas.
- **Predefined Plugins**: Access a set of predefined plugins (e.g., grading, washing) for common tasks.
- **Real-Time DSL-Flowchat Preview**: View generated DSL (Domain Specific Language) instructions as you design workflows vice versa.
- **Custom Plugin Creation**: Add new plugins to the workflow with an intuitive interface.
- **Authentication**: User authentication with JWT-based login/signup.
- **Error Handling & Validation**: Structural, logical, and property validation to ensure workflow integrity.

---

## Technologies Used

- **Frontend**: 
  - React
  - JavaScript, HTML, CSS
  - React-DnD (for drag-and-drop functionality)
- **Backend**: 
  - REST (for communication between frontend and backend)
  - gRPC (for communication between backend server and core system)
  - MongoDB (for storing workflows and related data)
- **Authentication**: JWT (JSON Web Tokens)
- **Others**: JSON (for workflow serialization)

---

## Installation
### Prerequisites
- React (for frontend development)
- Node.js (for backend development)
- MongoDB (for storing data)

### Steps
1. Clone the repository:
   ```bash
   git clone https://github.com/ShehaniDehipola/Coconut-Peat-Supply-Chain_workflow_customization_tool.git

2. Frontend Setup:
   ```bash
   cd frontend
   npm install
   npm start

3. Backend Setup:
   ```bash
   cd backend
   npm install
   node server.js

4. Grpc Server Setup:
   ```bash
   cd backend/grpc-node-server
   node server.js

5. Database Setup:
   - Ensure MongoDB is installed and running on the default port.
   - Optionally, update the database connection string in the backend `.env` file if needed.

6. Verify the setup:
   - Frontend: Open `http://localhost:3000` in your browser.
   - Backend: Check the terminal logs to ensure the backend is running without errors.

---

## License
This project is licensed under the MIT License. 


