import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Layout from '../MainLayout';
import Header from '../Header';

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
  padding: 5px 10px;
  border-radius: 12px;
  color: #fff;
  font-size: 13px;
  font-weight: 600;
  color: #fff;
  background-color: ${({ status }) => {
  switch (status.toLowerCase()) {
    case 'pending': return '#ffc107';
    case 'in progress': return '#17a2b8';
    case 'completed': return '#28a745';
    default: return '#6c757d';
  }
}};

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

const SearchInput = styled.input`
  padding: 0.3rem;
`;

const SelectFilter = styled.select`
  padding: 0.3rem;
`;

const DateFilterContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const ManufacturerWorkflowsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  useEffect(() => {
    axios
      .get('http://localhost:5000/api/workflow')
      .then((response) => {
      const filteredWorkflows = response.data.filter(
        (wf) => wf.manufacturer_id === user.user_id
      ).map((wf) => {
        const latestVersion = wf.versions[wf.versions.length - 1]; // assume last version is current
        return {
          ...wf,
          currentStatus: latestVersion.status,
          progress: latestVersion.status === 'completed'
            ? 100
            : latestVersion.status === 'in progress'
              ? 50
              : 25
        };
      });
      setWorkflows(filteredWorkflows);
    })
    .catch((error) => {
      console.error('Error fetching workflows:', error);
    });
}, [user]);

  const filteredWorkflows = useMemo(() => {
  return workflows.filter((wf) => {
    const matchesSearch = wf.workflow_id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter ? wf.currentStatus === statusFilter.toLowerCase() : true;
    const wfDate = new Date(wf.created_at);
    const fromDate = dateFrom ? new Date(dateFrom) : null;
    const toDate = dateTo ? new Date(dateTo) : null;
    const inRange = (!fromDate || wfDate >= fromDate) && (!toDate || wfDate <= toDate);
    return matchesSearch && matchesStatus && inRange;
  });
}, [workflows, searchTerm, statusFilter, dateFrom, dateTo]);


  // Compute workflow counts
  const totalCount = workflows.length;
const pendingCount = workflows.filter(wf => wf.currentStatus === 'pending').length;
const inProgressCount = workflows.filter(wf => wf.currentStatus === 'in progress').length;
const completedCount = workflows.filter(wf => wf.currentStatus === 'completed').length;

    
    const viewWorkflowDetails = (workflow_id) => {
    navigate(`/each-workflow/${workflow_id}`)
  };

  return (
    <Layout role="manufacturer">
    <PageContainer>
      <Header title="Workflows List" role="manufacturer"/>

      {/* Summary Boxes */}
      <SubHeader>
        <SummaryBox type="Total">Total {totalCount}</SummaryBox>
        <SummaryBox type="Pending">Pending {pendingCount}</SummaryBox>
        <SummaryBox type="InProgress">In Progress {inProgressCount}</SummaryBox>
        <SummaryBox type="Completed">Completed {completedCount}</SummaryBox>
        <SearchInput type="text" placeholder="Search..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
          <SelectFilter value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="Pending">Pending</option>
            <option value="In Progress">In Progress</option>
            <option value="Completed">Completed</option>
          </SelectFilter>
          <DateFilterContainer>
            <label>From:</label>
            <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} />
            <label>To:</label>
            <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} />
          </DateFilterContainer>
      </SubHeader>

      {/* Workflows Table */}
      <StyledTable>
        <thead>
          <tr>
            <TableHeaderCell>Workflow ID</TableHeaderCell>
            <TableHeaderCell>Workflow Name</TableHeaderCell>
            <TableHeaderCell>Exporter ID</TableHeaderCell>
            <TableHeaderCell>Date Created</TableHeaderCell>
            <TableHeaderCell>Status</TableHeaderCell>
            <TableHeaderCell>Progress</TableHeaderCell>
            <TableHeaderCell>Action</TableHeaderCell>
          </tr>
        </thead>
        <tbody>
          {filteredWorkflows.map((wf) => (
            <TableRow key={wf._id}>
              <TableCell>{wf.workflow_id}</TableCell>
              <TableCell>{wf.workflow_name}</TableCell>
              <TableCell>{wf.exporter_id}</TableCell>
              <TableCell>{new Date(wf.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
  {wf.currentStatus ? (
    <StatusBadge status={wf.currentStatus}>
      {wf.currentStatus.charAt(0).toUpperCase() + wf.currentStatus.slice(1)}
    </StatusBadge>
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
                <Button onClick={() => viewWorkflowDetails(wf.workflow_id)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredWorkflows.length === 0 && (
            <NoDataRow>
              <TableCell colSpan={6}>No workflows found.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>
      </PageContainer>
      </Layout>
  );
};

export default ManufacturerWorkflowsPage;
