import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styled from "styled-components";
import LoginImage from '../../assests/image-1.jpg';
import { useUser } from "../../context/UserContext"

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh; /* Full viewport height */
    background-color: rgba(216, 149, 39, 0.3); 
    margin-top: 0; /* Remove default margins */
    padding: 0; /* Remove default padding */
`;

const LoginBox = styled.div`
    display: flex;
    width: 800px;
    height: 500px;
    border-radius: 10px;
    box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    background-color: #ffffff;
`;

const ImageSection = styled.div`
    flex: 1;
    background-color: #f0f0f0;
    display: flex;
    justify-content: center;
    align-items: center;

    img {
        width: 100%;
        height: 500px;
        object-fit: cover;
    }
`;

const FormSection = styled.div`
    flex: 1;
    padding: 40px;
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
        margin-bottom: 20px;
        color: #333333;
    }

    form {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }
`;

const InputField = styled.div`
    display: flex;
    flex-direction: column;

    label {
        margin-bottom: 5px;
        font-size: 14px;
        color: #555555;
    }

    input {
        padding: 10px;
        border: 1px solid #cccccc;
        border-radius: 5px;
        font-size: 16px;
    }

    input:focus {
        outline: none;
        border-color: #007bff;
    }
`;

const Button = styled.button`
    padding: 12px;
    background-color: #d89527;
    color: #ffffff;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;

    &:hover {
        background-color: #9b6b1d;
    }
`;

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useUser(); // Get setUser from context
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await axios.post('http://localhost:5000/api/auth/login', { email, password });
            const token = res?.data?.token; // Extract token and user role
            const { username, role, exporter_id, user_id, forcePasswordChange } = res.data.user; // Extract role from response

             console.log("User Data Received:", res.data.user);

            if (token) {
            localStorage.setItem("token", token); // Store token
            localStorage.setItem("user", JSON.stringify(res.data.user)); // Store user details in localStorage
        } else {
            console.error("Login failed: No token received.");
            alert("Login failed. Please try again.");
            return;
            }
            
            console.log("user's role is: ", role)
            console.log("User's Exporter ID:", exporter_id);
            console.log("User's User ID:", user_id);
            setUser({ username, email, role, exporter_id, user_id, forcePasswordChange, token }); // Store user details in context
            if (role === "exporter") {
                navigate("/exporter-dashboard"); // Redirect after login
            }
            if (role === "manufacturer") {
                navigate("/manufacturer-dashboard"); // Redirect after login
            }
            if (role === "customer") {
                navigate("/customer-dashboard"); // Redirect after login
            }
        } catch (err) {
            console.error('Error logging in:', err.response.data.message);
        }
    };

    return (
        <Container>
            <LoginBox>
                <ImageSection>
                    <img src={LoginImage} alt="Login Illustration" />
                </ImageSection>
                <FormSection>
                    <h2>Welcome back!</h2>
                    <form onSubmit={handleLogin}>
                        <InputField>
                            <label>Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </InputField>
                        <InputField>
                            <label>Password</label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </InputField>
                        <Button type="submit">Login</Button>
                    </form>
                </FormSection>
            </LoginBox>
        </Container>
    );
};

export default Login;
