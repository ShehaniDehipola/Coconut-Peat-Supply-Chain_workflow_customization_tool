import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Heatmap, XAxis as XAxisHeatmap, YAxis as YAxisHeatmap, Tooltip as TooltipHeatmap } from 'recharts';
import { useUser } from '../../context/UserContext';
import axios from "axios";

const Container = styled.div`
  padding: 20px;
  max-width: 1200px;
  margin: auto;
`;

const WorkflowHeader = styled.h2`
  text-align: flex-start;
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 10px;
  margin-bottom: 30px;
`;

const MetricsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 20px;
  padding: 10px;
  background: #f8f9fa;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const WorkflowContainer = styled.div`
  padding: 10px;
  background: #e9ecef;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;


const MetricCard = styled.div`
  flex: 1;
  padding: 12px;
  background-color: rgba(45, 49, 66, 0.2);
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

const MainContent = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  margin-bottom: 20px;
`;

const WorkflowList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const WorkflowCard = styled.div`
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  background: white;
  display: flex;
  justify-content: space-between;
  align-items: center;
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

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: ${({ status }) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      default:
        return '#6c757d';
    }
  }};
`;

const WorkerHeatmapContainer = styled.div`
  margin-top: 20px;
`;

export const ManufacturerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    console.log("User from Context:", user);
  }, [user]);

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

  // useEffect(() => {
  //   setWorkflows([
  //     { name: 'Workflow A', stepsCompleted: 2, totalSteps: 4 ,  status: 'Pending'},
  //     { name: 'Workflow B', stepsCompleted: 3, totalSteps: 5,  status: 'Pending'},
  //   ]);
  // }, []);

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
    <Container>
      <WorkflowHeader>Dashboard</WorkflowHeader>
      <MetricsContainer>
        <MetricCard type="Total">
          <h3>Total Workflows</h3>
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

      <MainContent>
      <WorkflowContainer>
          <h3>New Workflows Assigned</h3>
          <WorkflowList>
            {workflows.length > 0 ? (
          workflows.map((wf) => (
            <WorkflowCard key={wf.workflow_id}>
              <div>
                <p>{wf.workflow_id}</p> 
              </div>
              <StatusBadge status="pending">Pending</StatusBadge>
              {/* <Button onClick={() => alert(`View Workflow ${wf.workflow_id}`)}>View</Button> */}
            </WorkflowCard>
          ))
        ) : (
          <p>No pending workflows found.</p>
        )}

          </WorkflowList>
        </WorkflowContainer>
      {/* {workflows.map((workflow, index) => (
        <WorkflowCard key={index}>
          <div>
            <h3>{workflow.name}</h3>
            <p>Steps Completed: {workflow.stepsCompleted} / {workflow.totalSteps}</p>
          </div>
          <Button onClick={() => updateWorkflowStatus(index)}>Start</Button>
        </WorkflowCard>
      ))} */}

        <div>
          
        
      <h3>Production Efficiency Over Time</h3>
      <ResponsiveContainer width="100%" height={300}>
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
          </div>

      </MainContent>

      <WorkerHeatmapContainer>

      <h3>Worker Productivity Heatmap</h3>
      <table width="100%" height={300}>
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
      </WorkerHeatmapContainer>
    </Container>
  );
};
