import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getAllStudents, getSubjectsBySem, publishInternals } from '../../../services/api';

import {
    Container, Paper, Typography, Box, TextField, Button,
    MenuItem, Grid, Alert, AppBar, Toolbar, FormControl, Select
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

const PublishResults = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [selectedStudent, setSelectedStudent] = useState('');
    const [semester, setSemester] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [marks, setMarks] = useState({ s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, extra: 0 });
    const [status, setStatus] = useState({ type: '', msg: '' });

    // Check auth
    useEffect(() => {
        const admin = localStorage.getItem('admin');
        if (!admin) navigate('/login/admin');
    }, [navigate]);

    // Fetch all students for the dropdown
    useEffect(() => {
        getAllStudents().then(res => setStudents(res.data)).catch(err => console.error(err));
    }, []);

    // Fetch subjects whenever semester changes
    useEffect(() => {
        if (semester) {
            getSubjectsBySem(semester).then(res => {
                setSubjects(res.data);
            }).catch(err => console.error(err));
        }
    }, [semester]);

    const handlePublish = async (e) => {
        e.preventDefault();
        const total = Object.values(marks).reduce((a, b) => parseInt(a || 0) + parseInt(b || 0), 0) - parseInt(marks.extra || 0); // extra shouldn't usually be part of actual sum, but if you want it added to total you can modify this
        const finalTotal = total + parseInt(marks.extra || 0);

        const payload = {
            user_id: selectedStudent,
            semester: semester,
            subject_1: marks.s1,
            subject_2: marks.s2,
            subject_3: marks.s3,
            subject_4: marks.s4,
            subject_5: marks.s5,
            extra_curricular: marks.extra,
            total_internal: finalTotal
        };

        try {
            await publishInternals(payload);
            setModalProps({ open: true, severity: 'success', message: 'Internal marks published successfully!', isConfirm: false });

            // clear form
            setSelectedStudent('');
            setSemester('');
            setSubjects([]);
            setMarks({ s1: 0, s2: 0, s3: 0, s4: 0, s5: 0, extra: 0 });


        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: 'Failed to publish results.', isConfirm: false });
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
                    <Grid item xs={12} sx={{ width: '100%', maxWidth: '600px !important' }}>
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
                                    Publish Internal Marks
                                </Typography>
                            </Box>

                            <Box component="form" onSubmit={handlePublish}>
                                <InputWrapper>
                                    <FormControl fullWidth size="medium">
                                        <Select
                                            value={semester}
                                            onChange={(e) => {
                                                setSemester(e.target.value);
                                                setSelectedStudent('');
                                            }}
                                            displayEmpty
                                            required
                                        >
                                            <MenuItem value="" disabled>
                                                <span style={{ color: '#999' }}>Select Semester *</span>
                                            </MenuItem>
                                            {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                                <MenuItem key={n} value={`Sem ${n}`}>Semester {n}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </InputWrapper>

                                <InputWrapper>
                                    <FormControl fullWidth size="medium" disabled={!semester}>
                                        <Select
                                            value={selectedStudent}
                                            onChange={(e) => setSelectedStudent(e.target.value)}
                                            displayEmpty
                                            required
                                        >
                                            <MenuItem value="" disabled>
                                                <span style={{ color: '#999' }}>Select Student *</span>
                                            </MenuItem>
                                            {students.filter(s => s.current_sem === semester || !s.current_sem).map(s => (
                                                <MenuItem key={s.id} value={s.id}>{s.name} ({s.email})</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </InputWrapper>

                                {subjects.length > 0 && (
                                    <Box sx={{ mt: 4, p: 2, border: '1px solid #eee', borderRadius: 2 }}>
                                        <Typography variant="h6" sx={{ mb: 3, color: '#333' }}>Enter Subject Marks</Typography>

                                        {subjects.map((sub, index) => (
                                            <InputWrapper key={sub.id}>
                                                <TextField
                                                    fullWidth
                                                    label={`${sub.subject_name} Marks *`}
                                                    type="number"
                                                    size="medium"
                                                    value={marks[`s${index + 1}`] === 0 ? '' : marks[`s${index + 1}`]}
                                                    onKeyDown={(e) => {
                                                        if (['-', 'e', 'E', '+', '.'].includes(e.key)) e.preventDefault();
                                                    }}
                                                    onChange={(e) => {
                                                        let val = parseInt(e.target.value, 10);
                                                        if (isNaN(val)) val = '';
                                                        else if (val > 100) val = 100;
                                                        setMarks({ ...marks, [`s${index + 1}`]: Math.max(0, val) });
                                                    }}
                                                    required
                                                />
                                            </InputWrapper>
                                        ))}

                                        <InputWrapper>
                                            <TextField
                                                fullWidth
                                                label="Extra Curricular Marks"
                                                type="number"
                                                size="medium"
                                                value={marks.extra === 0 ? '' : marks.extra}
                                                onKeyDown={(e) => {
                                                    if (['-', 'e', 'E', '+', '.'].includes(e.key)) e.preventDefault();
                                                }}
                                                onChange={(e) => {
                                                    let val = parseInt(e.target.value, 10);
                                                    if (isNaN(val)) val = '';
                                                    else if (val > 100) val = 100;
                                                    setMarks({ ...marks, extra: Math.max(0, val) });
                                                }}
                                            />
                                        </InputWrapper>

                                        <Box sx={{ mt: 4 }}>
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
                                                Publish to Dashboard
                                            </Button>
                                        </Box>
                                    </Box>
                                )}
                            </Box>
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

export default PublishResults;