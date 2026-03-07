import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getAllStudents, getSubjectsBySem, getAllResults, uploadResults, deleteResult } from '../../../services/api';

import {
    Container, Typography, Paper, Box, Button, TextField, MenuItem,
    Select, FormControl, Table, TableBody, TableCell,
    TableContainer, TableHead, TableRow, Alert, Grid, AppBar, Toolbar
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

import FooterBlack from '../../../components/FooterBlack';
import AdminNav from '../../../components/AdminNav';
import '../../../Css_Files/HomeCss.css';

// Helper for input labels - simplified for this new layout
const InputWrapper = ({ children }) => (
    <Box sx={{ mb: 2 }}>
        {children}
    </Box>
);

const UploadResult = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [results, setResults] = useState([]);
    const [subjects, setSubjects] = useState([]);
    const [message, setMessage] = useState(null);

    // Form State
    const [formData, setFormData] = useState({
        user_id: '', semester: '',
        subject_1: '', subject_2: '', subject_3: '', subject_4: '', subject_5: '', extra_curricular: ''
    });

    // Check auth
    useEffect(() => {
        const admin = localStorage.getItem('admin');
        if (!admin) navigate('/login/admin');
    }, [navigate]);

    // Fetch data on page load
    useEffect(() => {
        fetchStudents();
        fetchResults();
    }, []);

    const fetchStudents = async () => {
        try {
            const res = await getAllStudents();
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    const fetchResults = async () => {
        try {
            const res = await getAllResults();
            setResults(res.data);
        } catch (err) { console.error(err); }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        
        if (name === 'semester') {
            // Also reset student when semester changes
            setFormData(prev => ({ ...prev, semester: value, user_id: '' }));
            fetchSubjects(value);
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
    };

    const handleMarksChange = (e) => {
        const { name, value } = e.target;
        let val = parseInt(value, 10);
        if (isNaN(val)) val = '';
        else if (val > 100) val = 100;
        setFormData(prev => ({ ...prev, [name]: val === '' ? '' : Math.max(0, val) }));
    };

    const handleKeyDown = (e) => {
        if (['-', 'e', 'E', '+', '.'].includes(e.key)) e.preventDefault();
    };

    const fetchSubjects = async (sem) => {
        try {
            const res = await getSubjectsBySem(sem);
            setSubjects(res.data);
        } catch (err) {
            console.error(err);
        }
    };

    const getSubjectLabel = (index) => {
        // Try matching by slot_number first; if not found, just try index matching if slot isn't set
        const subject = subjects.find(s => String(s.slot_number) === String(index)) || subjects[index - 1];
        if (subject && subject.subject_name) {
            return `${subject.subject_name} Marks *`;
        }
        return `Subject ${index} Marks *`;
    };

    // Upload New Result
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await uploadResults(formData);
            setModalProps({ open: true, severity: 'success', message: 'Result uploaded successfully!' , isConfirm: false });
            fetchResults(); // Refresh table
            setFormData({ // Clear form
                user_id: '', semester: '', subject_1: '', subject_2: '', subject_3: '', subject_4: '', subject_5: '', extra_curricular: ''
            });
        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: 'Failed to upload result.' , isConfirm: false });
        }
    };

    // Delete Result
    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this result?")) {
            try {
                await deleteResult(id);
                setModalProps({ open: true, severity: 'success', message: 'Result deleted!' , isConfirm: false });
                fetchResults(); // Refresh table
            } catch (err) {
                setModalProps({ open: true, severity: 'error', message: 'Failed to delete.' , isConfirm: false });
            }
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
                                    Upload Result
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handleSubmit}>

                                <InputWrapper>
                                    <FormControl fullWidth size="medium">
                                        <Select
                                            name="semester"
                                            value={formData.semester}
                                            onChange={handleChange}
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
                                    <FormControl fullWidth size="medium" disabled={!formData.semester}>
                                        <Select
                                            name="user_id"
                                            value={formData.user_id}
                                            onChange={handleChange}
                                            displayEmpty
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value="" disabled>
                                                <span style={{ color: '#999' }}>Student Name *</span>
                                            </MenuItem>
                                            {students.filter(s => s.current_sem === formData.semester || !s.current_sem).map(student => (
                                                <MenuItem key={student.id} value={student.id}>
                                                    {student.name} ({student.email})
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label={getSubjectLabel(1)}
                                        name="subject_1"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.subject_1}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label={getSubjectLabel(2)}
                                        name="subject_2"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.subject_2}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label={getSubjectLabel(3)}
                                        name="subject_3"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.subject_3}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label={getSubjectLabel(4)}
                                        name="subject_4"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.subject_4}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label={getSubjectLabel(5)}
                                        name="subject_5"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.subject_5}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
                                    />
                                </InputWrapper>

                                <InputWrapper>
                                    <TextField
                                        label="Extra Curricular Marks *"
                                        name="extra_curricular"
                                        type="number"
                                        required
                                        fullWidth
                                        size="medium"
                                        value={formData.extra_curricular}
                                        onChange={handleMarksChange}
                                        onKeyDown={handleKeyDown}
                                        InputProps={{ inputProps: { min: 0, max: 100 } }}
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
                                        Upload Result
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
                                    Uploaded Results
                                </Typography>
                                <Button size="small" onClick={fetchResults} sx={{ textTransform: 'none' }}>Refresh List</Button>
                            </Box>

                            <TableContainer sx={{ maxHeight: 'calc(100vh - 400px)' }}>
                                <Table stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Student Name</TableCell>
                                            <TableCell sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Semester</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Total Marks</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Extra Curricular</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 600, bgcolor: '#f9fafb' }}>Actions</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {results.length === 0 ? (
                                            <TableRow>
                                                <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                                                    <Typography color="textSecondary" variant="subtitle1">
                                                        No results found.
                                                    </Typography>
                                                    <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
                                                        Use the form to upload student results.
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ) : (
                                            results.map((row) => (
                                                <TableRow key={row.id} hover>
                                                    <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                                                    <TableCell>{row.semester}</TableCell>
                                                    <TableCell align="center">
                                                        <Box sx={{
                                                            display: 'inline-block',
                                                            px: 1.5,
                                                            py: 0.5,
                                                            bgcolor: '#e3f2fd',
                                                            color: '#1565c0',
                                                            borderRadius: 1,
                                                            fontSize: '0.85rem',
                                                            fontWeight: 600
                                                        }}>
                                                            {row.total_marks} / 500
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell align="center">{row.extra_curricular}</TableCell>
                                                    <TableCell align="center">
                                                        <Button
                                                            variant="outlined"
                                                            color="error"
                                                            size="small"
                                                            onClick={() => handleDelete(row.id)}
                                                            sx={{ borderRadius: 1.5, textTransform: 'none', minWidth: '80px' }}
                                                        >
                                                            Delete
                                                        </Button>
                                                    </TableCell>
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
        </div>
    );

};

export default UploadResult;
