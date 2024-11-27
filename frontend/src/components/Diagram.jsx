import React, { useEffect, useRef } from "react";
import styled from "styled-components";
import * as go from "gojs";

const DiagramContainer = styled.div`
  position: relative;
  flex: 1;
  height: 600px;
  border-left: 1px solid black;
  border-right: 1px solid black;
`;

const DiagramDiv = styled.div`
  width: 100%;
  height: 100%;
`;

const Diagram = ({ onExport, model }) => {
  const diagramRef = useRef(null); // Use useRef to store the diagram instance

  useEffect(() => {
    const $ = go.GraphObject.make;

    // Initialize the Diagram
    const diagram = $(go.Diagram, "myDiagramDiv", {
      "undoManager.isEnabled": true,
      layout: $(go.LayeredDigraphLayout, { direction: 90 }),
      allowDrop: true,
    });

    // Save the diagram instance in the ref
    diagramRef.current = diagram;

    console.log("Diagram initialized:", diagramRef.current);

    // Node Templates
    diagram.nodeTemplateMap.add(
      "Start",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Ellipse", {
          fill: "green",
          stroke: "black",
          portId: "",
          fromLinkable: true,
          toLinkable: false,
          cursor: "pointer",
        }),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

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
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        }),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    diagram.nodeTemplateMap.add(
      "Decision",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Diamond", {
          fill: "yellow",
          stroke: "black",
          portId: "",
          fromLinkable: true,
          toLinkable: true,
          cursor: "pointer",
        }),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    diagram.nodeTemplateMap.add(
      "End",
      $(
        go.Node,
        "Auto",
        { locationSpot: go.Spot.Center },
        $(go.Shape, "Ellipse", {
          fill: "red",
          stroke: "black",
          portId: "",
          fromLinkable: false,
          toLinkable: true,
          cursor: "pointer",
        }),
        $(
          go.TextBlock,
          { margin: 8, editable: true },
          new go.Binding("text", "text").makeTwoWay()
        )
      )
    );

    // Link Template
    diagram.linkTemplate = $(
      go.Link,
      {
        routing: go.Link.AvoidsNodes,
        curve: go.Link.JumpOver,
        reshapable: true,
        resegmentable: true,
      },
      $(go.Shape),
      $(go.Shape, { toArrow: "Standard" }),
      $(
        go.TextBlock,
        { segmentOffset: new go.Point(0, -10), editable: true },
        new go.Binding("text", "text").makeTwoWay()
      )
    );

    // Initialize the Palette
    const palette = $(go.Palette, "myPaletteDiv", {
      nodeTemplateMap: diagram.nodeTemplateMap,
      layout: $(go.GridLayout, { wrappingColumn: 1 }), // Ensure shapes are vertically aligned
      contentAlignment: go.Spot.TopLeft, // Align shapes to the top-left corner
      initialContentAlignment: go.Spot.Center, // Center shapes initially
      padding: 30, // Add padding to avoid license notice overlap
      model: new go.GraphLinksModel([
        { category: "Start", text: "Start" },
        { category: "Process", text: "Process" },
        { category: "Decision", text: "Decision" },
        { category: "End", text: "End" },
      ]),
    });

    // Initial Model
    diagram.model = new go.GraphLinksModel([], []);

    // Update diagram model when `model` prop changes
    if (model) {
  // Transform `nodeDataArray` and `linkDataArray` for GoJS compatibility
  const formattedModel = {
    class: "GraphLinksModel",
    nodeDataArray: model.nodes.map((node) => ({
      key: node.id, // Unique identifier for each node
      category: node.category || "", // Category to match a node template
      text: node.text || "", // Text to display inside the node
    })),
    linkDataArray: model.links.map((link) => ({
      from: link.from, // Key of the source node
      to: link.to, // Key of the target node
      text: link.text || "", // Optional link label
    })),
  };

  // Update the diagram with the transformed model
  diagram.model = go.Model.fromJson(formattedModel);
}

    // Export the model as JSON
    const exportModel = () => {
      if (!diagramRef.current || !diagramRef.current.model) {
    console.error("Diagram or model is not initialized.");
    return;
  }
  
      const modelData = {
        nodes: diagram.model.nodeDataArray,
        links: diagram.model.linkDataArray,
      };
        console.log("Model:", JSON.stringify(modelData, null, 2));
        onExport(modelData);
    };

    // Attach the export function to a global variable
    window.exportModel = exportModel;

    console.log("Export model function attached to window:", window.exportModel);

    return () => {
      diagram.div = null;
      palette.div = null;
    };
  }, [onExport, model]);

  return (
    <div style={{ display: "flex" }}>
      {/* <div
        id="myPaletteDiv"
      ></div> */}
      <DiagramContainer>
        <DiagramDiv id="myDiagramDiv"></DiagramDiv>
      </DiagramContainer>
    </div>
  );
};

export default Diagram;
