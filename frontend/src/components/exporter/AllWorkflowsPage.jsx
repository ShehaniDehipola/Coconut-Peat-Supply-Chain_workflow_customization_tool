import React, { useState, useMemo, useEffect } from "react";
import styled from "styled-components";
import { useUser } from "../../context/UserContext";
import axios from "axios";
import Header from "../Header";
import Layout from "../MainLayout";
import { useNavigate } from "react-router-dom";

//
// Styled ComponentsMainSidebar
//
const PageContainer = styled.div`
  padding: 1rem;
`;

const PageTitle = styled.h2`
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
      case "Total":
        return `border: 2px solid #dc3545; background-color: rgba(220, 53, 69, 0.1); color: #dc3545;`; // Red for Total Orders
      case "Pending":
        return `border: 2px solid #ffc107; background-color: rgba(255, 193, 7, 0.1); color: #ffc107;`; // Yellow for Pending
      case "InProgress":
        return `border: 2px solid #17a2b8; background-color: rgba(23, 162, 184, 0.1); color: #17a2b8;`; // Blue for In Progress
      case "Completed":
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
  color: #2d3142;
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
  background-color: ${({ status }) => {
    switch (status) {
      case "pending":
        return "#ffc107";
      case "in progress":
        return "#17a2b8";
      case "completed":
        return "#28a745";
      default:
        return "#6c757d";
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
  background: #2d3142;
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
  font-weight: semi-bold;
  background-color: #2d3142;
  color: #fff;
  border: none;
`;

//
// Main Component
//
const AllWorkflowsPage = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [allWorkflows, setAllWorkflows] = useState([]);
  const [exporterWorkflows, setExporterWorkflows] = useState([]);
  const [manufacturers, setManufacturers] = useState([]);

  // Search & filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [manufacturerFilter, setManufacturerFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  console.log("workflow exporter id: ", user.exporter_id);

  // 1) Fetch ALL workflows from the back end
  useEffect(() => {
    axios
      .get("http://localhost:5000/api/workflow")
      .then((response) => {
        console.log("Workflow data:", response.data);
        // "response.data" holds the JSON array
        setAllWorkflows(response.data);
      })
      .catch((error) => {
        console.error("Error fetching workflows:", error);
      });
  }, []);

  // 2) Whenever the allWorkflows or user changes,
  //    filter out only the ones matching the current user's exporter_id
  useEffect(() => {
    if (!user || !user.exporter_id) return;

    const filtered = allWorkflows
      .filter((wf) => wf.exporter_id === user.exporter_id)
      .map((wf) => {
        const latestVersion = wf.versions.at(-1);

        const currentStatus = latestVersion?.status?.toLowerCase() || "unknown";
        const normalizedStatus =
          currentStatus === "draft"
            ? "in progress"
            : currentStatus === "in progress"
            ? "in progress"
            : currentStatus;

        const progress =
          normalizedStatus === "completed"
            ? 100
            : normalizedStatus === "in progress"
            ? 50
            : normalizedStatus === "pending"
            ? 25
            : 0;

        return {
          ...wf,
          versions: [latestVersion], // Only latest version shown
          status: normalizedStatus,
          progress,
        };
      });

    setExporterWorkflows(filtered);
  }, [allWorkflows, user]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/manufacturers/all")
      .then((res) => {
        setManufacturers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching manufacturers:", err);
      });
  }, []);

  const getManufacturerName = (id) => {
    const found = manufacturers.find((m) => m.user_id === id);
    return found ? found.username : "Unknown";
  };

  // Compute totals
  const totalCount = exporterWorkflows.length;
  const pendingCount = exporterWorkflows.filter(
    (wf) => wf.status === "pending"
  ).length;
  const inProgressCount = exporterWorkflows.filter(
    (wf) => wf.status === "in progress"
  ).length;
  const completedCount = exporterWorkflows.filter(
    (wf) => wf.status === "completed"
  ).length;

  // Filtered exporterWorkflows (by search, status, manufacturer, date range)
  const filteredWorkflows = useMemo(() => {
    return exporterWorkflows.filter((wf) => {
      // Filter by search term (check in workflowId or manufacturer name)
      const matchesSearch =
        wf.workflow_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wf.manufacturer_id.toLowerCase().includes(searchTerm.toLowerCase());

      // Filter by status
      const matchesStatus = statusFilter
        ? wf.status === statusFilter.toLowerCase()
        : true;

      // Filter by manufacturer
      const matchesManufacturer = manufacturerFilter
        ? wf.manufacturer_id === manufacturerFilter
        : true;

      // Filter by date range
      const wfDate = new Date(wf.created_at); // make sure the key matches data
      const fromDate = dateFrom ? new Date(dateFrom + "T00:00:00") : null;
      const toDate = dateTo ? new Date(dateTo + "T23:59:59") : null;

      const inRange =
        (!fromDate || wfDate >= fromDate) && (!toDate || wfDate <= toDate);

      return matchesSearch && matchesStatus && matchesManufacturer && inRange;
    });
  }, [
    exporterWorkflows,
    searchTerm,
    statusFilter,
    manufacturerFilter,
    dateFrom,
    dateTo,
  ]);

  const formatStatus = (status) => {
    if (!status) return "Unknown";
    const lower = status.toLowerCase();
    if (lower === "in progress") return "In Progress";
    if (lower === "completed") return "Completed";
    if (lower === "pending") return "Pending";
    return "Unknown";
  };

  const ViewWorkflowInfo = (workflow_id) => {
    navigate(`/workflow-info/${workflow_id}`);
  };

  return (
    <Layout role="exporter">
      <PageContainer>
        <Header title="Workflows"></Header>

        {/* Sub-header section */}
        <SubHeader>
          <SummaryBox type="Total">Total {totalCount}</SummaryBox>
          <SummaryBox type="Pending">Pending {pendingCount}</SummaryBox>
          <SummaryBox type="InProgress">
            In Progress {inProgressCount}
          </SummaryBox>
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
            {manufacturers.map((m) => (
              <option key={m.user_id} value={m.user_id}>
                {m.user_id} - {m.username}
              </option>
            ))}
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
              <TableHeaderCell>Workflow Name</TableHeaderCell>
              <TableHeaderCell>Manufacturer</TableHeaderCell>
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
                <TableCell>
                  {wf.manufacturer_id} -{" "}
                  {getManufacturerName(wf.manufacturer_id)}
                </TableCell>
                <TableCell>
                  {new Date(wf.created_at).toLocaleDateString()}
                </TableCell>
                <TableCell>
                  <StatusBadge status={wf.status}>
                    {formatStatus(wf.status)}
                  </StatusBadge>
                </TableCell>
                <TableCell>
                  <ProgressBarContainer>
                    <ProgressBarFill progress={wf.progress} />
                  </ProgressBarContainer>
                </TableCell>

                <TableCell>
                  <Button onClick={() => ViewWorkflowInfo(wf.workflow_id)}>
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
    </Layout>
  );
};

export default AllWorkflowsPage;
