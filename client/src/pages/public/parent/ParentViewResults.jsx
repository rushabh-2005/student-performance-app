import React, { useState, useEffect } from 'react';
import { getParentStudentSnapshot, getSubjectsBySem, getStudentResults } from '../../../services/api';

import { Paper, Typography, Box, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Divider, CircularProgress, AppBar, Toolbar } from '@mui/material';

import { useNavigate } from 'react-router-dom';
import ParentSidebar from '../../../components/ParentSidebar';
import FooterBlack from '../../../components/FooterBlack';

const ParentViewResults = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [studentData, setStudentData] = useState(null);
    const [parent] = useState(JSON.parse(localStorage.getItem('user')));
    const navigate = useNavigate();

    useEffect(() => {
        if (parent && parent.student_id) {
            fetchData(parent.student_id);
        } else {
            navigate('/parent-login');
        }
    }, [parent, navigate]);

    const fetchData = async (studentId) => {
        try {
            const snapRes = await getParentStudentSnapshot(studentId);
            const student = snapRes.data;
            setStudentData(student);
            const semester = student.current_sem;

            const subRes = await getSubjectsBySem(semester);
            setSubjects(subRes.data);

            const resRes = await getStudentResults(studentId);
            const currentRes = resRes.data.find(r => r.semester === semester);
            setResults(currentRes);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/parent-login');
    };

    const todayDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>
            <ParentSidebar parent={parent} handleLogout={handleLogout} />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31', borderBottom: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                View External Marks
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 500 }}>
                                {todayDate}
                            </Typography>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1 }}>
                    <Box sx={{ maxWidth: 1000, mx: 'auto' }}>
                        {loading ? <CircularProgress sx={{ display: 'block', mx: 'auto', mt: 10 }} /> : (
                            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #edf1f7', bgcolor: '#fff' }}>
                                <Box sx={{ textAlign: 'center', mb: 4 }}>
                                    <Typography variant="h4" fontWeight="bold" color="primary">Academic Transcript</Typography>
                                    <Typography variant="subtitle1" color="textSecondary">{studentData?.name} | {studentData?.current_sem} | Examination Results</Typography>
                                </Box>
                                <Divider sx={{ mb: 4 }} />
                                {!results ? (
                                    <Box padding={5} textAlign="center">
                                        <Typography variant="h6" color="textSecondary">Results for this semester have not been published yet.</Typography>
                                    </Box>
                                ) : (
                                    <TableContainer>
                                        <Table>
                                            <TableHead sx={{ bgcolor: '#f9fafb' }}>
                                                <TableRow>
                                                    <TableCell><strong>Subject</strong></TableCell>
                                                    <TableCell align="center"><strong>Obtained Marks</strong></TableCell>
                                                    <TableCell align="center"><strong>Status</strong></TableCell>
                                                </TableRow>
                                            </TableHead>
                                            <TableBody>
                                                {subjects.map((sub) => {
                                                    const mark = results[`subject_${sub.slot_number}`] || 0;
                                                    return (
                                                        <TableRow key={sub.id}>
                                                            <TableCell>{sub.subject_name}</TableCell>
                                                            <TableCell align="center">{mark}</TableCell>
                                                            <TableCell align="center">
                                                                <Chip label={mark >= 33 ? "Pass" : "Fail"} color={mark >= 33 ? "success" : "error"} size="small" />
                                                            </TableCell>
                                                        </TableRow>
                                                    );
                                                })}
                                                <TableRow sx={{ bgcolor: '#fff9f0' }}>
                                                    <TableCell><strong>Extra Curricular</strong></TableCell>
                                                    <TableCell align="center">{results.extra_curricular}</TableCell>
                                                    <TableCell />
                                                </TableRow>
                                                <TableRow>
                                                    <TableCell><Typography variant="h6">Total</Typography></TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="h6" color="primary">{results.total_marks}</Typography>
                                                    </TableCell>
                                                    <TableCell />
                                                </TableRow>
                                            </TableBody>
                                        </Table>
                                    </TableContainer>
                                )}
                            </Paper>
                        )}
                    </Box>
                </Box>
                <FooterBlack />
            </Box>
        </Box>
    );
};
export default ParentViewResults;
