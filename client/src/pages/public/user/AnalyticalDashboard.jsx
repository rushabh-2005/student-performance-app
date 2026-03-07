import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Grid, Card, CardContent, Container, CircularProgress,
    useTheme, Divider, Paper, Stack
} from '@mui/material';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
    PieChart, Pie, Cell, LineChart, Line, AreaChart, Area
} from 'recharts';
import { getStudentAnalytics } from '../../../services/api';
import UserSidebar from '../../../components/UserSidebar';
import FooterBlack from '../../../components/FooterBlack';
import DashboardIcon from '@mui/icons-material/Dashboard';
import AssessmentIcon from '@mui/icons-material/Assessment';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import DownloadIcon from '@mui/icons-material/Download';
import TooltipMui from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Button from '@mui/material/Button';
import '../../../Css_Files/HomeCss.css';

const AnalyticalDashboard = () => {
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const user = JSON.parse(localStorage.getItem('user'));
    const theme = useTheme();

    useEffect(() => {
        if (user?.id) {
            fetchAnalytics();
        }
    }, [user?.id]);

    const fetchAnalytics = async () => {
        try {
            const res = await getStudentAnalytics(user.id);
            setData(res.data);
            setLoading(false);
        } catch (err) {
            console.error("Error fetching analytics:", err);
            setLoading(false);
        }
    };

    const COLORS = ['#64ffda', '#ff7b72', '#ffc107', '#4caf50'];

    if (loading) {
        return (
            <Box sx={{ display: 'flex', height: '100vh', alignItems: 'center', justifyContent: 'center', bgcolor: '#0a192f' }}>
                <CircularProgress sx={{ color: '#64ffda' }} />
            </Box>
        );
    }

    const { summary, subject_analysis, attendance_stats, study_analysis } = data || {};

    const SUBJECT_COLORS = ['#64ffda', '#ff7b72', '#fbbf24', '#60a5fa', '#a78bfa', '#f472b6', '#4ade80'];

    const StatCard = ({ title, value, unit, icon, color, subtitle }) => (
        <Card sx={{
            bgcolor: 'rgba(255, 255, 255, 0.03)',
            borderRadius: 5,
            backdropFilter: 'blur(20px)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
                transform: 'translateY(-8px)',
                border: `1px solid ${color}80`,
                boxShadow: `0 12px 24px ${color}15`
            },
            height: '100%'
        }}>
            <Box sx={{
                position: 'absolute', top: -20, right: -20,
                width: 100, height: 100, borderRadius: '50%',
                bgcolor: `${color}10`, zIndex: 0
            }} />
            <CardContent sx={{ p: 3, position: 'relative', zIndex: 1 }}>
                <Stack spacing={2}>
                    <Box sx={{
                        width: 48, height: 48, borderRadius: 3,
                        bgcolor: `${color}15`, color: color,
                        display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                        {icon}
                    </Box>
                    <Box>
                        <Stack direction="row" alignItems="flex-end" spacing={0.5}>
                            <Typography variant="h3" sx={{ color: '#ccd6f6', fontWeight: 800, lineHeight: 1 }}>
                                {value}
                            </Typography>
                            <Typography variant="h6" sx={{ color: color, fontWeight: 600, mb: 0.5 }}>
                                {unit}
                            </Typography>
                        </Stack>
                        <Typography variant="subtitle2" sx={{ color: '#8892b0', fontWeight: 600, mt: 1, textTransform: 'uppercase', letterSpacing: 1 }}>
                            {title}
                        </Typography>
                        {subtitle && (
                            <Typography variant="caption" sx={{ color: '#4ade80', fontWeight: 500, display: 'block', mt: 0.5 }}>
                                {subtitle}
                            </Typography>
                        )}
                    </Box>
                </Stack>
            </CardContent>
        </Card>
    );

    const ModernChartContainer = ({ title, children, icon, color }) => (
        <Paper sx={{
            p: 4,
            bgcolor: 'rgba(255, 255, 255, 0.02)',
            borderRadius: 6,
            height: '100%',
            border: '1px solid rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)'
        }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 4 }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                    <Box sx={{ color: color }}>{icon}</Box>
                    <Typography variant="h6" sx={{ color: '#ccd6f6', fontWeight: 700 }}>
                        {title}
                    </Typography>
                </Stack>
            </Stack>
            <Box sx={{ height: 320, width: '100%' }}>
                {children}
            </Box>
        </Paper>
    );

    return (
        <Box sx={{ display: 'flex', height: '100vh', bgcolor: '#0a192f', overflow: 'hidden' }}>
            <UserSidebar user={user} handleLogout={() => { localStorage.removeItem('user'); window.location.href = '/'; }} />

            {/* Main Content Area */}
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', position: 'relative' }}>

                {/* Visual Decorative Backgrounds */}
                <Box sx={{ position: 'fixed', top: '10%', right: '5%', width: '400px', height: '400px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(100, 255, 218, 0.05) 0%, transparent 70%)', filter: 'blur(60px)', zIndex: 0 }} />
                <Box sx={{ position: 'fixed', bottom: '10%', left: '20%', width: '500px', height: '500px', borderRadius: '50%', background: 'radial-gradient(circle, rgba(255, 123, 114, 0.03) 0%, transparent 70%)', filter: 'blur(80px)', zIndex: 0 }} />

                {/* Scrollable Content */}
                <Box sx={{ flexGrow: 1, overflowY: 'auto', p: { xs: 2, md: 5 }, pt: { xs: 4, md: 6 } }}>
                    <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 1, pb: 4 }}>
                        {/* Header Snapshot Area with Download Button */}
                        <Box sx={{ mb: 6, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                            <Box>
                                <Typography variant="h3" sx={{ color: '#ccd6f6', fontWeight: 900, mb: 1, letterSpacing: -0.5 }}>
                                    Dashboard <span style={{ color: '#64ffda' }}>Analytics</span>
                                </Typography>
                                <Stack direction="row" spacing={2} alignItems="center">
                                    <Box sx={{ px: 2, py: 0.5, borderRadius: 2, bgcolor: 'rgba(100, 255, 218, 0.1)', color: '#64ffda', fontSize: '0.875rem', fontWeight: 600 }}>
                                        Live Snapshot
                                    </Box>
                                    <Typography variant="body1" sx={{ color: '#8892b0', fontWeight: 500 }}>
                                        Performance overview for {user?.current_sem}
                                    </Typography>
                                </Stack>
                            </Box>

                            <Box sx={{ textAlign: 'right' }}>
                                <TooltipMui
                                    title={!data?.can_download ? (
                                        <Box sx={{ p: 1 }}>
                                            <Typography variant="caption" sx={{ display: 'block', fontWeight: 'bold', mb: 0.5 }}>Requirements for Download:</Typography>
                                            <Typography variant="caption" sx={{ color: data?.publishing_status?.internal_published ? '#64ffda' : '#ff7b72', display: 'block' }}>
                                                • Admin must publish Internals {data?.publishing_status?.internal_published ? '✓' : '✗'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: data?.publishing_status?.external_published ? '#64ffda' : '#ff7b72', display: 'block' }}>
                                                • Admin must publish Externals {data?.publishing_status?.external_published ? '✓' : '✗'}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: data?.publishing_status?.user_data_entered ? '#64ffda' : '#ff7b72', display: 'block' }}>
                                                • You must add Study Logs {data?.publishing_status?.user_data_entered ? '✓' : '✗'}
                                            </Typography>
                                        </Box>
                                    ) : "Download Analytics Report"}
                                    arrow
                                >
                                </TooltipMui>
                                {!data?.can_download && (
                                    <Typography variant="caption" sx={{ color: '#8892b0', display: 'block', mt: 1, fontWeight: 500 }}>
                                        <HelpOutlineIcon sx={{ fontSize: 14, verticalAlign: 'middle', mr: 0.5 }} />
                                        Requirements not met
                                    </Typography>
                                )}
                            </Box>
                        </Box>

                        {/* Stats Grid */}
                        <Grid container spacing={4} sx={{ mb: 6 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Avg Internal" value={summary?.avg_internal || 0} unit="pts" icon={<AssessmentIcon />} color="#64ffda" subtitle="Above class avg" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Avg External" value={summary?.avg_external || 0} unit="pts" icon={<AssessmentIcon />} color="#ff7b72" />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Attendance" value={summary?.attendance_per || 0} unit="%" icon={<DashboardIcon />} color="#60a5fa" subtitle={`${attendance_stats?.present || 0} classes attended`} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatCard title="Study Power" value={summary?.avg_study_hours || 0} unit="h" icon={<AccessTimeIcon />} color="#fbbf24" subtitle="Daily consistency" />
                            </Grid>
                        </Grid>

                        {/* Charts Row */}
                        <Grid container spacing={4}>
                            {/* Full width top chart */}
                            <Grid item xs={12} lg={12}>
                                <ModernChartContainer title="Subject Performance Breakdown" icon={<TrendingUpIcon />} color="#64ffda">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <BarChart data={subject_analysis} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
                                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                                            <XAxis dataKey="subject" stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} dy={10} />
                                            <YAxis stroke="#8892b0" fontSize={11} tickLine={false} axisLine={false} />
                                            <Tooltip
                                                cursor={{ fill: 'rgba(255,255,255,0.03)' }}
                                                contentStyle={{ backgroundColor: '#112240', border: 'none', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)', padding: '12px' }}
                                                itemStyle={{ fontWeight: 600 }}
                                            />
                                            <Legend verticalAlign="top" align="right" wrapperStyle={{ paddingBottom: '20px' }} iconType="circle" />
                                            <Bar dataKey="internal" name="Internals" fill="#64ffda" radius={[6, 6, 0, 0]} barSize={24} />
                                            <Bar dataKey="external" name="Externals" fill="#ff7b72" radius={[6, 6, 0, 0]} barSize={24} />
                                        </BarChart>
                                    </ResponsiveContainer>
                                </ModernChartContainer>
                            </Grid>

                            {/* Side by side bottom charts */}
                            <Grid item xs={12} lg={6}>
                                <ModernChartContainer title="Attendance Health" icon={<DashboardIcon />} color="#60a5fa">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={[
                                                    { name: 'Present', value: attendance_stats?.present || 0 },
                                                    { name: 'Absent', value: attendance_stats?.absent || 0 }
                                                ]}
                                                cx="50%" cy="50%" innerRadius={85} outerRadius={110} paddingAngle={10} dataKey="value"
                                            >
                                                <Cell key="cell-0" fill="#64ffda" stroke="none" />
                                                <Cell key="cell-1" fill="rgba(255,255,255,0.05)" stroke="none" />
                                            </Pie>
                                            <Tooltip contentStyle={{ backgroundColor: '#112240', border: 'none', borderRadius: 8 }} />
                                            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" style={{ fill: '#ccd6f6', fontWeight: 900, fontSize: '2rem' }}>
                                                {summary?.attendance_per || 0}%
                                            </text>
                                            <text x="50%" y="60%" textAnchor="middle" dominantBaseline="middle" style={{ fill: '#8892b0', fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                                Present
                                            </text>
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ModernChartContainer>
                            </Grid>

                            <Grid item xs={12} lg={6}>
                                <ModernChartContainer title="Subject-wise Study Time" icon={<AccessTimeIcon />} color="#fbbf24">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <PieChart>
                                            <Pie
                                                data={study_analysis}
                                                innerRadius={80}
                                                outerRadius={120}
                                                paddingAngle={5}
                                                dataKey="value"
                                            >
                                                {study_analysis?.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={SUBJECT_COLORS[index % SUBJECT_COLORS.length]} stroke="none" />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                contentStyle={{ backgroundColor: '#112240', border: 'none', borderRadius: 12, boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}
                                                itemStyle={{ color: '#ccd6f6' }}
                                                formatter={(value) => [`${value} Hours`, 'Time Spent']}
                                            />
                                            <Legend
                                                iconType="circle"
                                                layout="vertical"
                                                verticalAlign="middle"
                                                align="right"
                                                wrapperStyle={{ paddingLeft: '20px' }}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </ModernChartContainer>
                            </Grid>
                        </Grid>
                    </Container>
                </Box>

                {/* Properly Pinned Footer */}
                <FooterBlack />
            </Box>
        </Box>
    );
};

export default AnalyticalDashboard;
