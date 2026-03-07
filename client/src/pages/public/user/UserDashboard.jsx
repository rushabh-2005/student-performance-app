import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, IconButton, Paper, Button, Grid, TextField,
    AppBar, Toolbar
} from '@mui/material';
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import { useNavigate } from 'react-router-dom';
import UserSidebar from '../../../components/UserSidebar';
import FooterBlack from '../../../components/FooterBlack';

const UserDashboard = () => {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
        } else {
            navigate('/login/user');
        }
    }, [navigate]);

    if (!user) return <Box sx={{ p: 4 }}><Typography>Loading...</Typography></Box>;

    const studentName = user.name;

    const todayDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/');
    };

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>

            {/* =========== LEFT SIDEBAR =========== */}
            <UserSidebar user={user} handleLogout={handleLogout} />

            {/* =========== RIGHT CONTENT AREA =========== */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                {/* TOP NAVBAR */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31', borderBottom: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                Profile Overview
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 500 }}>
                                {todayDate}
                            </Typography>
                        </Box>

                        {/* Buttons Removed */}
                    </Toolbar>
                </AppBar>

                {/* SCROLLABLE MAIN CONTENT */}
                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1 }}>
                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>

                        {/* Gradient Banner Card */}
                        <Paper elevation={0} sx={{
                            borderRadius: 4,
                            border: '1px solid #edf1f7',
                            overflow: 'hidden',
                            mb: 6,
                            bgcolor: '#fff'
                        }}>
                            <Box sx={{
                                height: 160,
                                background: 'linear-gradient(120deg, #e0c3fc 0%, #8ec5fc 100%)',
                            }} />

                            <Box sx={{ px: 5, pb: 5, display: 'flex', flexDirection: 'column', position: 'relative' }}>
                                {/* Overlapping Avatar */}
                                <Avatar sx={{
                                    width: 100, height: 100,
                                    bgcolor: '#fff',
                                    color: '#0a192f',
                                    fontSize: 40,
                                    fontWeight: 'bold',
                                    border: '5px solid #fff',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                                    mt: -6,
                                    mb: 2
                                }}>
                                    {user.name.charAt(0)}
                                </Avatar>

                                <Grid container justifyContent="space-between" alignItems="flex-end">
                                    <Grid item>
                                        <Typography variant="h4" sx={{ fontWeight: 800, color: '#091e42', mb: 0.5 }}>
                                            {studentName}
                                        </Typography>
                                        <Typography variant="subtitle1" sx={{ color: '#5e6c84', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                            <MailOutlineIcon fontSize="small" /> {user.email}
                                        </Typography>
                                    </Grid>
                                </Grid>
                            </Box>
                        </Paper>

                        {/* Details Section */}
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#091e42', mb: 3 }}>
                            Personal Information
                        </Typography>

                        <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #edf1f7', bgcolor: '#fff' }}>
                            <Grid container spacing={4}>
                                {[
                                    { label: 'Student Name', value: studentName },
                                    { label: 'Contact Number', value: user.contact_no || 'Not Provided' },
                                    { label: 'Alternate Contact', value: user.alt_contact_no || 'Not Provided' },
                                    { label: 'Current Year', value: user.current_year },
                                    { label: 'Current Semester', value: user.current_sem }
                                ].map((field, idx) => (
                                    <Grid item xs={12} sm={6} key={idx}>
                                        <Box sx={{ p: 2, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9' }}>
                                            <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                                                {field.label}
                                            </Typography>
                                            <Typography variant="body1" sx={{ color: '#0f172a', fontWeight: 600, mt: 0.5 }}>
                                                {field.value}
                                            </Typography>
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Paper>

                    </Box>
                </Box>

                <FooterBlack />
            </Box>
        </Box>
    );
};

export default UserDashboard;