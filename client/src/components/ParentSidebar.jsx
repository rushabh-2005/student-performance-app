import React from 'react';
import {
    Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer
} from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutIcon from '@mui/icons-material/Logout';
import AssessmentIcon from '@mui/icons-material/Assessment';
import VisibilityIcon from '@mui/icons-material/Visibility';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 260;

const ParentSidebar = ({ parent, handleLogout }) => {
    const navigate = useNavigate();
    const location = useLocation();

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
                    Parent<span style={{ color: '#64ffda' }}>Portal</span>
                </Typography>
            </Box>

            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.05)', mx: 2, borderRadius: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#64ffda', color: '#0a192f', fontWeight: 'bold' }}>
                    {parent?.name?.charAt(0) || 'P'}
                </Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ccd6f6' }}>{parent?.name || 'Parent'}</Typography>
                    <Typography variant="caption" sx={{ color: '#8892b0' }}>Parent Account</Typography>
                </Box>
            </Box>

            <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
                <ListItem button onClick={() => navigate('/parent/dashboard')} sx={{ bgcolor: location.pathname === '/parent/dashboard' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' } }}>
                    <ListItemIcon sx={{ color: location.pathname === '/parent/dashboard' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <DashboardIcon />
                    </ListItemIcon>
                    <ListItemText primary="Ward Monitoring" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/parent/dashboard' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/parent/internal-marks')} sx={{ bgcolor: location.pathname === '/parent/internal-marks' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' } }}>
                    <ListItemIcon sx={{ color: location.pathname === '/parent/internal-marks' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Internal Marks" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/parent/internal-marks' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/parent/view-results')} sx={{ bgcolor: location.pathname === '/parent/view-results' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' } }}>
                    <ListItemIcon sx={{ color: location.pathname === '/parent/view-results' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <VisibilityIcon />
                    </ListItemIcon>
                    <ListItemText primary="External Marks" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/parent/view-results' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/parent/analytics')} sx={{ bgcolor: location.pathname === '/parent/analytics' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' } }}>
                    <ListItemIcon sx={{ color: location.pathname === '/parent/analytics' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <TrendingUpIcon />
                    </ListItemIcon>
                    <ListItemText primary="Performance Analytics" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/parent/analytics' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                <ListItem button onClick={() => navigate('/parent/full-marksheet')} sx={{ bgcolor: location.pathname === '/parent/full-marksheet' ? 'rgba(100, 255, 218, 0.1)' : 'transparent', borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(100, 255, 218, 0.1)' } }}>
                    <ListItemIcon sx={{ color: location.pathname === '/parent/full-marksheet' ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                        <AssessmentIcon />
                    </ListItemIcon>
                    <ListItemText primary="Full Marksheet" primaryTypographyProps={{ fontWeight: 600, color: location.pathname === '/parent/full-marksheet' ? '#64ffda' : '#8892b0' }} />
                </ListItem>

                {/* <ListItem button sx={{ borderRadius: 2, mb: 1, '&:hover': { bgcolor: 'rgba(255,255,255,0.05)' } }}>
                    <ListItemIcon sx={{ color: '#8892b0', minWidth: 40 }}>
                        <SettingsOutlinedIcon />
                    </ListItemIcon>
                    <ListItemText primary="Settings" primaryTypographyProps={{ fontWeight: 500, color: '#8892b0' }} />
                </ListItem> */}
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

export default ParentSidebar;
