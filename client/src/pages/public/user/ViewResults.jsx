import React, { useState, useEffect } from 'react';
import { getSubjectsBySem, getStudentResults } from '../../../services/api';

import {
    Container, Paper, Typography, Box, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Divider, CircularProgress
} from '@mui/material';

import UserNav from '../../../components/UserNav';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';

const ViewResults = () => {
    const [loading, setLoading] = useState(true);
    const [results, setResults] = useState(null);
    const [subjects, setSubjects] = useState([]);
    const [user, setUser] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            fetchData(loggedInUser.id, loggedInUser.current_sem);
        }
    }, []);

    const fetchData = async (userId, semester) => {
        try {
            // 1. Fetch the subject names for this semester
            const subRes = await getSubjectsBySem(semester);
            setSubjects(subRes.data);

            // 2. Fetch the actual marks (using the route from your Routes.php)
            const resRes = await getStudentResults(userId);
            // Filter for the current semester result
            const currentRes = resRes.data.find(r => r.semester === semester);
            setResults(currentRes);
        } catch (err) {
            console.error("Error fetching result data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <UserNav />
            <Container maxWidth="md" sx={{ mt: 5, mb: 10, position: 'relative', zIndex: 10, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" color="primary">Academic Transcript</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{user?.current_sem} | Examination Results</Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {!results ? (
                        <Typography align="center" variant="h6" color="textSecondary">
                            Results for this semester have not been published yet.
                        </Typography>
                    ) : (
                        <>
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
                                        {/* Dynamic Mapping Logic */}
                                        {subjects.map((sub) => (
                                            <TableRow key={sub.id}>
                                                <TableCell>{sub.subject_name}</TableCell>
                                                <TableCell align="center">{results[`subject_${sub.slot_number}`]}</TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={results[`subject_${sub.slot_number}`] >= 33 ? "Pass" : "Fail"}
                                                        color={results[`subject_${sub.slot_number}`] >= 33 ? "success" : "error"}
                                                        size="small"
                                                    />
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                        <TableRow sx={{ bgcolor: '#fff9f0' }}>
                                            <TableCell><strong>Extra Curricular</strong></TableCell>
                                            <TableCell align="center">{results.extra_curricular}</TableCell>
                                            <TableCell />
                                        </TableRow>
                                        <TableRow>
                                            <TableCell variant="footer"><Typography variant="h6">Total</Typography></TableCell>
                                            <TableCell align="center" variant="footer">
                                                <Typography variant="h6" color="primary">{results.total_marks}</Typography>
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 4, p: 2, bgcolor: '#e3f2fd', borderRadius: 1 }}>
                                <Typography variant="body2" color="primary">
                                    * These results are generated based on the official data published by the administrator.
                                </Typography>
                            </Box>
                        </>
                    )}
                </Paper>
            </Container>
            <FooterBlack />
        </div>
    );
};

export default ViewResults;