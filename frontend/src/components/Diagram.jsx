import React, { useEffect } from "react";
import * as go from "gojs";

const Diagram = () => {
  useEffect(() => {
    const $ = go.GraphObject.make;

    // Initialize the main diagram
    const diagram = $(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true, // Enable undo/redo
      "linkingTool.isEnabled": true, // Allow link creation
      "relinkingTool.isEnabled": true, // Allow relinking
      layout: $(go.LayeredDigraphLayout, { direction: 90 }), // Vertical layout
      allowDrop: true, // Allow dropping from the palette
    });

    // Node Template for Flowchart Shapes
    diagram.nodeTemplateMap.add(
      "",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "RoundedRectangle", {
          fill: "lightblue",
          stroke: "black",
          strokeWidth: 2,
          portId: "", // This makes the shape the port
          fromLinkable: true, // Allow links from this shape
          toLinkable: true, // Allow links to this shape
          cursor: "pointer",
        }),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    // Specialized Node Templates
    diagram.nodeTemplateMap.add(
      "Start",
      $(go.Node, "Auto", { locationSpot: go.Spot.Center },
        $(go.Shape, "Ellipse", {
          fill: "green",
          stroke: "black",
          portId: "",
          fromLinkable: true,
          toLinkable: false,
          cursor: "pointer",
        }),
        $(go.TextBlock, { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    diagram.nodeTemplateMap.add(
      "End",
      $(go.Node, "Auto", { locationSpot: go.Spot.Center },
        $(go.Shape, "Ellipse", {
          fill: "red",
          stroke: "black",
          portId: "",
          fromLinkable: false,
          toLinkable: true,
          cursor: "pointer",
        }),
        $(go.TextBlock, { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    diagram.nodeTemplateMap.add(
      "Decision",
      $(go.Node, "Auto", { locationSpot: go.Spot.Center },
        $(go.Shape, "Diamond", {
          fill: "yellow",
          stroke: "black",
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        }),
        $(go.TextBlock, { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
      );
      
    //  diagram.nodeTemplateMap.add(
    //   "Comment",
    //   new go.Node("Auto").add(
    //     new go.Shape("File", { strokeWidth: 3 }).set({ fill: "lightyellow" }), // Use the File shape
    //     new go.TextBlock("Comment", { editable: true }) // Add editable text
    //       .bind("text")
    //   )
    // );

    // Link Template with Labels
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        reshapable: true,
        resegmentable: true,
      },
      $(go.Shape), // Link path
      $(go.Shape, { toArrow: "Standard" }), // Arrowhead
      $(
        go.TextBlock,
        {
          segmentOffset: new go.Point(0, -10), // Position text above the link
          editable: true, // Allow editing of the link label
        },
        new go.Binding("text", "text").makeTwoWay() // Bind the text to the link's model data
      )
    );

    // Initialize the Palette
    const palette = $(go.Palette, "myPaletteDiv", {
      nodeTemplateMap: diagram.nodeTemplateMap, // Use the same node templates
      model: new go.GraphLinksModel([
        { text: "Start", category: "Start" },
        { text: "Process", category: "" },
        { text: "Decision", category: "Decision" },
        { text: "End", category: "End" },
      ]),
    });

    // Set up the model for the main diagram
    diagram.model = new go.GraphLinksModel(
      [
      
      ],
      [
        { from: "Start", to: "Decision", text: "Yes" },
        { from: "Decision", to: "End", text: "No" },
      ]
    );

    return () => {
      diagram.div = null; // Cleanup
      palette.div = null; // Cleanup
    };
  }, []);

  return (
    <div style={{ display: "flex" }}>
      <div
        id="myPaletteDiv"
        style={{
          width: "150px",
          height: "600px",
          border: "1px solid black",
          marginRight: "10px",
        }}
      ></div>
      <div
        id="myDiagramDiv"
        style={{ flex: 1, height: "600px", border: "1px solid black" }}
      ></div>
    </div>
  );
};

export default Diagram;
