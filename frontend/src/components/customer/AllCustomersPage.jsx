import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useUser } from "../../context/UserContext";
import Header from "../Header";
import Layout from "../MainLayout";
import { useNavigate } from "react-router-dom";
import plusIcon from "../../assests/plus.png"

const PageContainer = styled.div`
  padding: 1rem;
`;

const SubHeader = styled.div`
  margin: 1rem 0;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
`;

const Button = styled.button`
  background-color: #ffffffff;
  color: #2D3142;
  padding: 0.5rem 1rem;
  border-radius: 4px;
  box-shadow: 0px #2D3142;
  transition: background-color 0.2s;

  &:hover {
    background-color: #2D3142;
    color: white;
  }
`;

const ButtonContent = styled.span`
  display: flex;
  align-items: center;
  gap: 8px;
`;

const Icon = styled.img`
  width: 18px;
  height: 18px;
  display: block;
`;

const SearchInput = styled.input`
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 0.75rem;
  width: 100%;
  max-width: 400px;
`;

const Grid = styled.div`
  background: #f4f6f9;
  padding: 1.5rem;
  border-radius: 8px;
  margin-bottom: 2rem;
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

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const AllCustomers = () => {
  const { user } = useUser();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [workflows, setWorkflows] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/customer/all")
      .then((res) => {
        setCustomers(res.data);
      })
      .catch((err) => {
        console.error("Error fetching customers:", err);
      });
  }, []);

  useEffect(() => {
  axios.get("http://localhost:5000/api/workflow") 
    .then((res) => {
      setWorkflows(res.data);
    })
    .catch((err) => {
      console.error("Error fetching workflows:", err);
    });
}, []);

const getWorkflowById = (id) => {
  return workflows.find((wf) => wf._id === id);
};



//   const fetchCustomers = async () => {
//     try {
//       const res = await axios.get("http://localhost:3000/api/customer/all");
//       setCustomers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

  const filteredCustomers = customers.filter((customer) => {
  const name = customer?.name?.toLowerCase() || "";
  const email = customer?.email?.toLowerCase() || "";
  const customerId = customer?.customer_id?.toLowerCase() || "";
  const term = searchTerm.toLowerCase();

  return (
    name.includes(term) ||
    email.includes(term) ||
    customerId.includes(term)
  );
});


  return (
    <Layout role="exporter">
    <PageContainer>
        <Header title="Customers"></Header>
      <SubHeader>
      <SearchInput
        type="text"
        placeholder="Search customers..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button onClick={() => navigate("/new-customer")}>
  <ButtonContent>
    <Icon src={plusIcon} alt="plus" />
    <span>Create New Customer</span>
  </ButtonContent>
</Button>

        </SubHeader>

      <Grid>
        <StyledTable>
          <thead>
            <tr>
              <TableHeaderCell>User ID</TableHeaderCell>
              <TableHeaderCell>Name</TableHeaderCell>
              <TableHeaderCell>Email</TableHeaderCell>
              <TableHeaderCell>Contact Number</TableHeaderCell>
              <TableHeaderCell>Address</TableHeaderCell>
              <TableHeaderCell>Orders</TableHeaderCell>
            </tr>
          </thead>
          <tbody>

          </tbody>
        {filteredCustomers.map((customer) => (
          <TableRow key={customer._id}>
            <TableCell>
              {customer.customer_id}
            </TableCell>
            <TableCell>{customer.name}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.contactNumber}</TableCell>
            <TableCell>{customer.address}</TableCell>

            <TableCell>
              {customer.orders && customer.orders.length > 0 ? (
                <ul>
      {customer.orders.map((workflowId) => {
        const workflow = getWorkflowById(workflowId);
        return (
          <li key={workflowId}>
            <strong>ID:</strong> {workflow?.workflow_id || "N/A"} <br />
            <strong>Name:</strong> {workflow?.workflow_name || "Unknown"}
          </li>
        );
      })}
    </ul>
              ) : (
                <EmptyText>No orders assigned.</EmptyText>
              )}
            </TableCell>
          </TableRow>
        ))}
        </StyledTable>
      </Grid>
      </PageContainer>
    </Layout>
  );
};

export default AllCustomers;
