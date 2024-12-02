const fs = require("fs");
const Port = require("../models/Port")
const path = require('path');

// Endpoint to update the file
exports.updateFile = async  (req, res) => {
    const { content, filePath } = req.body; // Extract the updated file content

    if (!content) {
        return res.status(400).send({ message: "Content is required" });
    }

    // Write the updated content to the file
    fs.writeFile(filePath, content, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send({ message: "Error updating the file" });
        }
        res.send({ message: "File updated successfully!" });
    });
};

exports.generateFile = async (req, res) => {
    try {
        // Extract required fields from the request body
        const { plugin_name, sensor_name, userRequirement, execute_logic, save_path } = req.body;

        // Validate input
        if (!plugin_name || !sensor_name || !userRequirement || !execute_logic) {
            return res.status(400).json({
                error: "All fields (plugin_name, sensor_name, userRequirement, execute_logic) are required.",
            });
        }

        // Set default save path if none is provided
        const fileSaveDestination = save_path || "../core_plugin";

        // Ensure the directory exists
        if (!fs.existsSync(fileSaveDestination)) {
            fs.mkdirSync(fileSaveDestination, { recursive: true });
        }

        // Template for the Go file
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

type ${plugin_name}PluginServer struct {
    proto.UnimplementedGradingPluginServer
}

// Register registers the plugin in MongoDB
func (s *${plugin_name}PluginServer) RegisterPlugin(ctx context.Context, req *proto.PluginRequest) (*proto.PluginResponse, error) {
    collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
    filter := bson.M{"plugin_name": req.PluginName}
    var existingPlugin bson.M
    err := collection.FindOne(ctx, filter).Decode(&existingPlugin)
    if err == nil {
        return &proto.PluginResponse{Success: false, Message: "Plugin is already registered"}, nil
    }
    plugin := bson.M{
        "plugin_name":     req.PluginName,
        "sensor_name":     "${sensor_name}",
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
func (s *${plugin_name}PluginServer) ExecutePlugin(ctx context.Context, req *proto.PluginExecute) (*proto.ExecutionStatus, error) {
    ${execute_logic}
}

// UnregisterPlugin deactivates the plugin
func (s *${plugin_name}PluginServer) UnregisterPlugin(ctx context.Context, req *proto.PluginUnregister) (*proto.UnregisterResponse, error) {
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
    proto.RegisterGradingPluginServer(grpcServer, &${plugin_name}PluginServer{})

    log.Println("gRPC server is running on port 50052")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
`;

        // Define the file name
        const fileName = `${plugin_name.toLowerCase()}_plugin.go`;

        // Full file path
        const filePath = path.join(fileSaveDestination, fileName);

        // Write the file to the specified path (overwrite if it already exists)
        fs.writeFileSync(filePath, goFileContent, "utf8");

        // Send a success response
        res.status(200).json({
            message: "File generated successfully",
            filePath,
        });
    } catch (error) {
        // Handle errors
        console.error("Error generating file:", error.message);
        res.status(500).json({ error: "An error occurred while generating the file." });
    }
};
