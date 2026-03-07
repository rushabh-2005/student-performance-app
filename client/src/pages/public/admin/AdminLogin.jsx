import React, { useState } from 'react';
import CustomModal from '../../../components/CustomModal';

import {
    Container, TextField, Button, Typography, Paper, Box, Alert
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { loginAdmin } from '../../../services/api';
import Nav1 from '../../../components/nav1';
import Footer from '../../../components/footer';
import '../../../Css_Files/HomeCss.css';

const AdminLogin = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalProps({ open: true, severity: 'error', message: null, isConfirm: false });

        try {
            // Pointing to ADMIN login API
            const response = await loginAdmin(formData);

            if (response.status === 200) {
                // Save admin info to localStorage
                localStorage.setItem('admin', JSON.stringify(response.data.user));

                // Redirect to Admin Dashboard
                navigate('/admin/dashboard');
            }
        } catch (err) {
            if (err.response && err.response.data.messages) {
                const msg = err.response.data.messages;
                setError(typeof msg === 'object' ? Object.values(msg).join(', ') : JSON.stringify(msg));
            } else {
                setModalProps({ open: true, severity: 'error', message: "Login failed. Check server.", isConfirm: false });
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
                <Paper elevation={3} sx={{ p: 4, borderTop: '4px solid #d32f2f' }}> {/* Red border for Admin */}
                    <Typography variant="h4" gutterBottom align="center" color="error">
                        Admin Portal
                    </Typography>

                    

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth label="Admin Email" name="email" type="email" margin="normal"
                            onChange={handleChange} required
                        />
                        <TextField
                            fullWidth label="Password" name="password" type="password" margin="normal"
                            onChange={handleChange} required
                        />
                        <Button
                            type="submit" fullWidth variant="contained" color="error" size="large" sx={{ mt: 3 }}
                        >
                            Login as Admin
                        </Button>
                    </Box>
                </Paper>
            </Container>
            <Footer />
                    <CustomModal 
                open={modalProps.open} 
                handleClose={() => setModalProps({ ...modalProps, open: false })}
                severity={modalProps.severity}
                message={modalProps.message}
                isConfirm={modalProps.isConfirm}
                onConfirm={modalProps.onConfirm}
            />
        </div>
    );
};

export default AdminLogin;