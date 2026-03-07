import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getAllStudents, getSubjectsBySem, getStudentAttendance, updateAttendance } from '../../../services/api';

import { Container, Paper, Typography, Box, TextField, Button, Alert, FormControl, Select, MenuItem, AppBar, Toolbar, Chip } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import FooterBlack from '../../../components/FooterBlack';
import AdminNav from '../../../components/AdminNav';
import '../../../Css_Files/HomeCss.css';

const AttendanceMonitoring = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [selectedSemester, setSelectedSemester] = useState('');
    const [selectedStudentId, setSelectedStudentId] = useState('');
    const [selectedStudentSem, setSelectedStudentSem] = useState('');
    const [subjects, setSubjects] = useState([]);
    const [attendanceData, setAttendanceData] = useState({}); // { subject_id: {attended, total, isExisting} }

    // Admin Auth Check
    useEffect(() => {
        const admin = localStorage.getItem('admin');
        if (!admin) navigate('/login/admin');
        fetchStudents();
    }, [navigate]);

    const fetchStudents = async () => {
        try {
            const res = await getAllStudents();
            setStudents(res.data);
        } catch (err) { console.error(err); }
    };

    const handleSemesterChange = (e) => {
        const sem = e.target.value;
        setSelectedSemester(sem);
        setSelectedStudentId('');
        setSelectedStudentSem('');
        setSubjects([]);
        setAttendanceData({});
    };

    const handleStudentChange = async (e) => {
        const sid = e.target.value;
        setSelectedStudentId(sid);

        // Find student semester
        const student = students.find(s => s.id === sid);
        if (student) {
            setSelectedStudentSem(student.current_sem);
            fetchSubjectsAndAttendance(sid, student.current_sem);
        }
    };

    const fetchSubjectsAndAttendance = async (userId, sem) => {
        try {
            // 1. Get the subjects for the current semester
            const subRes = await getSubjectsBySem(sem);
            setSubjects(subRes.data);

            // 2. Get existing attendance logs if any
            const attRes = await getStudentAttendance(userId);
            // Transform array to object for easy lookup
            const logs = {};
            attRes.data.forEach(log => {
                logs[log.subject_id] = {
                    attended: log.attended_lectures,
                    total: 100,
                    isExisting: true // Mark as immutable
                };
            });
            setAttendanceData(logs);
        } catch (err) { console.error("Error loading data"); }
    };

    const handleAttendanceChange = (subId, field, value) => {
        // Prevent change if record already exists (immutable)
        if (attendanceData[subId]?.isExisting) return;

        let numericValue = value.replace(/[^0-9]/g, '');
        let intVal = numericValue === '' ? '' : parseInt(numericValue, 10);

        if (intVal !== '' && intVal > 100) {
            return;
        }

        setAttendanceData(prev => ({
            ...prev,
            [subId]: {
                ...prev[subId],
                [field]: intVal
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedStudentId) {
            setModalProps({ open: true, severity: 'error', message: 'Please select a student first.', isConfirm: false });
            return;
        }

        // Filter for subjects that don't have an existing record yet
        const missingSubjects = subjects.filter(sub => !attendanceData[sub.id]?.isExisting);

        if (missingSubjects.length === 0) {
            setModalProps({ open: true, severity: 'info', message: "All attendance for this student is already set.", isConfirm: false });
            return;
        }

        try {
            const promises = missingSubjects.map(sub => {
                const data = attendanceData[sub.id] || { attended: 0, total: 100 };
                return updateAttendance({
                    user_id: selectedStudentId,
                    subject_id: sub.id,
                    semester: selectedStudentSem,
                    attended_lectures: data.attended || 0,
                    total_lectures: 100
                });
            });

            await Promise.all(promises);
            setModalProps({ open: true, severity: 'success', message: "Attendance details saved successfully for new records!", isConfirm: false });

            // Re-fetch to update the UI with locked fields
            fetchSubjectsAndAttendance(selectedStudentId, selectedStudentSem);

        } catch (err) {
            setModalProps({ open: true, severity: 'error', message: "Update failed. Please check the server.", isConfirm: false });
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('admin');
        navigate('/');
    };

    const inputWrapperStyle = { mb: 3 };

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>

            <AdminNav />

            {/* ================= MAIN CONTENT ================= */}
            <Container maxWidth="sm" sx={{ mt: 5, mb: 10, flexGrow: 1, position: 'relative', zIndex: 10 }}>
                <Paper elevation={3} sx={{ p: 4, mb: 4, borderRadius: 1, bgcolor: '#ffffff', borderTop: '5px solid #d32f2f' }}>
                    <Typography variant="h4" gutterBottom align="center" color="error" sx={{ mb: 4 }}>
                        Attendance Portal
                    </Typography>

                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <Box sx={inputWrapperStyle}>
                            <FormControl fullWidth size="medium">
                                <Select
                                    value={selectedSemester}
                                    onChange={handleSemesterChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        <span style={{ color: '#999' }}>Select Semester *</span>
                                    </MenuItem>
                                    {[1, 2, 3, 4, 5, 6, 7, 8].map(n => (
                                        <MenuItem key={n} value={`Sem ${n}`}>Semester {n}</MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        <Box sx={inputWrapperStyle}>
                            <FormControl fullWidth size="medium" disabled={!selectedSemester}>
                                <Select
                                    value={selectedStudentId}
                                    onChange={handleStudentChange}
                                    displayEmpty
                                >
                                    <MenuItem value="" disabled>
                                        <span style={{ color: '#999' }}>Admin Select Student *</span>
                                    </MenuItem>
                                    {students.filter(s => s.current_sem === selectedSemester).map(student => (
                                        <MenuItem key={student.id} value={student.id}>
                                            {student.name} ({student.email})
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Box>

                        {selectedStudentId && subjects.length > 0 && (
                            <>
                                {subjects.map((sub) => {
                                    const stats = attendanceData[sub.id] || { attended: '', total: 100 };
                                    const isLocked = stats.isExisting;

                                    return (
                                        <Box key={sub.id} sx={{ mb: 4, p: 2, border: '1px solid #e0e0e0', borderRadius: 2, bgcolor: isLocked ? '#f9f9f9' : 'transparent' }}>
                                            <Typography variant="h6" sx={{ mb: 2, fontWeight: 500, color: isLocked ? '#888' : '#333', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                {sub.subject_name}
                                                {isLocked && <Chip label="Immutable" size="small" variant="outlined" sx={{ fontSize: '0.65rem', fontWeight: 'bold' }} />}
                                            </Typography>

                                            <Box sx={{ display: 'flex', gap: 2 }}>
                                                <TextField
                                                    label="Attended Lectures (Out of 100) *"
                                                    type="text"
                                                    fullWidth
                                                    value={stats.attended}
                                                    onChange={(e) => handleAttendanceChange(sub.id, 'attended', e.target.value)}
                                                    disabled={isLocked}
                                                    helperText={isLocked ? "System Lock: Attendance cannot be changed once set." : ""}
                                                    onKeyDown={(e) => {
                                                        if (['Backspace', 'Tab', 'ArrowLeft', 'ArrowRight', 'Delete'].includes(e.key)) return;
                                                        if (!/^[0-9]$/.test(e.key)) {
                                                            e.preventDefault();
                                                        }
                                                    }}
                                                />
                                                <TextField
                                                    label="Total Lectures *"
                                                    type="text"
                                                    fullWidth
                                                    value={100}
                                                    disabled
                                                />
                                            </Box>
                                        </Box>
                                    );
                                })}

                                {subjects.some(sub => !attendanceData[sub.id]?.isExisting) ? (
                                    <Button
                                        type="submit"
                                        fullWidth
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        sx={{ mt: 2, py: 1.5, fontWeight: 600, textTransform: 'uppercase' }}
                                    >
                                        SAVE ATTENDANCE
                                    </Button>
                                ) : (
                                    <Alert severity="info" sx={{ mt: 2 }}>All attendance records for this student have been finalized.</Alert>
                                )}
                            </>
                        )}
                    </Box>
                </Paper>
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

export default AttendanceMonitoring;