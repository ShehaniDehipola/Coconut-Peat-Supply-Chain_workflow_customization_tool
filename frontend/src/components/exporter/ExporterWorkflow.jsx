import React, { useEffect, useState } from "react";
import { useParams } from 'react-router-dom';
import styled from "styled-components";
import Layout from "../MainLayout";
import Header from "../Header";
import axios from "axios";
import { FaCheckCircle, FaSpinner, FaRegCircle } from "react-icons/fa";

const Container = styled.div`
   padding: 1rem;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-directiont: column;
  align-items: flex-start;
  margin-bottom: 20px;
`;

const Label = styled.span`
  font-weight: 600;
  color: #2D3142;
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
  background: ${(props) => (props.substep ? "#f8f9fa" : "white")};
`;

const StatusBadge = styled.span`
  padding: 5px 10px;
  border-radius: 10px;
  color: white;
  font-size: 13px;
  font-weight: 600;
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

const formatDateTime = (datetime) => {
  if (!datetime) return { date: '-', time: '-' };
  const dateObj = new Date(datetime);
  const date = dateObj.toLocaleDateString();
  const time = dateObj.toLocaleTimeString();
  return { date, time };
};

const getSubStepIcon = (status) => {
  switch (status) {
    case "completed": return <FaCheckCircle color="#28a745" />;
    case "in Progress": return <FaSpinner color="#ffc107" />;
    default: return <FaRegCircle color="#6c757d" />;
  }
};

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
     <Header title="Workflow Execution Summary"></Header>     
    <Container>
      <TitleContainer>
            <div><Label>Workflow ID: </Label> {workflow.workflow_id}</div>
          </TitleContainer>
          <TitleContainer>
        <div><Label>Assigned Manufacturer: </Label> {workflow.manufacturer_id}</div>
      </TitleContainer>
      <Table>
        <thead>
          <tr>
            <Th>Plugin Name</Th>
            <Th>Start Date</Th>
            <Th>Start Time</Th>
            <Th>Completed Date</Th>
            <Th>Completed Time</Th>
            <Th>Status</Th>
            <Th>Required Amount</Th>
            <Th>Notes</Th>
          </tr>
        </thead>
            <tbody>
          {steps.map((step, index) => {
            const start = formatDateTime(step.started_at);
            const completed = formatDateTime(step.completed_at);
            return (
              <React.Fragment key={index}>
                <Tr>
                  <Td>{step.pluginName}</Td>
                  <Td>{start.date}</Td>
                  <Td>{start.time}</Td>
                  <Td>{completed.date}</Td>
                  <Td>{completed.time}</Td>
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
                  step.sub_steps.map((subStep, subIndex) => {
                    const subStart = formatDateTime(subStep.started_at);
                    const subCompleted = formatDateTime(subStep.completed_at);
                    return (
                      <Tr key={`${index}-${subIndex}`} substep>
                        <Td> ↳ {subStep.name}</Td>
                        <Td>{subStart.date}</Td>
                        <Td>{subStart.time}</Td>
                        <Td>{subCompleted.date}</Td>
                        <Td>{subCompleted.time}</Td>
                        <Td>
                          {getSubStepIcon(subStep.status)}
                        </Td>
                      </Tr>
                    );
                  })}
              </React.Fragment>
            );
          })}    
        </tbody>
      </Table>
    </Container>
    </Layout>
  );
};

export default ExporterWorkflow;
