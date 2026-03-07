import React, { useState } from 'react';
import CustomModal from '../../../components/CustomModal';

import { loginParent } from '../../../services/api';

import { Container, Paper, TextField, Button, Typography, Box, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Nav1 from '../../../components/nav1';
import Footer from '../../../components/footer';
import '../../../Css_Files/HomeCss.css';

const ParentLogin = () => {
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginParent(credentials);
            const user = res.data;

            // Security Check: Ensure this user actually has a 'parent' role
            if (user.role === 'parent') {
                localStorage.setItem('user', JSON.stringify(user));
                navigate('/parent/dashboard');
            } else {
                setModalProps({ open: true, severity: 'error', message: 'This login is for Parents only. Please use the Student portal.', isConfirm: false });
            }
        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: 'Invalid credentials. Please try again.', isConfirm: false });
        }
    };

    return (
        <div className="home-container">
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <Nav1 />
            <Box sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', py: 5, position: 'relative', zIndex: 10 }}>
                <Container maxWidth="xs">
                    <Paper elevation={6} sx={{ p: 4, borderRadius: 3, textAlign: 'center' }}>
                        <Typography variant="h5" fontWeight="bold" color="secondary" gutterBottom>
                            Parent Portal Login
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Enter your registered email to monitor your child's progress.
                        </Typography>



                        <form onSubmit={handleLogin}>
                            <TextField
                                fullWidth label="Parent Email" sx={{ mb: 2 }}
                                onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                            />
                            <TextField
                                fullWidth label="Password" type="password" sx={{ mb: 3 }}
                                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                            />
                            <Button type="submit" variant="contained" color="secondary" fullWidth size="large">
                                Access Dashboard
                            </Button>
                        </form>
                    </Paper>
                </Container>
            </Box>
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

export default ParentLogin;