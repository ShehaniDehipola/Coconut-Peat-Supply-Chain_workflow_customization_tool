import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heatmap, XAxis as XAxisHeatmap, YAxis as YAxisHeatmap, Tooltip as TooltipHeatmap } from 'recharts';
import { useUser } from '../../context/UserContext';
import axios from "axios";
import Layout from '../MainLayout';
import Header from '../Header';

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

const RightSection = styled.div`
  flex: 2;
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

const WorkflowContainer = styled.div`
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


export const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    if (!user || !user.user_id) return;

    axios
      .get(`http://localhost:5000/api/workflow?manufacturerId=${user.user_id}`)
      .then((response) => {
        console.log('Fetched Workflows:', response.data);

        const pendingWorkflows = response.data
          .filter((wf) => wf.manufacturer_id === user.user_id)
          .map((wf) => ({
            ...wf,
            versions: wf.versions.filter((version) => version.status === 'pending'),
          }))
          .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

        setWorkflows(pendingWorkflows.slice(0, 3));
      })
      .catch((error) => console.error('Error fetching workflows:', error));
  }, [user]);

  const totalWorkflows = workflows.length;
  const statusCounts = Array.isArray(workflows)
  ? workflows.reduce((acc, workflow) => {
      acc[workflow.status] = (acc[workflow.status] || 0) + 1;
      return acc;
    }, { Pending: 0, 'In Progress': 0, Completed: 0 })
  : { Pending: 0, 'In Progress': 0, Completed: 0 };


  const workflowStatusData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        data: [statusCounts.Pending, statusCounts['In Progress'], statusCounts.Completed],
        backgroundColor: ['#ffc107', '#17a2b8', '#28a745'],
      },
    ],
  };

   const updateWorkflowStatus = (index) => {
    navigate("/each-workflow")
  };

  const productionEfficiencyData = [
  { date: "Feb 1", Grading: 20, Cutting: 25, Washing: 18, Drying: 22 },
  { date: "Feb 2", Grading: 18, Cutting: 22, Washing: 16, Drying: 20 },
  { date: "Feb 3", Grading: 22, Cutting: 27, Washing: 19, Drying: 23 },
  { date: "Feb 4", Grading: 17, Cutting: 21, Washing: 15, Drying: 19 },
  { date: "Feb 5", Grading: 23, Cutting: 28, Washing: 20, Drying: 24 }
];

const workerProductivityData = [
  { worker: "Worker A", day1: 5, day2: 7, day3: 6, day4: 8, day5: 4 },
  { worker: "Worker B", day1: 4, day2: 5, day3: 7, day4: 6, day5: 9 },
  { worker: "Worker C", day1: 6, day2: 8, day3: 5, day4: 7, day5: 6 },
  { worker: "Worker D", day1: 3, day2: 6, day3: 8, day4: 5, day5: 7 },
  { worker: "Worker E", day1: 7, day2: 5, day3: 6, day4: 8, day5: 4 }
];

  return (
    <Layout role="manufacturer">
      <Header title="Dashboard" role="manufacturer" />
      <Container>
        <LeftSection>
          <MetricsContainer>
            <MetricCard type="Total">Total: {totalWorkflows}</MetricCard>
            <MetricCard type="Pending">Pending: {statusCounts.Pending || 0}</MetricCard>
            <MetricCard type="InProgress">In Progress: {statusCounts['In Progress'] || 0}</MetricCard>
            <MetricCard type="Completed">Completed: {statusCounts.Completed || 0}</MetricCard>
          </MetricsContainer>
          <ChartContainer>
            <Title>Workers Productivity </Title>
            <table width="100%" height={200}>
        <tbody>
          {workerProductivityData.map((row, index) => (
            <tr key={index}>
              <td>{row.worker}</td>
              {[row.day1, row.day2, row.day3, row.day4, row.day5].map((value, i) => (
                <td key={i} style={{ backgroundColor: `rgba(216, 149, 39, ${value / 10})` }}>{value}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
          </ChartContainer>
          <WorkflowContainer>
            <Title>Alerts</Title>
            <p>No alerts at this time.</p>
          </WorkflowContainer>
        </LeftSection>

        <RightSection>
          <ChartContainer>
            <Title>Production Efficiency Over Time</Title>
            <ResponsiveContainer width="100%" height={200}>
        <LineChart data={productionEfficiencyData} margin={{ top: 10, right: 30, left: 0, bottom: 10 }}>
          <CartesianGrid strokeDasharray="3 5" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="Grading" stroke="#8884d8" />
          <Line type="monotone" dataKey="Cutting" stroke="#82ca9d" />
          <Line type="monotone" dataKey="Washing" stroke="#ffc658" />
          <Line type="monotone" dataKey="Drying" stroke="#ff7300" />
        </LineChart>
          </ResponsiveContainer>
          </ChartContainer>
          <WorkflowContainer>
            <Title>Assigned Workflows</Title>
            <ScrollableWorkflowList>
              {workflows.map((workflow) => (
                <WorkflowItem key={workflow.id}>
                  <span>{workflow.workflow_id}</span>
                  <Button onClick={() => alert(`View ${workflow.workflowId}`)}>
                  View
                </Button>
                </WorkflowItem>
              ))}
            </ScrollableWorkflowList>
          </WorkflowContainer>
        </RightSection>
      </Container>
    </Layout>
  );
};
