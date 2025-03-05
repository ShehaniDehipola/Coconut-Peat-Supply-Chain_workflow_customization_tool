import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

//
// Styled Components
//
const PageContainer = styled.div`
  padding: 1rem;
`;

const PageTitle = styled.h1`
  margin: 0;
`;

const SubHeader = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 1rem;
`;

const SummaryBox = styled.div`
  font-weight: semi-bold;
  padding: 2px 10px;
  border-radius: 0.25rem;
  color: #fff;
  ${({ type }) => {
    switch (type) {
      case 'Total':
        return `border: 2px solid #dc3545; background-color: rgba(220, 53, 69, 0.1); color: #dc3545;`;
      case 'Pending':
        return `border: 2px solid #ffc107; background-color: rgba(255, 193, 7, 0.1); color: #ffc107;`;
      case 'InProgress':
        return `border: 2px solid #17a2b8; background-color: rgba(23, 162, 184, 0.1); color: #17a2b8;`;
      case 'Completed':
        return `border: 2px solid #28a745; background-color: rgba(40, 167, 69, 0.1); color: #28a745;`;
      default:
        return `border: 2px solid #6c757d; background-color: rgba(108, 117, 125, 0.1); color: #6c757d;`;
    }
  }}
`;

const StyledTable = styled.table`
  border-collapse: collapse;
  width: 100%;
`;

const TableHeaderCell = styled.th`
  border-bottom: 2px solid #ccc;
  padding: 0.5rem;
  background-color: rgba(45, 49, 66, 0.2);
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background-color: rgba(87, 88, 94, 0.1);
  }
`;

const TableCell = styled.td`
  border: 1px solid #ccc;
  padding: 0.5rem;
`;

const StatusBadge = styled.span`
  padding: 0.3rem 0.6rem;
  border-radius: 0.25rem;
  color: #fff;
  background-color: ${({ status }) => {
    switch (status) {
      case 'pending':
        return '#ffc107';
      case 'In Progress':
        return '#17a2b8';
      case 'Completed':
        return '#28a745';
      default:
        return '#6c757d';
    }
  }};
`;

const ProgressBarContainer = styled.div`
  background: #e0e0e0;
  border-radius: 4px;
  height: 10px;
  width: 100%;
`;

const ProgressBarFill = styled.div`
  height: 10px;
  border-radius: 4px;
  background: #2D3142;
  width: ${({ progress }) => progress}%;
`;

const NoDataRow = styled.tr`
  text-align: center;
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

//
// Manufacturer Workflows Component
//
const ManufacturerWorkflowsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/workflow')
      .then((response) => {
        console.log('Workflow data:', response.data);

        // Filter workflows where manufacturer_id matches the logged-in user and version status is 'pending'
        const filteredWorkflows = response.data
          .filter((wf) => 
            wf.manufacturer_id === user.user_id &&
            wf.versions.some((version) => version.status === 'pending')
          )
          .map((wf) => ({
            ...wf,
            versions: wf.versions.filter((version) => version.status === 'pending'),
          }));

        setWorkflows(filteredWorkflows);
      })
      .catch((error) => {
        console.error('Error fetching workflows:', error);
      });
  }, [user]);

  // Compute workflow counts
  const totalCount = workflows.length;
  const pendingCount = workflows.reduce((count, wf) => count + wf.versions.length, 0);
  const inProgressCount = workflows.filter((wf) => wf.status === 'In Progress').length;
  const completedCount = workflows.filter((wf) => wf.status === 'Completed').length;
    
    const updateWorkflowStatus = () => {
    navigate("/each-workflow")
  };

  return (
    <PageContainer>
      <PageTitle>Workflows List</PageTitle>

      {/* Summary Boxes */}
      <SubHeader>
        <SummaryBox type="Total">Total {totalCount}</SummaryBox>
        <SummaryBox type="Pending">Pending {pendingCount}</SummaryBox>
        <SummaryBox type="InProgress">In Progress {inProgressCount}</SummaryBox>
        <SummaryBox type="Completed">Completed {completedCount}</SummaryBox>
      </SubHeader>

      {/* Workflows Table */}
      <StyledTable>
        <thead>
          <tr>
            <TableHeaderCell>Workflow ID</TableHeaderCell>
            <TableHeaderCell>Exporter ID</TableHeaderCell>
            <TableHeaderCell>Date Created</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {workflows.map((wf) => (
            <TableRow key={wf._id}>
              <TableCell>{wf.workflow_id}</TableCell>
              <TableCell>{wf.exporter_id}</TableCell>
              <TableCell>{new Date(wf.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {wf.versions.find((version) => version.status === 'pending') ? (
                  <StatusBadge status="pending">Pending</StatusBadge>
                ) : (
                  <StatusBadge status="unknown">Unknown</StatusBadge>
                )}
              </TableCell>
              <TableCell>
                <ProgressBarContainer>
                  <ProgressBarFill progress={wf.progress} />
                </ProgressBarContainer>
              </TableCell>
              <TableCell>
                <Button onClick={() => updateWorkflowStatus()}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {workflows.length === 0 && (
            <NoDataRow>
              <TableCell colSpan={6}>No workflows found.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>
    </PageContainer>
  );
};

export default ManufacturerWorkflowsPage;
