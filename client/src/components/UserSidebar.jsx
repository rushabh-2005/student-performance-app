import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import LogoutIcon from '@mui/icons-material/Logout';
import VisibilityIcon from '@mui/icons-material/Visibility';
import LockIcon from '@mui/icons-material/Lock';
import { useNavigate, useLocation } from 'react-router-dom';
import { getStudentResults } from '../services/api';

const drawerWidth = 260;

const UserSidebar = ({ user, handleLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const [isPublished, setIsPublished] = useState(false);

    useEffect(() => {
        const checkResults = async () => {
            if (user?.id) {
                try {
                    const response = await getStudentResults(user.id);
                    const results = response.data;
                    const publishedForCurrentSem = results.some(r => r.semester === user.current_sem);
                    setIsPublished(publishedForCurrentSem);
                } catch (error) {
                    console.error("Error checking results:", error);
                }
            }
        };
        checkResults();
    }, [user?.id, user?.current_sem]);

    const getStudentName = (fullName) => {
        if (!fullName) return '';
        const parts = fullName.trim().split(' ');
        if (parts.length >= 3) {
            return parts.slice(0, 2).join(' '); // Drop the father/parent name
        }
        return fullName;
    };

    const studentName = getStudentName(user?.name);

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: drawerWidth,
                flexShrink: 0,
                '& .MuiDrawer-paper': {
                    width: drawerWidth,
                    boxSizing: 'border-box',
                    bgcolor: '#0a192f', // Sleek dark navy
                    color: '#fff',
                    borderRight: 'none',
                    boxShadow: '4px 0 24px rgba(0,0,0,0.08)'
                },
            }}
        >
            <Box sx={{ p: 3, pt: 4, pb: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800, color: '#e6f1ff', letterSpacing: 1 }}>
                    Student<span style={{ color: '#64ffda' }}>Portal</span>
                </Typography>
            </Box>

            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.05)', mx: 2, borderRadius: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#64ffda', color: '#0a192f', fontWeight: 'bold' }}>
                    {studentName.charAt(0)}
                </Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ccd6f6' }}>{studentName}</Typography>
                    <Typography variant="caption" sx={{ color: '#8892b0' }}>{user?.current_sem}</Typography>
                </Box>
            </Box>

            <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
                <ListItem button onClick={() => navigate('/user/dashboard')} sx={{ bgcolor: location.pathname === '/user/dashboard' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1 }}>
                    <ListItemIcon sx={{ color: location.pathname === '/user/dashboard' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Dashboard" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/user/dashboard' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/manage-profile')} sx={{ bgcolor: location.pathname === '/user/manage-profile' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1 }}>
                    <ListItemIcon sx={{ color: location.pathname === '/user/manage-profile' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Manage Profile" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/user/manage-profile' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/analytics')} sx={{ bgcolor: location.pathname === '/user/analytics' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1 }}>
                    <ListItemIcon sx={{ color: location.pathname === '/user/analytics' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Analytical Dashboard" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/user/analytics' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/view-results')} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Results" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/internal-marks')} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Internal Marks" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/view-attendance')} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="View Attendance" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/full-marksheet')} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Full Marksheet" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/user/study-log')} sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Study Log" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem>

                <ListItem
                    button
                    disabled={isPublished}
                    onClick={() => !isPublished && navigate('/user/predict-score')}
                    sx={{
                        borderRadius: 2,
                        mb: 1,
                        opacity: isPublished ? 0.5 : 1,
                        cursor: isPublished ? 'not-allowed' : 'pointer',
                        '&:hover': { bgcolor: isPublished ? 'transparent' : 'rgba(255,255,255,0.05)' }
                    }}
                >
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        {isPublished ? <LockIcon fontSize="small" /> : <AssessmentIcon />}
                    </ListItemIcon>
                    <ListItemText
                        primary="Predict Score"
                        secondary={isPublished ? "Results Published" : null}
                        primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }}
                        secondaryTypographyProps={{ fontSize: '0.65rem', color: '#ff7b72' }}
                    />
                </ListItem>

            </List>

            <Divider sx={{ borderColor: 'rgba(255,255,255,0.1)', mx: 3, mb: 2 }} />

            <List sx={{ px: 2, mb: 2 }}>
                <ListItem button onClick={handleLogout} sx={{ borderRadius: 2, '&:hover': { bgcolor: 'rgba(255,100,100,0.1)' } }}>
                    <ListItemIcon sx={{ color: '#ff7b72', minWidth: 40 }}>
                        <LogoutIcon />
                    </ListItemIcon>
                    <ListItemText primary="Logout" primaryTypographyProps={{ fontWeight: 500, color: '#ff7b72' }} />
                </ListItem>
            </List>
        </Drawer>
    );
};

export default UserSidebar;
