import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { registerParent, getChildByEmail } from '../../../services/api';

import { Container, Paper, TextField, Button, Typography, Box, Alert, CircularProgress, InputAdornment } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import Nav1 from '../../../components/nav1';
import Footer from '../../../components/footer';
import '../../../Css_Files/HomeCss.css';

const ParentRegister = () => {
    const [formData, setFormData] = useState({
        parent_name: '',
        email: '',
        password: '',
        contact_no: '',
        student_email: '' // Used to find the child in the 'users' table
    });
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [isFetching, setIsFetching] = useState(false);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const navigate = useNavigate();

    // Auto-fetch child contact details when student_email is valid
    useEffect(() => {
        const fetchChildDetails = async () => {
            const cleanEmail = formData.student_email.trim();
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

            if (emailRegex.test(cleanEmail)) {
                setIsFetching(true);
                try {
                    const res = await getChildByEmail(cleanEmail);
                    if (res.data && res.data.contact_no) {
                        setFormData(prev => ({ ...prev, contact_no: res.data.contact_no }));
                        setModalProps({ open: true, severity: 'success', message: `Linked to Student: ${res.data.name}. Contact details updated.`, isConfirm: false });
                    }
                } catch (err) {
                    console.error("Student fetch error:", err);
                    if (err.response && err.response.status === 404) {
                        setModalProps({ open: true, severity: 'error', message: "No student found with that email address. Please check and try again.", isConfirm: false });
                    }
                } finally {
                    setIsFetching(false);
                }
            }
        };

        const timer = setTimeout(fetchChildDetails, 1000); // Debounce
        return () => clearTimeout(timer);
    }, [formData.student_email]);

    const handleRegister = async (e) => {
        e.preventDefault();

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setModalProps({ open: true, severity: 'error', message: 'Please enter a valid email address.', isConfirm: false });
            return;
        }

        if (formData.contact_no.length !== 10) {
            setModalProps({ open: true, severity: 'error', message: 'Contact number must be exactly 10 digits.', isConfirm: false });
            return;
        }

        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        if (!passRegex.test(formData.password)) {
            setModalProps({ open: true, severity: 'error', message: 'Password must contain at least one capital letter, one number, and one special character.', isConfirm: false });
            return;
        }

        try {
            const dataToSubmit = {
                ...formData,
                student_email: formData.student_email.trim(),
                email: formData.email.trim()
            };
            const res = await registerParent(dataToSubmit);
            setModalProps({ open: true, severity: 'success', message: 'Registration successful! Redirecting to login...', isConfirm: false });
            setTimeout(() => navigate('/parent-login'), 2000);
        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: err.response?.data?.messages?.error || 'Registration failed', isConfirm: false });
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
                            Parent Portal Registration
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Enter your details to create an account and monitor your child's progress.
                        </Typography>

                        <form onSubmit={handleRegister}>
                            <TextField fullWidth label="Full Name" sx={{ mb: 2 }} required
                                value={formData.parent_name}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/[^a-zA-Z\s]/g, '');
                                    setFormData({ ...formData, parent_name: val });
                                }} />

                            <TextField fullWidth label="Your Email" type="email" sx={{ mb: 2 }} required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />

                            <TextField fullWidth label="Child's (Student) Email" type="email" sx={{ mb: 2 }} required
                                value={formData.student_email}
                                helperText="We use this to link your account (Contact details will be fetched automatically)."
                                onChange={(e) => setFormData({ ...formData, student_email: e.target.value })}
                                InputProps={{
                                    endAdornment: isFetching && (
                                        <InputAdornment position="end">
                                            <CircularProgress size={20} color="secondary" />
                                        </InputAdornment>
                                    ),
                                }} />

                            <TextField fullWidth label="Contact Number" sx={{ mb: 2 }} required
                                value={formData.contact_no}
                                helperText="Auto-fetched from student profile"
                                onKeyDown={(e) => {
                                    if (!/^\d$/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
                                        e.preventDefault();
                                    }
                                }}
                                onChange={(e) => {
                                    const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                                    setFormData({ ...formData, contact_no: val });
                                }} />

                            <TextField fullWidth label="Create Password" type="password" sx={{ mb: 3 }} required
                                value={formData.password}
                                onChange={(e) => setFormData({ ...formData, password: e.target.value })} />

                            <Button type="submit" variant="contained" color="secondary" fullWidth size="large">
                                REGISTER
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

export default ParentRegister;