import React, { useState, useEffect, useRef } from 'react';
import { getSubjectsBySem, getStudentResults, getStudentInternals, getParentStudentSnapshot } from '../../../services/api';

import {
    Container, Paper, Typography, Box, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress, Chip, Button, AppBar, Toolbar
} from '@mui/material';

import { useNavigate } from 'react-router-dom';
import ParentSidebar from '../../../components/ParentSidebar';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import CustomModal from '../../../components/CustomModal';

const ParentFullMarksheet = () => {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [internalData, setInternalData] = useState(null);
    const [externalData, setExternalData] = useState(null);
    const [studentInfo, setStudentInfo] = useState(null);
    const [parent] = useState(JSON.parse(localStorage.getItem('user')));
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const marksheetRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        if (parent?.student_id) {
            fetchData();
        } else {
            navigate('/parent-login');
        }
    }, [parent?.student_id]);

    const fetchData = async () => {
        try {
            const snapRes = await getParentStudentSnapshot(parent.student_id);
            const student = snapRes.data;
            setStudentInfo(student);
            const semester = student.current_sem;

            // 1. Fetch Subject Names
            const subRes = await getSubjectsBySem(semester);
            setSubjects(subRes.data);

            // 2. Fetch Internal Marks
            const intRes = await getStudentInternals(parent.student_id);
            const currentInt = intRes.data.find(r => r.semester === semester);
            setInternalData(currentInt);

            // 3. Fetch External (Final) Marks
            const extRes = await getStudentResults(parent.student_id);
            const currentExt = extRes.data.find(r => r.semester === semester);
            setExternalData(currentExt);

            if (!currentInt || !currentExt) {
                let msg = "";
                if (!currentInt && !currentExt) {
                    msg = "Internal and external marks for this semester have not been published yet.";
                } else if (!currentInt) {
                    msg = "Internal marks for this semester have not been published yet.";
                } else {
                    msg = "External marks for this semester have not been published yet.";
                }
                setModalMessage(msg);
                setModalOpen(true);
            }

        } catch (err) {
            console.error("Error loading marksheet data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        navigate('/parent-login');
    };

    const handleDownload = async () => {
        const input = marksheetRef.current;
        if (!input) return;

        try {
            const canvas = await html2canvas(input, { scale: 2 });
            const imgData = canvas.toDataURL('image/png');

            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`${studentInfo?.name}_Marksheet.pdf`);
        } catch (error) {
            console.error('Failed to download PDF:', error);
        }
    };

    const todayDate = new Date().toLocaleDateString('en-GB', {
        weekday: 'short', day: '2-digit', month: 'long', year: 'numeric'
    });

    if (loading) return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa', alignItems: 'center', justifyContent: 'center' }}>
            <CircularProgress />
        </Box>
    );

    const getCombinedTotal = () => {
        let total = 0;
        if (subjects.length > 0 && internalData && externalData) {
            subjects.forEach(sub => {
                const iMark = parseInt(internalData[`subject_${sub.slot_number}`] || 0);
                const eMark = parseInt(externalData[`subject_${sub.slot_number}`] || 0);
                total += (iMark + eMark);
            });
        }
        return total;
    };

    const externalTotal = externalData ? parseInt(externalData.total_marks) : 0;
    const maxMarks = subjects.length * 100;
    const percentage = subjects.length > 0 ? (externalTotal / maxMarks) * 100 : 0;

    let overallGrade = 'E';
    if (percentage >= 86) overallGrade = 'A';
    else if (percentage >= 71) overallGrade = 'B';
    else if (percentage >= 61) overallGrade = 'B2';
    else if (percentage >= 46) overallGrade = 'C';
    else if (percentage >= 33) overallGrade = 'D';

    // Check if student failed in any subject (External marks < 40)
    let hasFailed = false;
    if (subjects.length > 0 && internalData && externalData) {
        subjects.forEach(sub => {
            const eMark = parseInt(externalData[`subject_${sub.slot_number}`] || 0);
            if (eMark < 33) hasFailed = true;
        });
    }

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f4f7fa' }}>
            <ParentSidebar parent={parent} handleLogout={handleLogout} />
            <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                <AppBar position="static" elevation={0} sx={{ bgcolor: '#2c2c31', borderBottom: 'none' }}>
                    <Toolbar sx={{ justifyContent: 'space-between', minHeight: '70px !important', px: { md: 4 } }}>
                        <Box>
                            <Typography variant="h6" sx={{ color: '#ffffff', fontWeight: 700 }}>
                                Official Full Marksheet
                            </Typography>
                            <Typography variant="caption" sx={{ color: '#d1d5db', fontWeight: 500 }}>
                                {todayDate}
                            </Typography>
                        </Box>
                        <Box>
                            <Button
                                variant="contained"
                                color="primary"
                                startIcon={<DownloadIcon />}
                                onClick={handleDownload}
                                disabled={!internalData || !externalData}
                                sx={{
                                    bgcolor: (!internalData || !externalData) ? '#444' : '#10b981',
                                    '&:hover': { bgcolor: (!internalData || !externalData) ? '#444' : '#059669' },
                                    borderRadius: 2,
                                    textTransform: 'none',
                                    fontWeight: 600
                                }}
                            >
                                Download Marksheet
                            </Button>
                        </Box>
                    </Toolbar>
                </AppBar>

                <Box sx={{ p: { xs: 3, md: 5 }, overflowY: 'auto', flexGrow: 1 }}>
                    <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 10 }}>
                        <Paper ref={marksheetRef} elevation={0} sx={{ p: 5, borderRadius: 4, border: '1px solid #edf1f7', bgcolor: '#fff' }}>
                            <Box sx={{ textAlign: 'center', mb: 4 }}>
                                <Typography variant="h4" fontWeight="bold" sx={{ color: '#1a237e' }}>ACADEMIC TRANSCRIPT</Typography>
                                <Typography variant="h6" color="textSecondary">{studentInfo?.current_sem} | Session 2026</Typography>
                            </Box>

                            <Divider sx={{ mb: 4 }} />

                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 2 }}>
                                <Box>
                                    <Typography variant="body2" color="textSecondary">STUDENT NAME</Typography>
                                    <Typography variant="body1" fontWeight="bold">{studentInfo?.name}</Typography>
                                </Box>
                                <Box sx={{ textAlign: 'right' }}>
                                    <Typography variant="body2" color="textSecondary">STUDENT ID</Typography>
                                    <Typography variant="body1" fontWeight="bold">{studentInfo?.id}</Typography>
                                </Box>
                            </Box>

                            <TableContainer component={Paper} variant="outlined" sx={{ borderRadius: 3, overflow: 'hidden' }}>
                                <Table>
                                    <TableHead sx={{ bgcolor: '#f8fafc' }}>
                                        <TableRow>
                                            <TableCell><strong>Subject Details</strong></TableCell>
                                            <TableCell align="center"><strong>Internal (30)</strong></TableCell>
                                            <TableCell align="center"><strong>External (70)</strong></TableCell>
                                            <TableCell align="center"><strong>Total (100)</strong></TableCell>
                                            <TableCell align="center"><strong>Result</strong></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subjects.map((sub) => {
                                            const iMark = internalData ? parseInt(internalData[`subject_${sub.slot_number}`]) : 0;
                                            const eMark = externalData ? parseInt(externalData[`subject_${sub.slot_number}`]) : 0;
                                            const total = iMark + eMark;

                                            let grade = 'E';
                                            if (eMark >= 86) grade = 'A';
                                            else if (eMark >= 71) grade = 'B';
                                            else if (eMark >= 61) grade = 'B2';
                                            else if (eMark >= 46) grade = 'C';
                                            else if (eMark >= 33) grade = 'D';

                                            return (
                                                <TableRow key={sub.id} hover>
                                                    <TableCell sx={{ fontWeight: 500 }}>{sub.subject_name}</TableCell>
                                                    <TableCell align="center">{iMark}</TableCell>
                                                    <TableCell align="center">{eMark}</TableCell>
                                                    <TableCell align="center">
                                                        <Typography variant="body1" fontWeight="bold">
                                                            {total}
                                                        </Typography>
                                                    </TableCell>
                                                    <TableCell align="center">
                                                        <Chip
                                                            label={grade !== 'E' ? "PASS" : "FAIL"}
                                                            color={grade !== 'E' ? "success" : "error"}
                                                            variant="contained" size="small"
                                                            sx={{ fontWeight: 'bold', minWidth: 70 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                        {internalData && (
                                            <TableRow sx={{ bgcolor: '#fff9f0' }}>
                                                <TableCell><strong>Extra Curricular Activities</strong></TableCell>
                                                <TableCell align="center">{internalData.extra_curricular}</TableCell>
                                                <TableCell align="center">-</TableCell>
                                                <TableCell align="center">{internalData.extra_curricular}</TableCell>
                                                <TableCell align="center"><Chip label="COMPLETED" size="small" sx={{ fontWeight: 'bold' }} /></TableCell>
                                            </TableRow>
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            <Box sx={{ mt: 5, display: 'flex', justifyContent: 'flex-end', gap: 3 }}>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Percentage</Typography>
                                    <Paper variant="outlined" sx={{ p: 1.5, px: 3, bgcolor: hasFailed ? '#fff1f0' : '#f0fdf4', border: 'none', borderRadius: 2 }}>
                                        <Typography variant="h5" fontWeight="bold" color={hasFailed ? 'error.main' : 'success.main'}>
                                            {hasFailed ? "FAIL" : `${percentage.toFixed(2)}%`}
                                        </Typography>
                                    </Paper>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>Grade Point</Typography>
                                    <Paper variant="outlined" sx={{ p: 1.5, px: 3, bgcolor: '#f0f9ff', border: 'none', borderRadius: 2 }}>
                                        <Typography variant="h5" fontWeight="bold" color="#0369a1">
                                            {hasFailed ? "FAIL" : overallGrade}
                                        </Typography>
                                    </Paper>
                                </Box>
                                <Box sx={{ textAlign: 'center' }}>
                                    <Typography variant="caption" color="textSecondary" sx={{ fontWeight: 'bold', textTransform: 'uppercase' }}>External Total</Typography>
                                    <Paper variant="outlined" sx={{ p: 1.5, px: 3, bgcolor: '#f8fafc', border: 'none', borderRadius: 2 }}>
                                        <Typography variant="h5" fontWeight="bold">
                                            {externalTotal} / {maxMarks}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Box>
                        </Paper>
                    </Container>
                </Box>
                <FooterBlack />
            </Box>
            <CustomModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                severity="warning"
                message={modalMessage}
            />
        </Box>
    );
};

export default ParentFullMarksheet;
