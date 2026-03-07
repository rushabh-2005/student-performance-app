import React, { useState, useEffect, useRef } from 'react';
import { getSubjectsBySem, getStudentResults, getStudentInternals } from '../../../services/api';

import {
    Container, Paper, Typography, Box, Table, TableBody,
    TableCell, TableContainer, TableHead, TableRow, Divider, CircularProgress, Chip, Button
} from '@mui/material';

import UserNav from '../../../components/UserNav';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import DownloadIcon from '@mui/icons-material/Download';
import CustomModal from '../../../components/CustomModal';

const FullMarksheet = () => {
    const [loading, setLoading] = useState(true);
    const [subjects, setSubjects] = useState([]);
    const [internalData, setInternalData] = useState(null);
    const [externalData, setExternalData] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [modalOpen, setModalOpen] = useState(false);
    const [modalMessage, setModalMessage] = useState('');
    const marksheetRef = useRef(null);

    useEffect(() => {
        if (user) fetchAllMarks();
    }, [user]);

    const fetchAllMarks = async () => {
        try {
            // 1. Fetch Subject Names
            const subRes = await getSubjectsBySem(user.current_sem);
            setSubjects(subRes.data);

            // 2. Fetch Internal Marks
            const intRes = await getStudentInternals(user.id);
            const currentInt = intRes.data.find(r => r.semester === user.current_sem);
            setInternalData(currentInt);

            // 3. Fetch External (Final) Marks
            const extRes = await getStudentResults(user.id);
            const currentExt = extRes.data.find(r => r.semester === user.current_sem);
            setExternalData(currentExt);

            if (!currentInt || !currentExt) {
                let msg = "";
                if (!currentInt && !currentExt) {
                    msg = "Your internal and external marks for this semester have not been published yet.";
                } else if (!currentInt) {
                    msg = "Your internal marks for this semester have not been published yet.";
                } else {
                    msg = "Your external marks for this semester have not been published yet.";
                }
                setModalMessage(msg);
                setModalOpen(true);
            }

        } catch (err) {
            console.error("Error loading marksheet data");
        } finally {
            setLoading(false);
        }
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
            pdf.save(`${user?.name}_Marksheet.pdf`);
        } catch (error) {
            console.error('Failed to download PDF:', error);
        }
    };

    if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', mt: 10 }}><CircularProgress /></Box>;

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
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <UserNav />
            <Container maxWidth="lg" sx={{ mt: 5, mb: 10, position: 'relative', zIndex: 10, flexGrow: 1 }}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                    <Button
                        variant="contained"
                        color="primary"
                        startIcon={<DownloadIcon />}
                        onClick={handleDownload}
                        disabled={!internalData || !externalData}
                        sx={{
                            bgcolor: (!internalData || !externalData) ? '#ccc' : '#1a237e',
                            '&:hover': { bgcolor: (!internalData || !externalData) ? '#ccc' : '#0d1659' }
                        }}
                    >
                        Download PDF
                    </Button>
                </Box>
                <Paper ref={marksheetRef} elevation={4} sx={{ p: 5, borderRadius: 3, borderTop: '8px solid #1a237e' }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography variant="h4" fontWeight="bold">OFFICIAL MARKSHEET</Typography>
                        <Typography variant="h6" color="textSecondary">{user.current_sem} - Academic Session 2026</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 4, px: 2 }}>
                        <Typography><strong>Student:</strong> {user.name}</Typography>
                        <Typography><strong>ID:</strong> {user.id}</Typography>
                    </Box>

                    <TableContainer component={Paper} variant="outlined">
                        <Table>
                            <TableHead sx={{ bgcolor: '#eeeeee' }}>
                                <TableRow>
                                    <TableCell><strong>Subject Name</strong></TableCell>
                                    <TableCell align="center"><strong>Internal (30)</strong></TableCell>
                                    <TableCell align="center"><strong>External (70)</strong></TableCell>
                                    <TableCell align="center"><strong>Grade</strong></TableCell>
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
                                            <TableCell>{sub.subject_name}</TableCell>
                                            <TableCell align="center">{iMark}</TableCell>
                                            <TableCell align="center">{eMark}</TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body1" fontWeight="bold" color={grade !== 'E' ? "success.main" : "error.main"}>
                                                    {grade}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">
                                                <Chip
                                                    label={grade !== 'E' ? "PASS" : "FAIL"}
                                                    color={grade !== 'E' ? "success" : "error"}
                                                    variant="contained" size="small"
                                                />
                                            </TableCell>
                                        </TableRow>
                                    );
                                })}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Box sx={{ mt: 4, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
                        <Paper sx={{ p: 2, bgcolor: '#e3f2fd', minWidth: 120, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" fontWeight="bold">Percentage</Typography>
                            <Typography variant="h6" color={hasFailed ? 'error.main' : 'textPrimary'}>
                                {hasFailed ? "FAILED" : `${percentage.toFixed(2)}%`}
                            </Typography>
                        </Paper>
                        <Paper sx={{ p: 2, bgcolor: '#f1f8e9', minWidth: 120, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" fontWeight="bold">Overall Grade</Typography>
                            <Typography variant="h6" color={!hasFailed && overallGrade !== 'E' ? 'success.main' : 'error.main'}>
                                {hasFailed ? "FAILED" : overallGrade}
                            </Typography>
                        </Paper>
                        <Paper sx={{ p: 2, bgcolor: '#fff3e0', minWidth: 200, textAlign: 'center' }}>
                            <Typography variant="body2" color="textSecondary" fontWeight="bold">Grand Total</Typography>
                            <Typography variant="h6">{externalTotal} / {maxMarks}</Typography>
                        </Paper>
                    </Box>
                </Paper>
            </Container>
            <FooterBlack />
            <CustomModal
                open={modalOpen}
                handleClose={() => setModalOpen(false)}
                severity="warning"
                message={modalMessage}
            />
        </div>
    );
};

export default FullMarksheet;