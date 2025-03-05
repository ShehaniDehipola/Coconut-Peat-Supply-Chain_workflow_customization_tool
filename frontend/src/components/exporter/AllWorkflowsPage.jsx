import React, { useState, useMemo, useEffect } from 'react';
import styled from 'styled-components';
import { useUser } from '../../context/UserContext';
import axios from 'axios'

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
// Main Component
//
const AllWorkflowsPage = () => {
  const { user } = useUser();
  const [allWorkflows, setAllWorkflows] = useState([]);
  const [exporterWorkflows, setExporterWorkflows] = useState([]); 

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [manufacturerFilter, setManufacturerFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  console.log("workflow exporter id: ", user.exporter_id)

  // 1) Fetch ALL workflows from the back end
  useEffect(() => {
    axios
      .get('http://localhost:5000/api/workflow')
      .then((response) => {
        console.log('Workflow data:', response.data);
        // "response.data" holds the JSON array
        setAllWorkflows(response.data);
      })
      .catch((error) => {
        console.error('Error fetching workflows:', error);
      });
  }, []);

  // 2) Whenever the allWorkflows or user changes, 
  //    filter out only the ones matching the current user's exporter_id
  useEffect(() => {
    if (!user || !user.exporter_id) return;

    const filtered = allWorkflows
    .filter((wf) => 
      wf.exporter_id === user.exporter_id &&  // Match exporter ID
      wf.versions.some((version) => version.status === 'pending') // Ensure at least one pending version exists
    )
    .map((wf) => ({
      ...wf,
      versions: wf.versions.filter((version) => version.status === 'pending'), // Keep only pending versions
    }));
    setExporterWorkflows(filtered);

    console.log("Pending workflows: ", exporterWorkflows)
  }, [allWorkflows, user]);

  // Compute totals
  const totalCount = exporterWorkflows.length;
  const pendingCount = exporterWorkflows.reduce((count, wf) => {
  return count + wf.versions.length; // Count only pending versions
}, 0);
  const inProgressCount = exporterWorkflows.filter((wf) => wf.status === 'In Progress').length;
  const completedCount = exporterWorkflows.filter((wf) => wf.status === 'Completed').length;

  // Filtered exporterWorkflows (by search, status, manufacturer, date range)
  const filteredWorkflows = useMemo(() => {
    return exporterWorkflows.filter((wf) => {
      // Filter by search term (check in workflowId or manufacturer name)
      const matchesSearch =
        wf.workflow_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.manufacturer_id.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter ? wf.status === statusFilter : true;

      // Filter by manufacturer
      const matchesManufacturer = manufacturerFilter
        ? wf.manufacturer_id === manufacturerFilter
        : true;

      // Filter by date range
      const wfDate = new Date(wf.dateCreated);
      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      const inRange =
        (!fromDate || wfDate >= fromDate) &&
        (!toDate || wfDate <= toDate);

      return matchesSearch && matchesStatus && matchesManufacturer && inRange;
    });
  }, [exporterWorkflows, searchTerm, statusFilter, manufacturerFilter, dateFrom, dateTo]);

  return (
    <PageContainer>
      <PageTitle>Workflows List</PageTitle>

      {/* Sub-header section */}
      <SubHeader>
        <SummaryBox type="Total">Total {totalCount}</SummaryBox>
        <SummaryBox type="Pending">Pending {pendingCount}</SummaryBox>
        <SummaryBox type="InProgress">In Progress {inProgressCount}</SummaryBox>
        <SummaryBox type="Completed">Completed {completedCount}</SummaryBox>

        {/* Search bar */}
        <SearchInput
          type="text"
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Filter by status */}
        <SelectFilter
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="In Progress">In Progress</option>
          <option value="Completed">Completed</option>
        </SelectFilter>

        {/* Filter by manufacturer */}
        <SelectFilter
          value={manufacturerFilter}
          onChange={(e) => setManufacturerFilter(e.target.value)}
        >
          <option value="">All Manufacturers</option>
          {/* Example manufacturer IDs could be deduced from your data */}
          <option value="M-101">M-101</option>
          <option value="M-102">M-102</option>
          {/* ... */}
        </SelectFilter>

        {/* Filter by date range */}
        <DateFilterContainer>
          <label>From:</label>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <label>To:</label>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
        </DateFilterContainer>
      </SubHeader>

      {/* Workflows table */}
      <StyledTable>
        <thead>
          <tr>
            <TableHeaderCell>Workflow ID</TableHeaderCell>
            <TableHeaderCell>Manufacturer (ID, Name)</TableHeaderCell>
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
              <TableCell>
                {wf.manufacturer_id}
              </TableCell>
              <TableCell>{new Date(wf.created_at).toLocaleDateString()}</TableCell>
              <TableCell>
                {/* Find the first pending version directly inside JSX */}
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
                <Button onClick={() => alert(`View ${wf.workflowId}`)}>
                  View
                </Button>
              </TableCell>
            </TableRow>
          ))}
          {filteredWorkflows.length === 0 && (
            <NoDataRow>
              <TableCell colSpan={7}>No workflows found.</TableCell>
            </NoDataRow>
          )}
        </tbody>
      </StyledTable>
    </PageContainer>
  );
};

export default AllWorkflowsPage;
