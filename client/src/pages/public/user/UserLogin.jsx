import React, { useState } from 'react';
import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { loginStudent } from '../../../services/api';
import Nav1 from '../../../components/nav1';
import Footer from '../../../components/footer';
import CustomModal from '../../../components/CustomModal';
import '../../../Css_Files/HomeCss.css';

const UserLogin = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({ email: '', password: '' });
    const [modalConfig, setModalConfig] = useState({ open: false, severity: 'error', message: '' });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const showModal = (severity, message) => {
        setModalConfig({ open: true, severity, message });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await loginStudent(formData);
            if (response.status === 200) {
                localStorage.setItem('user', JSON.stringify(response.data.user));
                navigate('/user/dashboard');
            }
        } catch (err) {
            console.error("Login Error:", err);
            if (err.response && err.response.data.messages) {
                const msg = err.response.data.messages;
                showModal('error', typeof msg === 'object' ? Object.values(msg).join(', ') : JSON.stringify(msg));
            } else {
                showModal('error', "Login failed. Server not responding.");
            }
        }
    };

    return (
        <div className="home-container">
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <Nav1 />
            <Container maxWidth="xs" sx={{ mt: 10, position: 'relative', zIndex: 10 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        User Login
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth label="Email Address" name="email" type="email" margin="normal"
                            onChange={handleChange} required
                        />
                        <TextField
                            fullWidth label="Password" name="password" type="password" margin="normal"
                            onChange={handleChange} required
                        />

                        <Button
                            type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}
                        >
                            Sign In
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                            New student? <Link to="/register" style={{ textDecoration: 'none', color: '#1976d2' }}>Register here</Link>
                        </Typography>
                    </Box>
                </Paper>
            </Container>
            <Footer />

            <CustomModal
                open={modalConfig.open}
                handleClose={() => setModalConfig({ ...modalConfig, open: false })}
                severity={modalConfig.severity}
                message={modalConfig.message}
            />
        </div>
    );
};

export default UserLogin;