import React, { useEffect } from 'react';
import { Box, Typography, Button, Container, Grid, Card, CardContent, Drawer, List, ListItem, ListItemIcon, ListItemText, Divider, AppBar, Toolbar } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import DashboardIcon from '@mui/icons-material/Dashboard';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import PeopleIcon from '@mui/icons-material/People';
import LogoutIcon from '@mui/icons-material/Logout';
import SettingsIcon from '@mui/icons-material/Settings';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import AdminSidebar from '../../../components/AdminSidebar';
import FooterBlack from '../../../components/FooterBlack';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const adminJSON = localStorage.getItem('admin');
    const admin = adminJSON ? JSON.parse(adminJSON) : null;

    useEffect(() => {
        if (!admin) {
            navigate('/login/admin');
        }
    }, [admin, navigate]);

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    if (!admin) return null;

    const todayDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    const menuItems = [
        { text: 'Dashboard', icon: <DashboardIcon />, path: '/admin/dashboard' },
        { text: 'Monitoring Dashboard', icon: <DashboardIcon />, path: '/admin/risk-dashboard' },
        { text: 'Upload Results', icon: <CloudUploadIcon />, path: '/admin/upload-result' },
        { text: 'Manage Subjects', icon: <MenuBookIcon />, path: '/admin/manage-subjects' },
        { text: 'Publish Internal Marks', icon: <MenuBookIcon />, path: '/admin/publish-results' },
        { text: 'Attendance', icon: <MenuBookIcon />, path: '/admin/attendance' },
    ];

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>
            {/* =========== LEFT SIDEBAR =========== */}
            <AdminSidebar admin={admin} handleLogout={handleLogout} menuItems={menuItems} />

            {/* =========== RIGHT CONTENT AREA =========== */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                {/* TOP NAVBAR */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31', borderBottom: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                Dashboard Overview
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 500 }}>
                                {todayDate}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* SCROLLABLE MAIN CONTENT */}
                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1 }}>
                    <Box sx={{ maxWidth: 1200, mx: 'auto' }}>
                        <Grid container spacing={4}>
                            {/* Action Card */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ backgroundColor: '#a12c2f', color: 'white', borderRadius: 4, height: '100%', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                        <Box sx={{ border: '2px solid #f1c40f', borderRadius: '50%', p: 2, mb: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <CloudUploadIcon sx={{ color: '#f1c40f', fontSize: 32 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ mb: 2, fontWeight: 700 }}>
                                            Upload Results
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
                                            Add new student performance records to the system consistently and easily.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Static Statistic Card 1 */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ backgroundColor: '#a12c2f', color: 'white', borderRadius: 4, height: '100%', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                        <Box sx={{ border: '2px solid #f1c40f', borderRadius: '50%', p: 2, mb: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <PeopleIcon sx={{ color: '#f1c40f', fontSize: 32 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                            Total Students
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
                                            Suspendisse tempor mauris a sem elementum bibendum. Praesent facilisis.
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>

                            {/* Static Statistic Card 2 */}
                            <Grid item xs={12} sm={6} md={4}>
                                <Card sx={{ backgroundColor: '#a12c2f', color: 'white', borderRadius: 4, height: '100%', boxShadow: '0 10px 20px rgba(0,0,0,0.2)' }}>
                                    <CardContent sx={{ textAlign: 'center', p: 4, display: 'flex', flexDirection: 'column', height: '100%', alignItems: 'center' }}>
                                        <Box sx={{ border: '2px solid #f1c40f', borderRadius: '50%', p: 2, mb: 3, display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
                                            <SettingsIcon sx={{ color: '#f1c40f', fontSize: 32 }} />
                                        </Box>
                                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                                            System Status
                                        </Typography>
                                        <Typography variant="body2" sx={{ mb: 4, lineHeight: 1.6, opacity: 0.9 }}>
                                            Suspendisse tempor mauris a sem elementum bibendum. Praesent facilisis.
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 'bold', mt: 'auto', color: '#4ade80' }}>
                                            Online & Active
                                        </Typography>
                                    </CardContent>
                                </Card>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
                <FooterBlack />
            </Box>
        </Box>
    );
};

export default AdminDashboard;
