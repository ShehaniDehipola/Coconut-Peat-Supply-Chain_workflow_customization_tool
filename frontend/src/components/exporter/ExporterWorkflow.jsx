import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import Layout from "../MainLayout";
import Header from "../Header";
import axios from "axios";

const Container = styled.div`
   padding: 1rem;
`;

const Title = styled.div`
  display: flex;
  flex-directiont: row;
  margin-bottom: 20px;
  font-size: 18px;
  font-weight: semi-bold;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const Th = styled.th`
  background: rgba(45, 49, 66, 0.2);
  color: #2D3142;
  padding: 10px;
  text-align: left;
`;

const Td = styled.td`
  padding: 10px;
  border: 1px solid #ddd;
`;

const Tr = styled.tr`
  background: ${(props) => (props.substep ? "#f9f9f9" : "white")};
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 5px;
  color: white;
  background: ${(props) => {
    switch (props.status) {
      case "Completed":
        return "#28a745";
      case "In Progress":
        return "#ffc107";
      case "Not Started":
        return "#6c757d";
      case "not_started":
        return "#6c757d"; // sub-steps might have "not_started"
      default:
        return "#dc3545"; // if there's a custom status or unknown
    }
  }};
`;

const LoadingContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
`;

const ErrorContainer = styled.div`
  text-align: center;
  margin-top: 50px;
  font-size: 18px;
  color: red;
`;

const ExporterWorkflow = () => {
   const { workflowId } = useParams();
  const [workflow, setWorkflow] = useState(null);
  const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    
    useEffect(() => {
    axios
      .get(`http://localhost:5000/api/workflow/${workflowId}`)
      .then((response) => {
        setWorkflow(response.data);
        console.log("Workflow details: ", workflow)
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching workflow details:", error);
        setError(error);
        setIsLoading(false);
      });
  }, [workflowId]);

  if (isLoading) {
    return <LoadingContainer>Loading workflow details...</LoadingContainer>;
  }

  if (error) {
    return <ErrorContainer>Error loading workflow details.</ErrorContainer>;
  }

  if (!workflow) {
    return <ErrorContainer>No workflow found.</ErrorContainer>;
    }
    
    // Assuming we want the pending version or the first version.
  // You can also pick a specific versionNumber if needed.
  const currentVersion =
    workflow.versions?.find((v) => v.status === "pending") ||
    workflow.versions?.[0];

  if (!currentVersion) {
    return <ErrorContainer>No version found for this workflow.</ErrorContainer>;
  }

  // We'll display the steps from this version
    const steps = currentVersion.steps || [];
    
    const getStepStatus = (step) => {
    if (!step.started_at) return "Not Started";
    if (step.started_at && !step.completed_at) return "In Progress";
    if (step.completed_at) return "Completed";
    return "Not Started";
    };
    

    return (
    <Layout role="exporter">
     <Header title="Workflow Details"></Header>     
    <Container>
      <Title>
        <div>Workflow ID: {workflow.workflow_id}</div>
        <div>Assigned Manufacturer:  {workflow.manufacturer_id}</div>
      </Title>
      <Table>
        <thead>
          <tr>
            <Th>Plugin Name</Th>
            <Th>Started Time</Th>
            <Th>Completed Time</Th>
            <Th>Status</Th>
            <Th>Required Amount</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
        <tbody>
           {steps.map((step, index) => (
            <React.Fragment key={index}>
              <Tr>
                <Td>{step.pluginName}</Td>
                <Td>{step.startedTime || "-"}</Td>
                <Td>{step.completedTime || "-"}</Td>
                <Td>
                  <StatusBadge status={getStepStatus(step)}>
                    {getStepStatus(step)}
                  </StatusBadge>
                       </Td>
                <Td>{step.required_amount ?? "-"}</Td>
                <Td>{step.notes || "-"}</Td>
              </Tr>
              {/* Sub-Step Rows */}
              {step.sub_steps &&
                step.sub_steps.map((subStep, subIndex) => (
                  <Tr key={`${index}-${subIndex}`} substep>
                    <Td> ↳ {subStep.name}</Td>
                    <Td>{subStep.started_at || "-"}</Td>
                    <Td>{subStep.completed_at || "-"}</Td>
                    <Td>
                      <StatusBadge status={subStep.status}>
                        {subStep.status}
                      </StatusBadge>
                    </Td>
                    <Td>-</Td>
                  </Tr>
                ))}
            </React.Fragment>
          ))}             
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default ExporterWorkflow;
