import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Pie, Bar, Line } from 'react-chartjs-2';
import 'chart.js/auto';
import Header from '../Header';
import Layout from '../MainLayout';
import { useUser } from '../../context/UserContext';
import axios from 'axios';

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
  padding: 5px 10px;
  border-radius: 12px;
  font-size: 13px;
  font-weight: 600;
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
  const [workflows, setWorkflows] = useState([]);
  const {user} = useUser();
  const exporterId = user?.exporter_id;

  useEffect(() => {
    const fetchWorkflows = async () => {
      try {
        const res = await axios.get('http://localhost:5000/api/workflow');
        const filtered = res.data.filter(wf => wf.exporter_id === exporterId);
        setWorkflows(filtered);
      } catch (err) {
        console.error("Error loading workflows", err);
      }
    };
    if (exporterId) fetchWorkflows();
  }, [exporterId]);

  const statusCounts = workflows.reduce((acc, wf) => {
    const lastVer = wf.versions.at(-1);
    const rawStatus = lastVer?.status?.toLowerCase() || 'unknown';
const normalizedStatus =
  rawStatus === 'draft' ? 'in progress' :
  rawStatus === 'inprogress' ? 'in progress' :
  rawStatus;
acc[normalizedStatus] = (acc[normalizedStatus] || 0) + 1;
    return acc;
  }, {});

  const workflowStatusData = {
  labels: Object.keys(statusCounts),
  datasets: [
    {
      data: Object.values(statusCounts),
      backgroundColor: Object.keys(statusCounts).map(status => {
        switch (status) {
          case 'pending': return '#ffc107';
          case 'in progress': return '#17a2b8';
          case 'completed': return '#28a745';
          default: return '#6c757d';
        }
      }),
    },
  ],
};


const formatStatus = (status) => {
  switch (status?.toLowerCase()) {
    case 'pending': return 'Pending';
    case 'draft': return 'In Progress';
    case 'in progress': return 'In Progress';
    case 'completed': return 'Completed';
    default: return 'Unknown';
  }
};

const getStatusColor = (status) => {
  switch (status) {
    case 'Pending': return '#ffc107';
    case 'In Progress': return '#17a2b8';
    case 'Completed': return '#28a745';
    default: return '#6c757d';
  }
};


  const workflowsByMonth = {};
  workflows.forEach(wf => {
    const month = new Date(wf.created_at).toLocaleString('default', { month: 'short', year: 'numeric' });
    workflowsByMonth[month] = (workflowsByMonth[month] || 0) + 1;
  });

  const creationTrendData = {
    labels: Object.keys(workflowsByMonth),
    datasets: [
      {
        label: 'Workflows Created',
        data: Object.values(workflowsByMonth),
        fill: true,
        backgroundColor: 'rgba(45, 49, 66, 0.2)',
        borderColor: '#2D3142',
      },
    ],
  };

  const pluginUsage = {};
  workflows.forEach(wf => {
    wf.versions.forEach(ver => {
      ver.steps.forEach(step => {
        pluginUsage[step.pluginName] = (pluginUsage[step.pluginName] || 0) + 1;
      });
    });
  });

  const pluginUsageData = {
    labels: Object.keys(pluginUsage),
    datasets: [
      {
        label: 'Plugin Usage Count',
        data: Object.values(pluginUsage),
        backgroundColor: '#d89527',
      },
    ],
  };

  const workflowsByManufacturer = workflows.reduce((acc, wf) => {
    const manufacturer = wf.manufacturer_id || 'Unknown';
    acc[manufacturer] = (acc[manufacturer] || 0) + 1;
    return acc;
  }, {});

  const manufacturerData = {
    labels: Object.keys(workflowsByManufacturer),
    datasets: [
      {
        label: 'Workflows per Manufacturer',
        data: Object.values(workflowsByManufacturer),
        backgroundColor: '#2D3142',
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
            <MetricCard type="Pending">Pending: {statusCounts['pending'] || 0}</MetricCard>
            <MetricCard type="InProgress">In Progress: {statusCounts['in progress'] || 0}</MetricCard>
            <MetricCard type="Completed">Completed: {statusCounts['completed'] || 0}</MetricCard>
          </MetricsContainer>
          <WorkflowTableContainer>
            <Title>All Workflows</Title>
            <ScrollableWorkflowList>
              {workflows.map((workflow) => {
                const lastVersion = workflow.versions.at(-1);
                const statusLabel = formatStatus(lastVersion?.status);
                return (
                  <WorkflowItem key={workflow.workflow_id}>
                    <span>{workflow.workflow_name}</span>
                    <StatusLabel status={statusLabel}>{statusLabel}</StatusLabel>
                  </WorkflowItem>
                );
              })}
            </ScrollableWorkflowList>
          </WorkflowTableContainer>
        </LeftSection>

        <MiddleSection>
          <ChartContainer>
            <Title>Workflow Creation Trend</Title>
            <Line data={creationTrendData} />
          </ChartContainer>
          <ChartContainer>
            <Title>Plugin Usage Frequency</Title>
            <Bar data={pluginUsageData} />
          </ChartContainer>
        </MiddleSection>

        <RightSection>
          <ChartContainer>
            <Title>Workflow Status Overview</Title>
            <Pie data={workflowStatusData} />
          </ChartContainer>
          <WorkflowTableContainer>
            <Title>Workflows by Manufacturer</Title>
            <Bar data={manufacturerData} />
          </WorkflowTableContainer>
        </RightSection>
      </Container>
    </Layout>
  );
};
