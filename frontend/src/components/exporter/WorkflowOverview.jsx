import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
`;

const MetricsContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const MetricCard = styled.div`
  flex: 1;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  text-align: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);

  /* Dynamically change border and background color based on type */
  ${({ type }) => {
    switch (type) {
      case 'Total':
        return `border: 2px solid #dc3545; background-color: rgba(220, 53, 69, 0.1); color: #dc3545;`; // Red for Total Orders
      case 'Pending':
        return `border: 2px solid #ffc107; background-color: rgba(255, 193, 7, 0.1); color: #ffc107;`; // Yellow for Pending
      case 'InProgress':
        return `border: 2px solid #17a2b8; background-color: rgba(23, 162, 184, 0.1); color: #17a2b8;`; // Blue for In Progress
      case 'Completed':
        return `border: 2px solid #28a745; background-color: rgba(40, 167, 69, 0.1); color: #28a745;`; // Green for Completed
      default:
        return `border: 2px solid #6c757d; background-color: rgba(108, 117, 125, 0.1); color: #6c757d;`; // Grey for default
    }
  }}
`;

const ContentContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
`;

const MainContent = styled.div`
  flex: 2;
`;

const SidebarContent = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const WorkflowCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const WorkflowHeader = styled.h2`
  text-align: center;
`;

const Button = styled.button`
  background-color: #2D3142;
  color: white;
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const FiltersContainer = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Select = styled.select`
  padding: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

// const StatusLabel = styled.span`
//   padding: 4px 8px;
//   border-radius: 4px;
//   color: white;
//   font-weight: bold;
//   background-color: ${(props) => {
//     switch (props.status) {
//       case 'Pending':
//         return '#ffc107'; // Yellow
//       case 'In Progress':
//         return '#17a2b8'; // Blue
//       case 'Completed':
//         return '#28a745'; // Green
//       default:
//         return '#6c757d'; // Grey
//     }
//   }};
// `;

const ChartRow = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const ChartContainer = styled.div`
  flex: 1;
  min-width: 300px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  canvas {
    max-width: 100%;
    max-height: 300px;
  }
`;


/* Flex container for workflows and supplier chart */
const WorkflowChartContainer = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 30px;
  align-items: stretch; /* Ensures equal height */
`;

const WorkflowTableContainer = styled.div`
  flex: 1;
  max-width: 55%;
  min-width: 400px;
  height: 350px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  overflow: hidden;
`;

const SupplierChartContainer = styled.div`
  flex: 1;
  max-width: 45%;
  min-width: 300px;
  height: 350px;
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

const ActivityFeed = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const ManufacturerPerformanceContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const CalendarContainer = styled.div`
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const TaskListContainer = styled.div`
  margin-top: 30px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

/* Styled status label */
const StatusLabel = styled.span`
  padding: 6px 12px;
  border-radius: 12px;
  font-size: 12px;
  font-weight: bold;
  color: white;
  text-align: center;
  white-space: nowrap;

  background-color: ${(props) => {
    switch (props.status) {
      case 'Pending':
        return '#ffc107'; /* Yellow */
      case 'In Progress':
        return '#17a2b8'; /* Blue */
      case 'Completed':
        return '#28a745'; /* Green */
      default:
        return '#6c757d'; /* Grey */
    }
  }};
`;

export const WorkflowOverview = () => {
  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    // Fetch workflows from the database (mock data for now)
    setWorkflows([
      { id: '1', name: 'Workflow 1', dateSent: '2024-11-10', status: 'Pending' },
      { id: '2', name: 'Workflow 2', dateSent: '2024-11-12', status: 'In Progress' },
      { id: '3', name: 'Workflow 3', dateSent: '2024-11-15', status: 'Completed' },
      { id: '4', name: 'Workflow 4', dateSent: '2024-11-18', status: 'Pending' },
    ]);

    // Fetch notifications (mock data for now)
    setNotifications([
      { id: 'n1', message: 'Workflow 2 has been updated by the manufacturer', timestamp: '2024-11-18 10:00 AM' },
      { id: 'n2', message: 'Workflow 3 has been marked as completed', timestamp: '2024-11-18 11:00 AM' },
    ]);
  }, []);

  const filteredWorkflows = workflows.filter((workflow) => {
    return (
      (searchTerm === '' || workflow.name.toLowerCase().includes(searchTerm.toLowerCase()) || workflow.id.includes(searchTerm)) &&
      (statusFilter === '' || workflow.status === statusFilter)
    );
  });

  const totalWorkflows = workflows.length;
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
    <Container>
      <Header>
        <h2>Dashboard</h2>
        <FiltersContainer>
          <Input
            type="text"
            placeholder="Search by name or ID"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </Select>
        </FiltersContainer>
      </Header>

      {/* Metrics Cards */}
      <MetricsContainer>
        <MetricCard type="Total">
          <h3>Total Orders</h3>
          <p>{totalWorkflows}</p>
        </MetricCard>
        <MetricCard type="Pending">
          <h3>Pending</h3>
          <p>{statusCounts.Pending}</p>
        </MetricCard>
        <MetricCard type="InProgress">
          <h3>In Progress</h3>
          <p>{statusCounts['In Progress']}</p>
        </MetricCard>
        <MetricCard type="Completed">
          <h3>Completed</h3>
          <p>{statusCounts.Completed}</p>
        </MetricCard>
      </MetricsContainer>

      {/* Order Processing Time & Workflow Status Charts Side by Side */}
      <ChartRow>
        <ChartContainer>
          <h3>Order Processing Time</h3>
          <Line data={orderProcessingTimeData} />
        </ChartContainer>

        <ChartContainer>
          <h3>Workflow Status Overview</h3>
          <Pie data={workflowStatusData} />
        </ChartContainer>
      </ChartRow>

      {/* Workflow List & Supplier Performance Side by Side */}
      <WorkflowChartContainer>
        <WorkflowTableContainer>
          <h3>Workflows</h3>
          <ScrollableWorkflowList>
            {workflows.map((workflow) => (
              <WorkflowItem key={workflow.id}>
                <span>{workflow.name}</span>
                <StatusLabel status={workflow.status}>{workflow.status}</StatusLabel>
              </WorkflowItem>
            ))}
          </ScrollableWorkflowList>
        </WorkflowTableContainer>

        <SupplierChartContainer>
          <h3>Supplier Performance</h3>
          <Bar data={supplierPerformanceData} />
        </SupplierChartContainer>
      </WorkflowChartContainer>

      {/* Task List */}
      <TaskListContainer>
        <h3>Task List</h3>
        <p>✔ Approve Order 101</p>
        <p>✔ Review Supplier B’s Performance</p>
        <p>✔ Check Order 103 Status</p>
      </TaskListContainer>
      </Container>
  );
};
