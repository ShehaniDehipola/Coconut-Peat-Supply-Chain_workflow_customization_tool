import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import styled, { keyframes }  from "styled-components";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import JSONViewer from "./parser/JsonViewer";
import DSLInstructions from "./parser/InstructionsContainer";
import Diagram from "./Diagram";
import TerminalOutput from "./sidebar/TerminalOutput";
import { generateGoCode } from "../utils/goGenerator";
import { generateDSL } from "../utils/dslGenerator";

// Styled components for layout
const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: calc(100vh - 60px);
  overflow: hidden; /* Prevents scrolling */
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 5px;
  text-align: right;
`;

const MainContainer = styled.div`
  display: flex;
  flex: 1; /* Allows children to grow */
  overflow: hidden; /* Prevents scrolling within this container */
  margin-top: 10px;
  height: calc(100vh - 10px);
`;

const SidebarContainer = styled.div`
  width: 220px;
  display: flex;
  flex-direction: column;
  padding: 10px;
  box-sizing: border-box;
  background-color: #d3d2d0;
  margin-left: 80px;
`;

const InputContainer = styled.div`
  margin-bottom: 20px;
`;

const InputField = styled.input`
  margin-bottom: 10px;
  padding: 5px;
  width: 100%;
  font-size: 14px;
  box-sizing: border-box;
`;

const Label = styled.label`
  font-size: 14px;
  margin-bottom: 5px;
  display: block;
`;

const PaletteContainer = styled.div`
  flex: 1;
  border-top: 1px solid #2D3142;
`;

const DiagramContainer = styled.div`
  flex: 1;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

const JSONViewerContainer = styled.div`
  width: 250px;
  border-left: 1px solid #2D3142;
  height: 100%;
`;

const DSLContainer = styled.div`
  width: 260px;
  display: flex;
  flex-direction: column; /* Ensures children stack vertically */
  overflow: hidden; /* Prevents overflow issues */
`;

const TerminalContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #2D3142;
  color: white;
  border-top: 1px solid #2D3142;
  position: relative;
  flex-shrink: 0;
`;

const TerminalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1F2532;
  padding: 8px 12px;
  color: white;
  font-weight: semi-bold;
`;

const ClearButton = styled.button`
  background: none;
  border: 1px solid white;
  color: white;
  cursor: pointer;
  display: flex;
  align-items: center;
  font-size: 14px;
  padding: 6px 12px;
  border-radius: 4px;
  transition: background-color 0.3s ease-in-out;

  &:hover {
    background-color: #d9534f; /* Red hover effect */
  }

  svg {
    margin-left: 5px;
  }
`;

const TerminalBodyContainer = styled.div`
  width: 100%;
  height: 200px;
  background-color: #2D3142;
  color: white;
  font-family: monospace;
  padding: 10px;
  overflow-y: auto;
  border-top: 1px solid #2D3142;
  position: relative;
  flex-shrink: 0;
`;


const ResizeHandle = styled.div`
  height: 5px;
  background: #555;
  cursor: ns-resize;
  position: absolute;
  top: -5px;
  width: 100%;
`;

const ExportButton = styled.button`
  background-color: transparent;
  color: #2D3142;
  border: 1px solid #2D3142;
  padding: 10px 15px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2D3142;
    color: white;
  }
`;

const SubmitButton = styled.button`
  background-color: #2D3142;
  color: white;
  border: 1px solid #2D3142;
  padding: 10px 15px;
  font-size: 12px;
  border-radius: 5px;
  cursor: pointer;
  margin: 10px 0;
transition: background-color 0.3s, color 0.3s;

  &:hover {
    background-color: #2D3142;
    color: white;
  }
`;

// Loading spinner animation
const spin = keyframes`
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
`;

const LoadingOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const Spinner = styled.div`
  border: 6px solid rgba(255, 255, 255, 0.3);
  border-top: 6px solid white;
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: ${spin} 1s linear infinite;
`;

