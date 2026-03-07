import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getParentStudentSnapshot, getNotifications, markNotificationRead } from '../../../services/api';

import { Container, Grid, Paper, Typography, Box, Alert, CircularProgress, Divider, Avatar, AppBar, Toolbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import ParentSidebar from '../../../components/ParentSidebar';
import FooterBlack from '../../../components/FooterBlack';
import MailOutlineIcon from '@mui/icons-material/MailOutline';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

const ParentDashboard = () => {
    const [studentData, setStudentData] = useState(null);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [loading, setLoading] = useState(true);
    const [parent] = useState(JSON.parse(localStorage.getItem('user'))); // Logged in as parent
    const navigate = useNavigate();

    useEffect(() => {
        if (parent && parent.student_id) {
            fetchStudentProgress(parent.student_id);
            fetchNotifications(parent.id);
        } else {
            setLoading(false);
        }
    }, [parent]);

    const fetchNotifications = async (parentId) => {
        try {
            const res = await getNotifications(parentId);
            if (res.data.length > 0) {
                const latest = res.data[0];
                setModalProps({
                    open: true,
                    title: null, // Custom addition to hide title
                    severity: latest.type === 'error' ? 'error' : 'warning',
                    message: latest.message,
                    isConfirm: false,
                    onNotificationOk: async () => {
                        await markNotificationRead(latest.id);
                    }
                });
            }
        } catch (err) {
            console.error("Error fetching notifications", err);
        }
    };

    const fetchStudentProgress = async (id) => {
        try {
            const res = await getParentStudentSnapshot(id);
            setStudentData(res.data);
        } catch (err) {
            console.error("Error fetching child's progress");
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/parent-login'); // Redirect to login page
    };

    const todayDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>

            {/* =========== LEFT SIDEBAR =========== */}
            <ParentSidebar parent={parent} handleLogout={handleLogout} />

            {/* =========== RIGHT CONTENT AREA =========== */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                {/* TOP NAVBAR */}
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31', borderBottom: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                Ward Monitoring
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 500 }}>
                                {todayDate}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>

                {/* SCROLLABLE MAIN CONTENT */}
                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1 }}>
                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {loading ? (
                            <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} />
                        ) : (
                            <>
                                {/* Gradient Banner Card (Similar to UserDashboard) */}
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
                                            {parent?.name?.charAt(0) || 'P'}
                                        </Avatar>

                                        <Grid container justifyContent="space-between" alignItems="flex-end">
                                            <Grid item>
                                                <Typography variant="h4" sx={{ fontWeight: 800, color: '#091e42', mb: 0.5 }}>
                                                    {parent?.name || 'Loading Parent...'}
                                                </Typography>
                                                <Typography variant="h6" sx={{ color: '#091e42', fontWeight: 600, mb: 0.5 }}>
                                                    Student: {studentData?.name || 'Loading Student...'}
                                                </Typography>
                                                <Typography variant="subtitle1" sx={{ color: '#5e6c84', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 1 }}>
                                                    <AssignmentIcon fontSize="small" /> Currently Enrolled Student
                                                </Typography>
                                            </Grid>
                                            <Grid item>
                                                <Typography variant="subtitle2" sx={{ color: '#10b981', fontWeight: 600, bgcolor: 'rgba(16, 185, 129, 0.1)', px: 2, py: 0.5, borderRadius: 1 }}>
                                                    Active Status
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    </Box>
                                </Paper>

                                {/* Details Section */}
                                <Typography variant="h6" sx={{ fontWeight: 700, color: '#091e42', mb: 3 }}>
                                    Academic Performance & Record
                                </Typography>

                                <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #edf1f7', bgcolor: '#fff' }}>
                                    <Grid container spacing={4}>
                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
                                                    Current Attendance
                                                </Typography>
                                                <Typography variant="h3" sx={{ color: studentData?.attendance_per < 75 ? '#d32f2f' : '#10b981', fontWeight: 800 }}>
                                                    {studentData?.attendance_per || 0}%
                                                </Typography>
                                            </Box>
                                        </Grid>

                                        <Grid item xs={12} sm={6}>
                                            <Box sx={{ p: 3, bgcolor: '#f8fafc', borderRadius: 3, border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                                <Typography variant="caption" sx={{ color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5, mb: 1 }}>
                                                    Latest Internal Total
                                                </Typography>
                                                <Typography variant="h3" sx={{ color: '#3b82f6', fontWeight: 800 }}>
                                                    {studentData?.internal_total || 'N/A'}
                                                </Typography>
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Paper>
                            </>
                        )}

                    </Box>
                </Box>

                <FooterBlack />
            </Box>

            <CustomModal
                open={modalProps.open}
                handleClose={() => {
                    if (modalProps.onNotificationOk) modalProps.onNotificationOk();
                    setModalProps({ ...modalProps, open: false });
                }}
                severity={modalProps.severity}
                message={modalProps.message}
                title={modalProps.title}
            />
        </Box>
    );
};

export default ParentDashboard;