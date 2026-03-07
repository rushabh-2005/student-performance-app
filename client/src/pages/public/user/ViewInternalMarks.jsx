import React, { useState, useEffect } from 'react';
import { getSubjectsBySem, getStudentInternals } from '../../../services/api';

import {
    Container, Paper, Typography, Box, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Chip, Divider, CircularProgress
} from '@mui/material';

import UserNav from '../../../components/UserNav';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';

const ViewInternalMarks = () => {
    const [loading, setLoading] = useState(true);
    const [marksData, setMarksData] = useState(null);
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

            // 2. Fetch the actual internal marks
            const resRes = await getStudentInternals(userId);
            // Filter for the current semester result 
            // NOTE: Assuming internal marks are saved as regular results or the latest result per semester.
            const currentRes = resRes.data.reverse().find(r => r.semester === semester);
            setMarksData(currentRes);
        } catch (err) {
            console.error("Error fetching internal marks data");
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
            <Container maxWidth="md" sx={{ mt: 5, mb: 10, flexGrow: 1, position: 'relative', zIndex: 10 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2, borderTop: '5px solid #1a237e' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>Internal Marks Report</Typography>
                        <Typography variant="subtitle1" color="textSecondary">{user?.current_sem} | Institutional Assessment</Typography>
                    </Box>

                    <Divider sx={{ mb: 4 }} />

                    {!marksData ? (
                        <Box padding={5} textAlign="center">
                            <Typography variant="h6" color="textSecondary">
                                Internal marks for this semester have not been published by the Admin yet.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f0f4f8' }}>
                                        <TableRow>
                                            <TableCell><strong>Subject Detail</strong></TableCell>
                                            <TableCell align="center"><strong>Obtained Marks</strong></TableCell>
                                            <TableCell align="center"><strong>Performance Indicator</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {/* Dynamic Mapping Logic */}
                                        {subjects.map((sub) => {
                                            const mark = marksData[`subject_${sub.slot_number}`] || 0;
                                            return (
                                                <TableRow key={sub.id} hover>
                                                    <TableCell sx={{ color: '#333', fontWeight: 500 }}>{sub.subject_name}</TableCell>
                                                    <TableCell align="center">{mark}</TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={mark >= 40 ? "Satisfactory" : "Needs Improvement"}
                                                            color={mark >= 40 ? "success" : "warning"}
                                                            size="small"
                                                            variant="outlined"
                                                            sx={{ fontWeight: 'bold' }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        <TableRow sx={{ bgcolor: '#fff9f0' }}>
                                            <TableCell><strong>Extra Curricular Activities</strong></TableCell>
                                            <TableCell align="center">{marksData.extra_curricular}</TableCell>
                                            <TableCell />
                                        </TableRow>
                                        <TableRow>
                                            <TableCell colSpan={1} align="right"><Typography variant="subtitle1" fontWeight="bold">Total Score</Typography></TableCell>
                                            <TableCell align="center">
                                                <Typography variant="h6" sx={{ color: '#1a237e', fontWeight: 'bold' }}>{marksData.total_internal}</Typography>
                                            </TableCell>
                                            <TableCell />
                                        </TableRow>
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 5, p: 2, bgcolor: '#e8eaf6', borderRadius: 2, borderLeft: '4px solid #1a237e' }}>
                                <Typography variant="body2" sx={{ color: '#3f51b5' }}>
                                    * Note: These internal records evaluate your regular assessments. Final grades may differ depending on external examinations.
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

export default ViewInternalMarks;
