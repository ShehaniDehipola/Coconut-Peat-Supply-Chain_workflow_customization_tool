package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
)

// Structs for Workflow JSON
type Node struct {
	ID       int    `json:"id"`
	Key      int    `json:"key"`
	Type     string `json:"type"`
	Category string `json:"category"`
	Label    string `json:"label"`
	Text     string `json:"text"`
}

type Link struct {
	From      int    `json:"from"`
	To        int    `json:"to"`
	Condition string `json:"condition,omitempty"`
}

type Workflow struct {
	PluginName string `json:"plugin_name"`
	Nodes      []Node `json:"nodes"`
	Links      []Link `json:"links"`
}

// Fetch Workflow JSON from Node.js API
func fetchWorkflow(pluginName string) (*Workflow, error) {
	url := "http://localhost:5000/api/plugin/get/" + pluginName
	resp, err := http.Get(url)
	if err != nil {
		return nil, fmt.Errorf("failed to fetch workflow: %v", err)
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed to read response: %v", err)
	}

	var result struct {
		Success bool      `json:"success"`
		Data    *Workflow `json:"data"`
	}
	if err := json.Unmarshal(body, &result); err != nil {
		return nil, fmt.Errorf("failed to parse JSON: %v", err)
	}

	if !result.Success {
		return nil, fmt.Errorf("workflow not found")
	}

	return result.Data, nil
}

// Generate Go Code from Workflow JSON
func generateGoCode(workflow *Workflow) string {
	code := fmt.Sprintf(`
package main

import (
	"context"
	"fmt"
	"log"
)

// ExecutePlugin dynamically executes the plugin logic
func ExecutePlugin(ctx context.Context, pluginName string) {
	log.Println("Executing Plugin:", pluginName)

	currentStep := "Start"
	for {
		fmt.Println("Executing Step:", currentStep)

		switch currentStep {`)

	// Loop through each node and generate Go code
	for _, node := range workflow.Nodes {
		if node.Type == "Decision" {
			code += fmt.Sprintf(`
		case "%s":
			if userRequirement <= 20 {
				currentStep = "%s"
			} else {
				currentStep = "%s"
			}`, node.Label, findNextNode(workflow, node.ID, "Yes"), findNextNode(workflow, node.ID, "No"))
		} else {
			code += fmt.Sprintf(`
		case "%s":
			fmt.Println("%s")
			currentStep = "%s"`, node.Label, node.Text, findNextNode(workflow, node.ID, ""))
		}
	}

	code += `
		case "End":
			fmt.Println("Workflow Execution Completed.")
			return
		}
	}
}`
	return code
}

// Find Next Node
func findNextNode(workflow *Workflow, currentID int, condition string) string {
	for _, link := range workflow.Links {
		if link.From == currentID {
			if condition == "" || link.Condition == condition {
				for _, node := range workflow.Nodes {
					if node.ID == link.To {
						return node.Label
					}
				}
			}
		}
	}
	return "End"
}

