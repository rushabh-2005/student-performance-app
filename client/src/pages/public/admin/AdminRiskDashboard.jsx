import React, { useState, useEffect } from 'react';
import { getAdminOverviewDesk, notifyParent } from '../../../services/api';
import CustomModal from '../../../components/CustomModal';

import { Container, Paper, Table, TableBody, TableCell, TableHead, TableRow, TableContainer, Typography, Chip, Select, MenuItem, FormControl, InputLabel, Button } from '@mui/material';

import FooterBlack from '../../../components/FooterBlack';
import AdminNav from '../../../components/AdminNav';
import '../../../Css_Files/HomeCss.css';

const AdminRiskDashboard = () => {
    const [semester, setSemester] = useState('Sem 1');
    const [data, setData] = useState([]);
    const [modal, setModal] = useState({ open: false, severity: 'success', message: '' });

    useEffect(() => {
        fetchOverview();
    }, [semester]);

    const fetchOverview = async () => {
        const res = await getAdminOverviewDesk(semester);
        setData(res.data);
    };

    const handleNotify = async (student) => {
        try {
            const res = await notifyParent({
                student_id: student.id,
                student_name: student.name,
                risk_level: student.risk_level
            });
            setModal({
                open: true,
                severity: 'success',
                message: res.data.message + `\nEmail simulated to: ${res.data.email_sent_to}`
            });
        } catch (err) {
            console.error("Notify error:", err.response?.data);
            const errMsg = err.response?.data?.messages?.error || err.response?.data?.message || err.message || "Unknown error";
            setModal({
                open: true,
                severity: 'error',
                message: `Error: ${errMsg}\n\nEnsure the parent is registered for this student.`
            });
        }
    };

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>

            <AdminNav />

            {/* ================= MAIN CONTENT ================= */}
            <Container maxWidth="lg" sx={{ mt: 4, flexGrow: 1, position: 'relative', zIndex: 10 }}>
                <Paper sx={{ p: 3, mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" fontWeight="bold">Student Monitoring Dashboard</Typography>
                    <FormControl sx={{ minWidth: 150 }}>
                        <InputLabel>Semester</InputLabel>
                        <Select value={semester} label="Semester" onChange={(e) => setSemester(e.target.value)}>
                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <MenuItem key={n} value={`Sem ${n}`}>Sem {n}</MenuItem>)}
                        </Select>
                    </FormControl>
                </Paper>

                <TableContainer component={Paper}>
                    <Table>
                        <TableHead sx={{ bgcolor: '#f5f5f5' }}>
                            <TableRow>
                                <TableCell><strong>Student Name</strong></TableCell>
                                <TableCell align="center"><strong>Attendance %</strong></TableCell>
                                <TableCell align="center"><strong>Internal Score</strong></TableCell>
                                <TableCell align="center"><strong>Avg Study (Hrs)</strong></TableCell>
                                <TableCell align="center"><strong>Status</strong></TableCell>
                                <TableCell align="center"><strong>Action</strong></TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {data.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell>
                                        {row.name} <Typography variant="caption" color="textSecondary">(ID: {row.id})</Typography>
                                    </TableCell>
                                    <TableCell align="center" sx={{ color: row.attendance_per < 75 ? 'red' : 'inherit' }}>
                                        {row.attendance_per}%
                                    </TableCell>
                                    <TableCell align="center">{row.internal_total}</TableCell>
                                    <TableCell align="center">{row.avg_study_hours}h</TableCell>
                                    <TableCell align="center">
                                        <Chip
                                            label={row.risk_level}
                                            color={row.risk_level === 'High' ? 'error' : 'success'}
                                            variant="contained"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            color="primary"
                                            onClick={() => handleNotify(row)}
                                            disabled={row.risk_level === 'Normal'}
                                        >
                                            Notify Parent
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Container>
            <FooterBlack />
            <CustomModal
                open={modal.open}
                handleClose={() => setModal({ ...modal, open: false })}
                severity={modal.severity}
                message={modal.message}
            />
        </div>
    );
};

export default AdminRiskDashboard;