import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getSubjectsBySem, addSubject } from '../../../services/api';

import {
    Container, Typography, Paper, Box, Button, TextField, MenuItem,
    Select, FormControl, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Alert, Grid, AppBar, Toolbar, IconButton
} from '@mui/material';

import { useNavigate } from 'react-router-dom';

import FooterBlack from '../../../components/FooterBlack';
import AdminNav from '../../../components/AdminNav';
import '../../../Css_Files/HomeCss.css';

// Helper for input labels
const InputWrapper = ({ children }) => (
    <Box sx={{ mb: 2 }}>
        {children}
    </Box>
);

const ManageSubjects = () => {
    const navigate = useNavigate();
    const [semester, setSemester] = useState('');
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [subjectName, setSubjectName] = useState('');
    const [subjectCode, setSubjectCode] = useState('');
    const [subjectsList, setSubjectsList] = useState([]);
    const [message, setMessage] = useState({ type: '', text: '' });

    // Check auth
    useEffect(() => {
        const admin = localStorage.getItem('admin');
        if (!admin) navigate('/login/admin');
        else fetchSubjects('Sem 1'); // Fetch default on load
    }, [navigate]);


    // Fetch subjects whenever the semester dropdown changes in the form
    const fetchSubjects = async (selectedSem) => {
        if (!selectedSem) return;
        try {
            const response = await getSubjectsBySem(selectedSem);
            setSubjectsList(response.data);
        } catch (err) {
            console.error("Fetch Error:", err);
        }
    };

    useEffect(() => {
        if (semester) {
            fetchSubjects(semester);
        }
    }, [semester]);

    const handleAddSubject = async (e) => {
        e.preventDefault();

        if (subjectsList.length >= 5) {
            setModalProps({ open: true, severity: 'error', message: 'A semester can only have exactly 5 subjects ...', isConfirm: false });
            return;
        }
        if (!subjectName || !semester) {
            setModalProps({ open: true, severity: 'error', message: 'Please fill all required fields.', isConfirm: false });
            return;
        }

        const formData = new FormData();
        formData.append('semester', semester);
        formData.append('subject_name', subjectName);
        formData.append('subject_code', subjectCode);

        const nextSlot = subjectsList.length + 1;
        formData.append('slot_number', nextSlot);

        try {
            await addSubject(formData);
            setModalProps({ open: true, severity: 'success', message: 'Subject Added!', isConfirm: false });
            setSubjectName('');
            setSubjectCode('');
            fetchSubjects(semester); // Refresh list
        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: 'Failed to add subject.', isConfirm: false });
        }
    };



    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>

            <AdminNav />

            {/* ================= MAIN CONTENT ================= */}
            <Container maxWidth="lg" sx={{ mt: 5, mb: 10, flexGrow: 1, position: 'relative', zIndex: 10 }}>

                <Grid container spacing={4} direction="column" alignItems="center">
                    {/* ================= FORM SECTION (Top - Centered Single Col) ================= */}
                    <Grid item xs={12} sx={{ width: '100%', maxWidth: '500px !important' }}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 4,
                                borderRadius: 1,
                                bgcolor: '#ffffff',
                                borderTop: '5px solid #d32f2f', // Red Top Border
                            }}
                        >
                            <Box sx={{ mb: 4, textAlign: 'center' }}>
                                <Typography variant="h5" sx={{ fontWeight: 500, color: '#d32f2f' }}>
                                    Add Subject
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleAddSubject}>

                                <InputWrapper>
                                    <FormControl fullWidth size="medium">
                                        <Select
                                            name="semester"
                                            value={semester}
                                            onChange={(e) => setSemester(e.target.value)}
                                            displayEmpty
                                        >
                                            <MenuItem value="" disabled>
                                                <span style={{ color: '#999' }}>Semester *</span>
                                            </MenuItem>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
                                                <MenuItem key={num} value={`Sem ${num}`}>
                                                    Semester {num}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label="Subject Name *"
                                        name="subject_name"
                                        type="text"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={subjectName}
                                        onChange={(e) => setSubjectName(e.target.value)}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label="Subject Code (Optional)"
                                        name="subject_code"
                                        type="text"
                                        fullWidth
                                        size="medium"
                                        value={subjectCode}
                                        onChange={(e) => setSubjectCode(e.target.value)}
                                    />
                                </InputWrapper>

                                <Box sx={{ mt: 3 }}>
                                    <Button
                                        type="submit"
                                        variant="contained"
                                        size="large"
                                        fullWidth
                                        sx={{
                                            py: 1.5,
                                            borderRadius: 1,
                                            textTransform: "uppercase",
                                            fontWeight: 600,
                                            bgcolor: '#d32f2f', // Red Button
                                            boxShadow: 'none',
                                            '&:hover': { bgcolor: '#c62828', boxShadow: 'none' }
                                        }}
                                    >
                                        Add Subject
                                    </Button>
                                </Box>

                            </Box>
                        </Paper>
                    </Grid>

                    {/* ================= TABLE SECTION (Bottom - Full Width) ================= */}
                    <Grid item xs={12} sx={{ width: '100%' }}>
                        <Paper
                            elevation={0}
                            sx={{
                                borderRadius: 2,
                                overflow: 'hidden',
                                display: 'flex',
                                flexDirection: 'column',
                                border: '1px solid #e0e0e0',
                                minHeight: '400px'
                            }}
                        >
                            <Box sx={{
                                p: 2,
                                px: 3,
                                bgcolor: '#fff',
                                borderBottom: 1,
                                borderColor: 'divider',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center'
                            }}>
                                <Typography variant="h6" sx={{ fontWeight: 600, color: '#333' }}>
                                    Subjects List {semester ? `for ${semester}` : ''}
                                </Typography>
                                <Button size="small" onClick={() => fetchSubjects(semester || 'Sem 1')} sx={{ textTransform: 'none' }}>Refresh List</Button>
                            </Box>

                            <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Subject Code</TableCell>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Subject Name</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {subjectsList.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={2} align="center" sx={{ py: 8 }}>
                                                    <Typography color="textSecondary" variant="subtitle1">
                                                        No subjects found.
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        {semester ? 'Use the form to add new subjects.' : 'Select a semester to view subjects.'}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            subjectsList.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell sx={{ fontWeight: 500 }}>{row.subject_code || 'N/A'}</TableCell>
                                                    <TableCell>{row.subject_name}</TableCell>
                                                </TableRow>
                                            ))
                                        )}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Paper>
                    </Grid>
                </Grid>
            </Container>
            <FooterBlack />
            <CustomModal
                open={modalProps.open}
                handleClose={() => setModalProps({ ...modalProps, open: false })}
                severity={modalProps.severity}
                message={modalProps.message}
                isConfirm={modalProps.isConfirm}
                onConfirm={modalProps.onConfirm}
            />
        </div >
    );
};

export default ManageSubjects;