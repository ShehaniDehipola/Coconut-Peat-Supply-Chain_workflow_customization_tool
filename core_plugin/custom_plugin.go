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

type GradingPluginServer struct {
	proto.UnimplementedGradingPluginServer
}

// Register registers the grading plugin in MongoDB
func (s *GradingPluginServer) RegisterPlugin(ctx context.Context, req *proto.PluginRequest) (*proto.PluginResponse, error) {
	collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
	// Check if the grading plugin is already registered
	filter := bson.M{"plugin_name": req.PluginName}
	var existingPlugin bson.M
	err := collection.FindOne(ctx, filter).Decode(&existingPlugin)
	if err == nil {
		return &proto.PluginResponse{Success: false, Message: "Plugin is already registered"}, nil
	}
	userRequirement := req.UserRequirement
	plugin := bson.M{
		"plugin_name":     req.PluginName,
		"senosor_name":    "image_module",
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

// execute grading
func (s *GradingPluginServer) ExecutePlugin(ctx context.Context, req *proto.PluginExecute) (*proto.ExecutionStatus, error) {
	collection := mongo.MongoClient.Database("pluginDB").Collection("plugins")
	filter := bson.M{"plugin_name": req.PluginName}
	var plugin bson.M
	err := collection.FindOne(ctx, filter).Decode(&plugin)
	if err != nil {
		return &proto.ExecutionStatus{Success: false, Message: "Plugin not found"}, err
	}

	if !plugin["status"].(bool) {
		return &proto.ExecutionStatus{Success: false, Message: "Plugin is deactivated"}, nil
	}

	userRequirementStr, ok := plugin["userRequirement"].(string)
	if !ok {
		return &proto.ExecutionStatus{Success: false, Message: "Failed to get userRequirement"}, nil
	}

	userRequirement, err := strconv.Atoi(userRequirementStr)
	if err != nil {
		return &proto.ExecutionStatus{Success: false, Message: "userRequirement must be an integer"}, err
	}

	qualified := 60
	acceptable := 30
	rejected := 10
	totalCount := qualified + acceptable

	message := "Grading completed successfully"
	success := true
	// Check if the total count is less than the user requirement
	if totalCount < userRequirement {
		message = "Order another batch or decide to process"
		success = false
	}
	//check if the total count is greater than the user requirement
	if totalCount > userRequirement {
		message = "user requirement exceeded"
		success = true
	}

	//update the plugin status to the mongoDB
	update := bson.M{
		"$set": bson.M{
			"process":    "completed",
			"results":    map[string]interface{}{"qualified": qualified, "acceptable": acceptable, "rejected": 10},
			"updated_at": time.Now(),
		},
	}

	_, err = collection.UpdateOne(ctx, filter, update)
	if err != nil {
		return &proto.ExecutionStatus{Success: false, Message: "Failed to update plugin"}, err
	}

	return &proto.ExecutionStatus{Success: success, Message: message, Results: map[string]string{
		"qualified":       strconv.Itoa(qualified),
		"acceptable":      strconv.Itoa(acceptable),
		"rejected":        strconv.Itoa(rejected),
		"total":           strconv.Itoa(totalCount),
		"userRequirement": strconv.Itoa(userRequirement)}}, nil
}

// UnregisterPlugin deactivates the grading plugin
func (s *GradingPluginServer) UnregisterPlugin(ctx context.Context, req *proto.PluginUnregister) (*proto.UnregisterResponse, error) {
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

// start the grading plugin
func main() {

	lis, err := net.Listen("tcp", ":50052")
	if err != nil {
		log.Fatalf("failed to listen: %v", err)
	}
	grpcServer := grpc.NewServer()
	mongo.ConnectMongoDB()
	proto.RegisterGradingPluginServer(grpcServer, &GradingPluginServer{})

	log.Println("gRPC server is running on port 50052")
	if err := grpcServer.Serve(lis); err != nil {
		log.Fatalf("Failed to serve: %v", err)
	}
}
