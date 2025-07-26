import React, { useEffect, useState } from "react";
import axios from "axios";
import styled from "styled-components";
import { useUser } from "../../context/UserContext";
import Header from "../Header";
import Layout from "../MainLayout";
import { useNavigate } from "react-router-dom";

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
  background-color: #2563eb;
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
  box-shadow: 0px 2px 6px rgba(0, 0, 0, 0.15);
  transition: background-color 0.2s;

  &:hover {
    background-color: #1e40af;
  }
`;

const SearchInput = styled.input`
  margin-bottom: 1rem;
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

const Card = styled.div`
  border: 1px solid #ddd;
  border-radius: 1rem;
  padding: 1rem;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  transition: box-shadow 0.2s;

  &:hover {
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  }
`;

const CustomerName = styled.h3`
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 0.25rem;
`;

const Text = styled.p`
  font-size: 0.875rem;
  color: #4b5563;
  margin-bottom: 0.25rem;
`;

const OrderList = styled.ul`
  list-style: disc;
  padding-left: 1rem;
  font-size: 0.875rem;
  color: #374151;
`;

const EmptyText = styled.p`
  font-size: 0.875rem;
  color: #9ca3af;
`;

const AllCustomers = () => {
  const { user } = useUser();
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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
        <Button onClick={() => navigate("/new-customer")}>Create New Customer</Button>
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
              {customer.user_id}
            </TableCell>
            <TableCell>{customer.username}</TableCell>
            <TableCell>{customer.email}</TableCell>
            <TableCell>{customer.contactNumber}</TableCell>
            <TableCell>{customer.address}</TableCell>

            <TableCell>
              {customer.orders && customer.orders.length > 0 ? (
                <TableCell>
                  {customer.orders.map((order) => (
                    <li key={order._id}>{order.workflow_id || order._id}</li>
                  ))}
                </TableCell>
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
