import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie, Bar } from 'react-chartjs-2';
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

const StatusLabel = styled.span`
  padding: 4px 8px;
  border-radius: 4px;
  color: white;
  font-weight: bold;
  background-color: ${(props) => {
    switch (props.status) {
      case 'Pending':
        return '#ffc107'; // Yellow
      case 'In Progress':
        return '#17a2b8'; // Blue
      case 'Completed':
        return '#28a745'; // Green
      default:
        return '#6c757d'; // Grey
    }
  }};
`;

const ChartContainer = styled.div`
  margin-bottom: 30px;
  width: 100%;
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

  const workflowStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
        backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
      },
    ],
  };

  return (
    <Container>
      <Header>
        <WorkflowHeader>Workflow Dashboard</WorkflowHeader>
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

      <MetricsContainer>
        <MetricCard>
          <h3>Total Workflows</h3>
          <p>{totalWorkflows}</p>
        </MetricCard>
        <MetricCard>
          <h3>Pending</h3>
          <p>{statusCounts.Pending}</p>
        </MetricCard>
        <MetricCard>
          <h3>In Progress</h3>
          <p>{statusCounts['In Progress']}</p>
        </MetricCard>
        <MetricCard>
          <h3>Completed</h3>
          <p>{statusCounts.Completed}</p>
        </MetricCard>
      </MetricsContainer>

      <ContentContainer>
        <MainContent>
          <div style={{ display: 'flex', gap: '20px' }}>
            <div style={{ flex: 1 }}>
              {filteredWorkflows.map((workflow, index) => (
                <WorkflowCard key={index}>
                  <div>
                    <h3>{workflow.name}</h3>
                    <p>ID: {workflow.id}</p>
                    <p>Date Sent: {workflow.dateSent}</p>
                    <StatusLabel status={workflow.status}>{workflow.status}</StatusLabel>
                  </div>
                  <Button>View Details</Button>
                </WorkflowCard>
              ))}
            </div>
            {/* <ChartContainer>
              <h3>Workflow Status Overview</h3>
              <Pie data={workflowStatusData} />
            </ChartContainer> */}
          </div>
          <TaskListContainer>
            <h3>Task List</h3>
            <p>Approve Workflow 1</p>
            <p>Review Manufacturer Updates for Workflow 2</p>
          </TaskListContainer>
        </MainContent>
        <SidebarContent>
          <ActivityFeed>
            <h3>Recent Activity</h3>
            {notifications.map((notification) => (
              <div key={notification.id}>
                <p>{notification.message}</p>
                <small>{notification.timestamp}</small>
              </div>
            ))}
          </ActivityFeed>
          <ManufacturerPerformanceContainer>
            <h3>Manufacturer Performance</h3>
            <p>Top Manufacturers: Manufacturer A, Manufacturer B</p>
            <p>Completion Rate: Manufacturer A - 95%, Manufacturer B - 90%</p>
          </ManufacturerPerformanceContainer>
          <CalendarContainer>
            <h3>Workflow Calendar</h3>
            <p>Workflow 1 - Due Date: 2024-11-20</p>
            <p>Workflow 2 - Due Date: 2024-11-25</p>
          </CalendarContainer>
        </SidebarContent>
      </ContentContainer>
    </Container>
  );
};
