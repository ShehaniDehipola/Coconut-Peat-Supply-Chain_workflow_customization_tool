import React, { useState, useEffect } from "react";
import styled from "styled-components";
import axios from "axios";
import Layout from "../MainLayout";
import Header from "../Header";
import { useUser } from "../../context/UserContext";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer, toast } from "react-toastify";

const PageContainer = styled.div`
    padding: 1rem;
`;

const Container = styled.div`
    background: #f4f6f9;
    padding: 1.5rem;
    border-radius: 8px;
    margin-bottom: 2rem;
`;

const Title = styled.h2`
    margin-bottom: 1rem;
`;

const StyledForm = styled.form`
    display: flex;
    flex-direction: column;
`;

const FormRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 1.5rem;
`;

const FormColumn = styled.div`
    flex: 1;
    min-width: 250px;
`;

const Label = styled.label`
    display: block;
    margin-top: 10px;
    font-weight: 600;
`;

const Input = styled.input`
    width: 80%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const TextArea = styled.textarea`
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #ccc;
    border-radius: 4px;
`;

const Button = styled.button`
    margin-top: 1rem;
    padding: 0.7rem 1.2rem;
    background-color: #2d3142;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
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

const ManufacturerManagement = () => {
    const { user } = useUser();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contactNumber: "",
        address: "",
    });

    const [manufacturers, setManufacturers] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const fetchManufacturers = async () => {
        try {
            const res = await axios.get("http://localhost:5000/api/manufacturers/exporter", {
                headers: {
                    Authorization: `Bearer ${user.token}`, // assuming user.token is available
                },
            });
            setManufacturers(res.data);
        } catch (err) {
            toast.error("Failed to fetch manufacturers.");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchManufacturers();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/manufacturers", {
                ...formData,
                exporter_id: user.exporter_id,
            });
            toast.success("Manufacturer created and email sent successfully!");
            setFormData({ name: "", email: "", contactNumber: "", address: "" });
            fetchManufacturers();
        } catch (err) {
            toast.error(
                err.response?.data?.message || "Error creating manufacturer."
            );
            console.error(err);
        }
    };

    return (
        <Layout role="exporter">
            <PageContainer>
                <Header title="Manufacturer Management" />

                <Container>
                    <Title>Create Manufacturer</Title>
                    <StyledForm onSubmit={handleSubmit}>
                        <FormRow>
                            <FormColumn>
                                <Label>Name</Label>
                                <Input name="name" value={formData.name} onChange={handleChange} required />

                                <Label>Email</Label>
                                <Input name="email" value={formData.email} onChange={handleChange} required />

                                <Label>Contact Number</Label>
                                <Input name="contactNumber" value={formData.contactNumber} onChange={handleChange} required />
                            </FormColumn>

                            <FormColumn>
                                <Label>Address</Label>
                                <TextArea name="address" value={formData.address} onChange={handleChange} required />
                            </FormColumn>
                        </FormRow>

                        <Button type="submit">Create</Button>
                    </StyledForm>
                </Container>

                <Container>
                    <Title>All Manufacturers</Title>
                    <StyledTable>
                        <thead>
                        <tr>
                            <TableHeaderCell>User ID</TableHeaderCell>
                            <TableHeaderCell>Name</TableHeaderCell>
                            <TableHeaderCell>Email</TableHeaderCell>
                            <TableHeaderCell>Contact</TableHeaderCell>
                            <TableHeaderCell>Exporter Ref</TableHeaderCell>
                        </tr>
                        </thead>
                        <tbody>
                        {manufacturers.map((manu) => (
                            <TableRow key={manu.user_id}>
                                <TableCell>{manu.user_id}</TableCell>
                                <TableCell>{manu.username}</TableCell>
                                <TableCell>{manu.email}</TableCell>
                                <TableCell>{manu.contactNumber}</TableCell>
                                <TableCell>{manu.exporter_ref}</TableCell>
                            </TableRow>
                        ))}
                        </tbody>
                    </StyledTable>
                </Container>
            </PageContainer>
        </Layout>
    );
};

export default ManufacturerManagement;
