import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from '../Header';
import Layout from '../MainLayout';

const Container = styled.div`
  display: flex;
  padding: 20px;
  max-width: 1400px;
  margin: auto;
  gap: 20px;
`;

const Title = styled.h1`
  font-size: 18px;
  font-weight: bold;
  color: #2D3142; 
  margin-bottom: 20px;
`;

const LeftSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MiddleSection = styled.div`
  flex: 2;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const RightSection = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const MetricsContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
`;

const MetricCard = styled.div`
  padding: 10px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  ${({ type }) => {
    switch (type) {
      case 'Total':
        return `border: 2px solid #dc3545; color: #dc3545;`;
      case 'Pending':
        return `border: 2px solid #ffc107; color: #ffc107;`;
      case 'InProgress':
        return `border: 2px solid #17a2b8; color: #17a2b8;`;
      case 'Completed':
        return `border: 2px solid #28a745; color: #28a745;`;
      default:
        return `border: 2px solid #6c757d; color: #6c757d;`;
    }
  }}
`;

const ChartContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WorkflowTableContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ScrollableWorkflowList = styled.div`
  max-height: 260px;
  overflow-y: auto;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  background-color: #f8f9fa;
`;

const WorkflowItem = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid #ddd;
`;

const StatusLabel = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  background-color: ${(props) => {
    switch (props.status) {
      case 'Pending': return '#ffc107';
      case 'In Progress': return '#17a2b8';
      case 'Completed': return '#28a745';
      default: return '#6c757d';
    }
  }};
`;

const Button = styled.button`
  margin: 5px;
  padding: 8px 20px;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  background-color: #2D3142;
  color: #fff;
  border: none;
`;

export const WorkflowOverview = () => {
  const [workflows, setWorkflows] = useState([
      { id: '1', name: 'Workflow 1', dateSent: '2024-11-10', status: 'Pending' },
      { id: '2', name: 'Workflow 2', dateSent: '2024-11-12', status: 'In Progress' },
      { id: '3', name: 'Workflow 3', dateSent: '2024-11-15', status: 'Completed' },
      { id: '4', name: 'Workflow 4', dateSent: '2024-11-18', status: 'Pending' },
  ]);

  const statusCounts = workflows.reduce(
    (acc, workflow) => {
      acc[workflow.status] = (acc[workflow.status] || 0) + 1;
      return acc;
    },
    { Pending: 0, 'In Progress': 0, Completed: 0 }
  );

  // Pie Chart - Workflow Status Overview
const workflowStatusData = {
  labels: ['Pending', 'In Progress', 'Completed'],
  datasets: [
    {
      data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
      backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
    },
  ],
};

  // Line Chart - Order Processing Time Over the Last 5 Months
const orderProcessingTimeData = {
  labels: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb'],
  datasets: [
    {
      label: 'Average Processing Time (days)',
      data: [12, 10, 15, 9, 11], // Sample Data
      borderColor: '#2D3142',
      backgroundColor: 'rgba(45, 49, 66, 0.2)',
      fill: true,
    },
  ],
  };
  
  // Bar Chart - Supplier Performance Comparison
const supplierPerformanceData = {
  labels: ['Supplier A', 'Supplier B', 'Supplier C', 'Supplier D'],
  datasets: [
    {
      label: 'On-Time Deliveries',
      data: [90, 85, 95, 80], // Sample Data (percentage)
      backgroundColor: '#2D3142',
    },
    {
      label: 'Rejection Rate (%)',
      data: [5, 7, 3, 10], // Sample Data (percentage)
      backgroundColor: '#d89527',
    },
  ],
};

  return (
    <Layout role="exporter">
      <Header title="Dashboard" />
      <Container>
        <LeftSection>
          <MetricsContainer>
            <MetricCard type="Total">Total: {workflows.length}</MetricCard>
            <MetricCard type="Pending">Pending: {statusCounts.Pending || 0}</MetricCard>
            <MetricCard type="InProgress">In Progress: {statusCounts['In Progress'] || 0}</MetricCard>
            <MetricCard type="Completed">Completed: {statusCounts.Completed || 0}</MetricCard>
          </MetricsContainer>
          <WorkflowTableContainer>
            <Title>Workflows</Title>
            <ScrollableWorkflowList>
              {workflows.map((workflow) => (
                <WorkflowItem key={workflow.id}>
                  <span>{workflow.id}</span>
                  <StatusLabel status={workflow.status}>{workflow.status}</StatusLabel>
                </WorkflowItem>
              ))}
            </ScrollableWorkflowList>
          </WorkflowTableContainer>
        </LeftSection>

        <MiddleSection>
          <ChartContainer>
            <Title>Order Processing Time</Title>
            <Line data={orderProcessingTimeData} />
          </ChartContainer>
          <ChartContainer>
            <Title>Manufacturers Performance</Title>
            <Bar data={supplierPerformanceData} />
          </ChartContainer>
        </MiddleSection>

        <RightSection>
          <ChartContainer>
            <Title>Workflow Status Overview</Title>
            <Pie data={workflowStatusData} />
          </ChartContainer>
          <WorkflowTableContainer>
            <Title>Delayed Workflows</Title>
            <ScrollableWorkflowList>
              {workflows.filter(w => w.status === 'Pending').map((workflow) => (
                <WorkflowItem key={workflow.id}>
                  <span>{workflow.id}</span>
                  <Button>View</Button>
                </WorkflowItem>
              ))}
            </ScrollableWorkflowList>
          </WorkflowTableContainer>
        </RightSection>
      </Container>
    </Layout>
  );
};
