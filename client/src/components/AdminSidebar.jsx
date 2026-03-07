import React from 'react';
import { Box, Typography, Avatar, List, ListItem, ListItemIcon, ListItemText, Divider, Drawer } from '@mui/material';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import LogoutIcon from '@mui/icons-material/Logout';

const drawerWidth = 260;

const AdminSidebar = ({ admin, handleLogout, menuItems }) => {
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
                    Admin<span style={{ color: '#64ffda' }}>Portal</span>
                </Typography>
            </Box>

            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 2, mb: 2, bgcolor: 'rgba(255,255,255,0.05)', mx: 2, borderRadius: 2 }}>
                <Avatar sx={{ width: 40, height: 40, bgcolor: '#64ffda', color: '#0a192f', fontWeight: 'bold' }}>
                    {admin?.name?.charAt(0) || 'A'}
                </Avatar>
                <Box>
                    <Typography variant="body2" sx={{ fontWeight: 600, color: '#ccd6f6' }}>{admin?.name || 'Administrator'}</Typography>
                    <Typography variant="caption" sx={{ color: '#8892b0' }}>System Admin</Typography>
                </Box>
            </Box>

            <List sx={{ px: 2, pt: 2, flexGrow: 1 }}>
                {menuItems.map((item) => {
                    const isActive = location.pathname === item.path;
                    return (
                        <ListItem
                            button
                            key={item.text}
                            component={Link}
                            to={item.path}
                            sx={{
                                borderRadius: 2,
                                mb: 1,
                                bgcolor: isActive ? 'rgba(100, 255, 218, 0.1)' : 'transparent',
                                '&:hover': { bgcolor: isActive ? 'rgba(100, 255, 218, 0.1)' : 'rgba(255,255,255,0.05)' }
                            }}
                        >
                            <ListItemIcon sx={{ color: isActive ? '#64ffda' : '#8892b0', minWidth: 40 }}>
                                {item.icon}
                            </ListItemIcon>
                            <ListItemText
                                primary={item.text}
                                primaryTypographyProps={{ fontWeight: isActive ? 600 : 500, color: isActive ? '#64ffda' : '#8892b0' }}
                            />
                        </ListItem>
                    );
                })}
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

export default AdminSidebar;