const AddNewPluginPage = () => {
  const [model, setModel] = useState(null);
  const [pluginName, setPluginName] = useState("");
  const [sensorName, setSensorName] = useState("");
  const [terminalHeight, setTerminalHeight] = useState(100);
  const [isResizing, setIsResizing] = useState(false);
  const [terminalLogs, setTerminalLogs] = useState([]);
  const [instructions, setInstructions] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const navigate = useNavigate(); 

  const handleModelChange = (modelData) => {
    if (!modelData) {
      console.error("Model data is missing.");
    return;
    }
    console.log("Model data received in handleModelChange:", modelData);
    setModel(modelData);
  };

  const handleGenerateCode = async () => {
    if (!model) {
      alert("No flowchart model to generate code from!");
      return;
    }

    try {
      setLoading(true); // Start loading animation
      const goCode = generateGoCode(model); // Call generateGoCode with the model
      console.log("Generated Go Code:\n", goCode);
      toast.success("Go code generated successfully!");
    } catch (error) {
      console.error("Error generating Go code:", error);
      toast.error("Error generating Go code. Try again");
    }

    const execute_logic = "// execute logic";
    let port = 52222;
    const updateContent = `# Use an official Go image as the base image
FROM golang:1.22.7-alpine as builder

# Set the Current Working Directory inside the container
WORKDIR /app

# Install necessary packages for the build
RUN apk add --no-cache git

# Copy go.mod and go.sum files
COPY go.mod go.sum ./

# Download all dependencies. Dependencies are cached if the go.mod and go.sum files are not changed
RUN go mod download

# Copy the source code
COPY . .

# Copy the .env file to the container
COPY .env .env

# Install an environment variable loader (if needed)
RUN go install github.com/joho/godotenv/cmd/godotenv@latest

# Build the Go app
RUN go build -o washing_plugin

# Create a minimal runtime image
FROM alpine:latest

# Set the Current Working Directory inside the container
WORKDIR /root/

# Copy the pre-built binary from the builder stage
COPY --from=builder /app/washing_plugin .

# Copy the .env file to the runtime image's working directory
COPY --from=builder /app/.env /root/

# Make sure the binary is executable
RUN chmod +x washing_plugin

# Expose the gRPC port
EXPOSE 50054

# Command to run the executable
CMD ["./washing_plugin"]`
    

    const goFileContent = `
package main

import (
    "context"
    "log"
    "net"
    "strconv"
    "time"

    mongo "grading/config/db"
    "grading/proto"

    "go.mongodb.org/mongo-driver/bson"
    "google.golang.org/grpc"
)

type ${pluginName}PluginServer struct {
    proto.UnimplementedGradingPluginServer
}

// Register registers the plugin in MongoDB
func (s *${pluginName}PluginServer) RegisterPlugin(ctx context.Context, req *proto.PluginRequest) (*proto.PluginResponse, error) {
    collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
    filter := bson.M{"plugin_name": req.PluginName}
    var existingPlugin bson.M
    err := collection.FindOne(ctx, filter).Decode(&existingPlugin)
    if err == nil {
        return &proto.PluginResponse{Success: false, Message: "Plugin is already registered"}, nil
    }
    plugin := bson.M{
        "plugin_name":     req.PluginName,
        "sensor_name":     "${sensorName}",
        "userRequirement": userRequirement,
        "status":          true,
        "process":         "registered",
        "created_at":      time.Now(),
        "updated_at":      time.Now(),
    }

    _, err = collection.InsertOne(ctx, plugin)
    if err != nil {
        log.Printf("Failed to register plugin: %v", err)
        return &proto.PluginResponse{Success: false, Message: "Failed to register plugin"}, err
    }

    return &proto.PluginResponse{Success: true, Message: "Plugin registered successfully"}, nil
}

// ExecutePlugin executes the plugin logic
func (s *${pluginName}PluginServer) ExecutePlugin(ctx context.Context, req *proto.PluginExecute) (*proto.ExecutionStatus, error) {
    ${execute_logic}
}

// UnregisterPlugin deactivates the plugin
func (s *${pluginName}PluginServer) UnregisterPlugin(ctx context.Context, req *proto.PluginUnregister) (*proto.UnregisterResponse, error) {
    collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
    filter := bson.M{"plugin_name": req.PluginName}
    update := bson.M{
        "$set": bson.M{
            "status":     false,
            "updated_at": time.Now(),
        },
    }

    _, err := collection.UpdateOne(ctx, filter, update)
    if err != nil {
        return &proto.UnregisterResponse{Success: false, Message: "Failed to unregister plugin"}, err
    }

    return &proto.UnregisterResponse{Success: true, Message: "Plugin unregistered successfully"}, nil
}

func main() {
    lis, err := net.Listen("tcp", ":50052")
    if err != nil {
        log.Fatalf("failed to listen: %v", err)
    }
    grpcServer := grpc.NewServer()
    mongo.ConnectMongoDB()
    proto.RegisterGradingPluginServer(grpcServer, &${pluginName}PluginServer{})

    log.Println("gRPC server is running on port 50052")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
`
    const requestBody = {
    "updateContent": updateContent,
    "goFileContent": goFileContent,
    "plugin_name": pluginName,
    "sensor_name": sensorName,
    "userRequirement": "100",
    "execute_logic": execute_logic,
    "save_path": "../washing",
  };
    
    try {
      const response = await axios.post("http://localhost:5000/api/file/process-all", requestBody,
        
        {
          headers: {
            "Content-Type": "application/json",
          },
        });
      toast.success(response.data.message);

      setTimeout(() => {
        setLoading(false); // Stop loading after process completes
        navigate("/new-workflow"); // Navigate to workflow page
      }, 2000);
    } catch (error) {
      console.error(error);
      toast.error("Failed to update the file.");
      if (error.response && error.response.data) {
      console.log(`Failed to update the file: ${error.response.data.message}`);
    } else {
        console.log("Failed to update the file. Please try again later.");
        setLoading(false);
    }
    }

  };

  const handleUpdateModel = (updatedModel) => {
    console.log("updated model", model)
    setModel(updatedModel); // Update the model state
  };

  useEffect(() => {
  console.log("Current model state:", model);
  }, [model]);
  
  const logToTerminal = (message) => {
    setTerminalLogs((prevLogs) => [...prevLogs, message]);
  };

  const handleGenerateDSL = () => {
    setTerminalLogs(["Starting DSL validation..."]);
    try {
      const result = generateDSL(model, logToTerminal, setInstructions);
      setTerminalLogs((prevLogs) => [...prevLogs, result]);
    } catch (error) {
      setTerminalLogs((prevLogs) => [...prevLogs, `Error: ${error.message}`]);
    }
  };

  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsResizing(true);

    const startY = e.clientY;
    const startHeight = terminalHeight;

    const onMouseMove = (event) => {
      const newHeight = Math.max(50, Math.min(250, startHeight + (startY - event.clientY)));
      setTerminalHeight(newHeight);
    };

    const onMouseUp = () => {
      setIsResizing(false);
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };

    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  return (
    <AppContainer>
      {loading && (
        <LoadingOverlay>
          <Spinner />
        </LoadingOverlay>
      )}

      <MainContainer>
        {/* Sidebar containing input fields and palette */}
        <SidebarContainer>
          <InputContainer>
            <Label htmlFor="pluginName">Plugin Name</Label>
            <InputField
              id="pluginName"
              value={pluginName}
              onChange={(e) => setPluginName(e.target.value)}
              placeholder="Enter plugin name"
            />

            <Label htmlFor="sensorName">Sensor Name</Label>
            <InputField
              id="sensorName"
              value={sensorName}
              onChange={(e) => setSensorName(e.target.value)}
              placeholder="Enter sensor name"
            />
          </InputContainer>
          <PaletteContainer id="myPaletteDiv" />
        </SidebarContainer>

        {/* Diagram Canvas */}
        <DiagramContainer>
          <ButtonContainer>
          <ExportButton onClick={() => window.exportModel()}>
            Export Model
            </ExportButton>
          <SubmitButton onClick={handleGenerateCode} disabled={loading}>
              {loading ? "Processing..." : "Save Plugin"}
            </SubmitButton>
          </ButtonContainer>
          <Diagram onExport={handleModelChange} model={model} />
          {/* Generate Go Code Button */}
          <TerminalContainer height={terminalHeight}>
            <TerminalHeader>
        <span>Execution Logs</span>
        <ClearButton onClick={() => setTerminalLogs([])}>
          Clear
        </ClearButton>
      </TerminalHeader>
            <TerminalBodyContainer>
            {terminalLogs.map((log, index) => (
              <div key={index}>{log}</div>
            ))}
            </TerminalBodyContainer>
          </TerminalContainer>
          {/* <TerminalOutput logs={terminalLogs} setLogs={setTerminalLogs} /> */}
        </DiagramContainer>

        {/* DSL Instructions */}
        <DSLContainer>
          <DSLInstructions model={model} onUpdateModel={handleUpdateModel} isUpdateWorkFlow ={false} logToTerminal={logToTerminal}  setInstructions={setInstructions} />
        </DSLContainer>
      </MainContainer>
      <ToastContainer />
    </AppContainer>
  );
};

export default AddNewPluginPage;
