import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Paper, Grid, TextField, Button, Avatar, Container,
    AppBar, Toolbar, IconButton, InputAdornment
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';

import UserSidebar from '../../../components/UserSidebar';
import FooterBlack from '../../../components/FooterBlack';
import CustomModal from '../../../components/CustomModal';
import { updateStudentProfile } from '../../../services/api';

const UserProfileManagement = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [showPassword, setShowPassword] = useState(false);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '' });

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        contact_no: '',
        password: ''
    });

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            setFormData({
                name: loggedInUser.name || '',
                email: loggedInUser.email || '',
                contact_no: loggedInUser.contact_no || '',
                password: loggedInUser.password || '' // Note: Passwords usually shouldn't be held in state like this but following simplicity here
            });
        } else {
            navigate('/login/user');
        }
    }, [navigate]);

    const handleInputChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await updateStudentProfile(user.id, formData);
            const updatedUser = response.data.user;

            // Check if email or password was changed
            const isEmailChanged = formData.email !== user.email;
            const isPasswordChanged = formData.password !== user.password;

            if (isEmailChanged || isPasswordChanged) {
                setModalProps({
                    open: true,
                    severity: 'success',
                    message: 'Profile updated. Please login again with your new credentials.'
                });

                // Wait a bit then logout
                setTimeout(() => {
                    localStorage.removeItem('user');
                    navigate('/login/user');
                }, 2000);
            } else {
                // Update localStorage so changes reflect everywhere (if only name/contact changed)
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);

                setModalProps({
                    open: true,
                    severity: 'success',
                    message: 'Profile updated successfully!'
                });
            }
        } catch (error) {
            const errorMessage = error.response?.data?.email
                ? 'Email already in use by another user.'
                : 'Failed to update profile. Please try again.';

            setModalProps({
                open: true,
                severity: 'error',
                message: errorMessage
            });
        }
    };

    if (!user) return null;

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>
            <UserSidebar user={user} handleLogout={() => {
                localStorage.removeItem('user');
                navigate('/');
            }} />

            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                            Manage Profile
                        </Typography>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
                    <Container maxWidth="sm">
                        <Paper elevation={0} sx={{
                            p: 4,
                            borderRadius: 4,
                            border: '1px solid #edf1f7',
                            bgcolor: '#fff',
                            boxShadow: '0 10px 40px rgba(0,0,0,0.04)'
                        }}>
                            <Box sx={{ mb: 4, textAlign: 'left' }}>
                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#091e42', mb: 1 }}>
                                    User Profile management..
                                </Typography>
                                <Typography variant="body1" sx={{ color: '#5e6c84', mb: 4 }}>
                                    Manage your profile like name, email, mobile number and password.
                                </Typography>
                            </Box>

                            <form onSubmit={handleSubmit}>
                                <Grid container spacing={3}>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Full Name *"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PersonOutlineIcon sx={{ color: '#6b778c' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Email Address *"
                                            name="email"
                                            type="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <MailOutlineIcon sx={{ color: '#6b778c' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Mobile Number *"
                                            name="contact_no"
                                            value={formData.contact_no}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <PhoneIphoneIcon sx={{ color: '#6b778c' }} />
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Update Password *"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            InputProps={{
                                                startAdornment: (
                                                    <InputAdornment position="start">
                                                        <LockOutlinedIcon sx={{ color: '#6b778c' }} />
                                                    </InputAdornment>
                                                ),
                                                endAdornment: (
                                                    <InputAdornment position="end">
                                                        <IconButton
                                                            onClick={() => setShowPassword(!showPassword)}
                                                            edge="end"
                                                        >
                                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                                        </IconButton>
                                                    </InputAdornment>
                                                ),
                                            }}
                                            sx={{ '& .MuiOutlinedInput-root': { borderRadius: 2 } }}
                                        />
                                    </Grid>

                                    <Grid item xs={12} sx={{ mt: 2 }}>
                                        <Button
                                            fullWidth
                                            variant="contained"
                                            size="large"
                                            type="submit"
                                            sx={{
                                                py: 1.8,
                                                borderRadius: 2,
                                                bgcolor: '#1976d2',
                                                fontWeight: 700,
                                                fontSize: '1rem',
                                                textTransform: 'none',
                                                boxShadow: '0 4px 14px 0 rgba(25, 118, 210, 0.39)',
                                                '&:hover': {
                                                    bgcolor: '#1565c0',
                                                    boxShadow: '0 6px 20px rgba(25, 118, 210, 0.23)'
                                                }
                                            }}
                                        >
                                            SAVE CHANGES
                                        </Button>
                                    </Grid>
                                </Grid>
                            </form>
                        </Paper>
                    </Container>
                </Box>
                <FooterBlack />
            </Box>

            <CustomModal
                open={modalProps.open}
                handleClose={() => setModalProps({ ...modalProps, open: false })}
                severity={modalProps.severity}
                message={modalProps.message}
            />
        </Box>
    );
};

export default UserProfileManagement;
