
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

type CustomPluginPluginServer struct {
    proto.UnimplementedGradingPluginServer
}

// Register registers the plugin in MongoDB
func (s *CustomPluginPluginServer) RegisterPlugin(ctx context.Context, req *proto.PluginRequest) (*proto.PluginResponse, error) {
    collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
    filter := bson.M{"plugin_name": req.PluginName}
    var existingPlugin bson.M
    err := collection.FindOne(ctx, filter).Decode(&existingPlugin)
    if err == nil {
        return &proto.PluginResponse{Success: false, Message: "Plugin is already registered"}, nil
    }
    plugin := bson.M{
        "plugin_name":     "CustomPlugin",
        "sensor_name":     "image_module",
        "userRequirement": 100,
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
func (s *CustomPluginPluginServer) ExecutePlugin(ctx context.Context, req *proto.PluginExecute) (*proto.ExecutionStatus, error) {
    abc
}

// UnregisterPlugin deactivates the plugin
func (s *CustomPluginPluginServer) UnregisterPlugin(ctx context.Context, req *proto.PluginUnregister) (*proto.UnregisterResponse, error) {
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
    proto.RegisterGradingPluginServer(grpcServer, &CustomPluginPluginServer{})

    log.Println("gRPC server is running on port 50052")
    if err := grpcServer.Serve(lis); err != nil {
        log.Fatalf("Failed to serve: %v", err)
    }
}
