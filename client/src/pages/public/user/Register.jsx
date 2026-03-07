import React, { useState } from 'react';
import CustomModal from '../../../components/CustomModal';

import { registerStudent } from '../../../services/api';

import {
    Container, TextField, Button, Typography, Paper, Box, Alert,
    MenuItem, Select, FormControl, InputLabel
} from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';

import Nav1 from '../../../components/nav1';
import Footer from '../../../components/footer';
import '../../../Css_Files/HomeCss.css';

const semesterMapping = {
    "1st Year": [
        { value: "Sem 1", label: "Semester 1" },
        { value: "Sem 2", label: "Semester 2" },
    ],
    "2nd Year": [
        { value: "Sem 3", label: "Semester 3" },
        { value: "Sem 4", label: "Semester 4" },
    ],
    "3rd Year": [
        { value: "Sem 5", label: "Semester 5" },
        { value: "Sem 6", label: "Semester 6" },
    ],
    "4th Year": [
        { value: "Sem 7", label: "Semester 7" },
        { value: "Sem 8", label: "Semester 8" },
    ]
};

const Register = () => {
    const navigate = useNavigate();

    // 1. State for form data (Added contact fields)
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact_number: '',
        alt_contact_number: '',
        current_year: '',
        current_sem: '',
        password: ''
    });

    const [error, setError] = useState(null);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [success, setSuccess] = useState(null);

    const handleKeyDown = (e) => {
        // Allow control keys (backspace, delete, tab, arrows, etc.)
        if (
            ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key) ||
            // Allow Ctrl+A, Ctrl+C, Ctrl+V, etc.
            (e.ctrlKey || e.metaKey)
        ) {
            return;
        }

        // Block non-numeric keys
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    // 2. Handle Input Change
    const handleChange = (e) => {
        const { name, value } = e.target;

        // Change 2: Restrict Full Name to letters and spaces only
        if (name === "name") {
            const regex = /^[a-zA-Z\s]*$/;
            if (!regex.test(value)) {
                return; // Stop the input if it contains numbers or special chars
            }
        }

        if (name === "contact_number" || name === "alt_contact_number") {
            if (value !== "" && !/^\d+$/.test(value)) {
                return;
            }
            if (value.length > 10) {
                return;
            }
        }

        if (name === "current_year") {
            setFormData({
                ...formData,
                [name]: value,
                current_sem: ''
            });
        } else {
            setFormData({
                ...formData,
                [name]: value
            });
        }
    };

    // 3. Handle Form Submission
    const handleSubmit = async (e) => {
        e.preventDefault();
        setModalProps({ open: true, severity: 'error', message: null, isConfirm: false });
        setModalProps({ open: true, severity: 'success', message: null, isConfirm: false });

        // Basic Frontend Validation (Added contact_number)
        if (!formData.name || !formData.email || !formData.contact_number || !formData.alt_contact_number || !formData.password || !formData.current_year || !formData.current_sem) {
            setModalProps({ open: true, severity: 'error', message: "All fields are required.", isConfirm: false });
            return;
        }

        if (formData.contact_number.length !== 10) {
            setModalProps({ open: true, severity: 'error', message: "Contact Number must be exactly 10 digits.", isConfirm: false });
            return;
        }

        if (formData.alt_contact_number.length !== 10) {
            setModalProps({ open: true, severity: 'error', message: "Alternate Contact Number must be exactly 10 digits.", isConfirm: false });
            return;
        }

        // Email Validation (Gmail specifically)
        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;
        if (!emailRegex.test(formData.email)) {
            setModalProps({
                open: true,
                severity: 'error',
                message: "Please enter a valid Gmail address (e.g., user@gmail.com).",
                isConfirm: false
            });
            return;
        }

        // Password Strength Validation
        const passRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).+$/;
        if (!passRegex.test(formData.password)) {
            setModalProps({
                open: true,
                severity: 'error',
                message: "Password must contain at least one capital letter, one number, and one special character.",
                isConfirm: false
            });
            return;
        }

        try {
            const response = await registerStudent(formData);

            if (response.status === 201) {
                setModalProps({ open: true, severity: 'success', message: "Registration Successful! Redirecting to login...", isConfirm: false });
                setTimeout(() => {
                    navigate('/login/user');
                }, 2000);
            }
        } catch (err) {
            console.error("Registration Error:", err);
            if (err.response && err.response.data.messages) {
                const serverErrors = Object.values(err.response.data.messages).join(', ');
                setModalProps({ open: true, severity: 'error', message: serverErrors, isConfirm: false });
            } else {
                setModalProps({ open: true, severity: 'error', message: "Registration failed. Please check if the backend server is running.", isConfirm: false });
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
            <Container maxWidth="sm" sx={{ mt: 8, mb: 8, position: 'relative', zIndex: 10 }}>
                <Paper elevation={3} sx={{ p: 4 }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary">
                        Student Registration
                    </Typography>

                    <Typography variant="body1" align="center" sx={{ mb: 3, color: 'text.secondary' }}>
                        Create your account to view performance analysis.
                    </Typography>




                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            fullWidth label="Full Name" name="name"
                            value={formData.name} onChange={handleChange} margin="normal" required
                            helperText="Alphabets and spaces only."
                        />
                        <TextField
                            fullWidth label="Email Address" name="email" type="email"
                            value={formData.email} onChange={handleChange} margin="normal" required
                        />

                        {/* Change 1: Added Contact Number Fields */}
                        <TextField
                            fullWidth label="Contact Number" name="contact_number" type="tel"
                            value={formData.contact_number} onChange={handleChange} margin="normal" required
                            onKeyDown={handleKeyDown}
                        />
                        <TextField
                            fullWidth label="Alternate Contact Number" name="alt_contact_number" type="tel"
                            value={formData.alt_contact_number} onChange={handleChange} margin="normal" required
                            onKeyDown={handleKeyDown}
                        />

                        <FormControl fullWidth margin="normal" required>
                            <InputLabel>Current Year</InputLabel>
                            <Select
                                label="Current Year" name="current_year"
                                value={formData.current_year} onChange={handleChange}
                            >
                                <MenuItem value="1st Year">1st Year</MenuItem>
                                <MenuItem value="2nd Year">2nd Year</MenuItem>
                                <MenuItem value="3rd Year">3rd Year</MenuItem>
                                <MenuItem value="4th Year">4th Year</MenuItem>
                            </Select>
                        </FormControl>

                        <FormControl fullWidth margin="normal" required disabled={!formData.current_year}>
                            <InputLabel>Current Semester</InputLabel>
                            <Select
                                label="Current Semester" name="current_sem"
                                value={formData.current_sem} onChange={handleChange}
                            >
                                {formData.current_year && semesterMapping[formData.current_year].map((option) => (
                                    <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <TextField
                            fullWidth label="Password" name="password" type="password"
                            value={formData.password} onChange={handleChange} margin="normal" required
                            helperText="Must contain at least one capital letter, one number, and one special character."
                        />

                        <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, mb: 2 }}>
                            Register
                        </Button>
                    </Box>

                    <Box sx={{ textAlign: 'center' }}>
                        <Typography variant="body2">
                            Already have an account? <Link to="/login/user" style={{ textDecoration: 'none', color: '#1976d2' }}>Login here</Link>
                        </Typography>
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

export default Register;