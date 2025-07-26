import React, { useState } from "react";
import styled from "styled-components";
import axios from "axios";
import Layout from "../MainLayout";
import Header from "../Header";
import { useUser } from "../../context/UserContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const PageContainer = styled.div`
  padding: 1rem;
`;

const Container = styled.div`
  background: #f4f6f9;
  padding: 2rem;
  border-radius: 8px;
  max-width: 500px;
  width: 100%;
`;

const Title = styled.h4`
  margin-bottom: 1.5rem;
  text-align: center;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-top: 1rem;
  font-weight: 600;
`;

const Input = styled.input`
  margin-top: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const TextArea = styled.textarea`
  margin-top: 0.3rem;
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  margin-top: 1.5rem;
  padding: 0.7rem;
  background-color: #2d3142;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
`;

const CustomerManagement = () => {
  const { user } = useUser();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contactNumber: "",
    address: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        console.log("current user: ", user)
      await axios.post(
        "http://localhost:5000/api/customer",
        {
          ...formData,
        exporter_id: user.exporter_id,
        },
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
          },
        }
      );

      toast.success("Customer created successfully!");
      setFormData({ name: "", email: "", contactNumber: "", address: "" });
      navigate("/customers");
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Error creating customer."
      );
      console.error(err);
    }
  };

  return (
    <Layout role="exporter">
      <PageContainer>
          <Header title="Customer Management" />
        <Container>
          <Title>Create Customer</Title>
          <StyledForm onSubmit={handleSubmit}>
            <Label>Name</Label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />

            <Label>Email</Label>
            <Input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
            />

            <Label>Contact Number</Label>
            <Input
              name="contactNumber"
              value={formData.contactNumber}
              onChange={handleChange}
              required
            />

            <Label>Address</Label>
            <TextArea
              name="address"
              rows="3"
              value={formData.address}
              onChange={handleChange}
              required
            />

            <Button type="submit">Create Customer</Button>
          </StyledForm>
        </Container>
        <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      </PageContainer>
    </Layout>
  );
};

export default CustomerManagement;
