import React from 'react';
import { useState } from 'react';
import { Container, Typography, TextField, Button, Link, Modal, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
const config = require('../config.json');
export default function LoginPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [openModal, setOpenModal] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (event) => {
        event.preventDefault();
        const username = event.target.elements.username.value;
        const password = event.target.elements.password.value;

        // Perform validation on username and password
        if (!username || !password) {
            console.error('Please fill in all fields');
            return;
        }
        try {
            console.log(`${config.server_protocol}${config.server_host}:${config.server_port}/api/login`)
            const response = await fetch(`${config.server_protocol}${config.server_host}:${config.server_port}/api/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({username, password})
            });

            console.log(response);
            if (response.ok) {
                // Login successful, redirect to home page or perform some other action
                navigate('/home');
            } else {
                console.error('Login failed');
            }
        } catch (error) {
            console.error(error);
        }

    };

    const handleRegister = async (event) => {
        event.preventDefault();
        const username = event.target.elements.username.value;
        const password = event.target.elements.password.value;
        const confirmPassword = event.target.elements.confirmPassword.value;

        // Perform validation on username, password, and confirmPassword
        if (!username || !password || !confirmPassword) {
            console.error('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            console.error('Passwords do not match');
            return;
        }

        const response = await fetch(`${config.server_protocol}${config.server_host}:${config.server_port}/api/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                username: username,
                password: password
            })
        });

        const data = await response.json();
        if (data.success) {
            alert('Registration successful!');
            setOpenModal(false);
            navigate('/login');
        } else {
            alert(data.message);
        }
    };


    return (
        <Container maxWidth="xs">
            <Typography variant="h4" align="center" gutterBottom>
                Login
            </Typography>
            <form onSubmit={handleLogin}>
                <TextField
                    label="Username"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    name = "username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                />
                <TextField
                    label="Password"
                    variant="outlined"
                    margin="normal"
                    fullWidth
                    type="password"
                    name = "password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                />
                <Button variant="contained" color="primary" type="submit" fullWidth>
                    Login
                </Button>
            </form>
            <Typography align="center" style={{ marginTop: '1rem' }}>
                <Link href="#" onClick={() => setOpenModal(true)}>Register</Link>
            </Typography>
            <Modal
                open={openModal}
                onClose={() => setOpenModal(false)}
                aria-labelledby="register-modal-title"
                aria-describedby="register-modal-description"
            >
                <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, borderRadius: 1 }}>
                    <Typography variant="h6" id="register-modal-title" gutterBottom>
                        Register
                    </Typography>
                    <form onSubmit={handleRegister}>
                        <TextField
                            label="Username"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            name="username"
                        />
                        <TextField
                            label="Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="password"
                            name="password"
                        />
                        <TextField
                            label="Confirm Password"
                            variant="outlined"
                            margin="normal"
                            fullWidth
                            type="password"
                            name="confirmPassword"
                        />
                        <Button variant="contained" color="primary" type="submit" fullWidth>
                            Register
                        </Button>
                    </form>
                </Box>
            </Modal>
        </Container>
    );
}

