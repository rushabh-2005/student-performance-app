import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getSubjectsBySem, getStudentMonitoring, deleteStudyLog, updateStudyLog, addStudyLog } from '../../../services/api';

import {
    Container, Paper, Typography, Box, TextField, Button, MenuItem, Grid, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow
} from '@mui/material';

import UserNav from '../../../components/UserNav';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';

const StudyLog = () => {
    const [subjects, setSubjects] = useState([]);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null });
    const [logs, setLogs] = useState([]);
    const [formData, setFormData] = useState({ subject_id: '', hours: '', tutoring: '' });
    const [editingLogId, setEditingLogId] = useState(null);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [msg, setMsg] = useState({ type: '', text: '' });

    const fetchLogs = async () => {
        if (!user) return;
        try {
            const res = await getStudentMonitoring(user.id);
            setLogs(res.data);
        } catch (error) {
            console.error('Error fetching logs', error);
        }
    };

    useEffect(() => {
        if (user) {
            getSubjectsBySem(user.current_sem).then(res => setSubjects(res.data));
            fetchLogs();
        }
    }, [user]);

    const handleKeyDown = (e) => {
        if (
            ['Backspace', 'Delete', 'Tab', 'Escape', 'Enter', 'ArrowLeft', 'ArrowRight', 'Home', 'End', '.'].includes(e.key) ||
            (e.ctrlKey || e.metaKey)
        ) {
            return;
        }
        if (!/^[0-9]$/.test(e.key)) {
            e.preventDefault();
        }
    };

    const handleHoursChange = (e) => {
        const val = e.target.value;
        if (val === '' || (Number(val) >= 0 && Number(val) <= 100)) {
            setFormData({ ...formData, hours: val });
        }
    };

    const handleTutoringChange = (e) => {
        const val = e.target.value;
        if (val === '' || (Number(val) >= 0 && Number(val) <= 60)) {
            setFormData({ ...formData, tutoring: val });
        }
    };

    const handleEdit = (log) => {
        setEditingLogId(log.id);
        setFormData({
            subject_id: log.subject_id,
            hours: log.study_hours,
            tutoring: log.extra_tutoring || ''
        });
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this log?")) return;
        try {
            await deleteStudyLog(id);
            setModalProps({ open: true, severity: 'success', message: 'Log deleted successfully!' , isConfirm: false });
            fetchLogs();
            if (editingLogId === id) {
                setEditingLogId(null);
                setFormData({ subject_id: '', hours: '', tutoring: '' });
            }
        } catch (error) {
            setModalProps({ open: true, severity: 'error', message: 'Failed to delete log.' , isConfirm: false });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const payload = { ...formData, user_id: user.id, semester: user.current_sem };
            if (editingLogId) {
                await updateStudyLog(editingLogId, payload);
                setModalProps({ open: true, severity: 'success', message: 'Study log updated successfully!' , isConfirm: false });
                setEditingLogId(null);
            } else {
                await addStudyLog(payload);
                setModalProps({ open: true, severity: 'success', message: 'Daily study log saved!' , isConfirm: false });
            }
            setFormData({ subject_id: '', hours: '', tutoring: '' });
            fetchLogs(); // refresh local list
        } catch (err) {
            const errorMsg = err.response?.data?.messages?.error || err.response?.data?.message || 'Failed to save log.';
            setModalProps({ open: true, severity: 'error', message: errorMsg , isConfirm: false });
        }
    };

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>
            <UserNav />
            <Container maxWidth="sm" sx={{ mt: 8, mb: 8, position: 'relative', zIndex: 10, flexGrow: 1 }}>
                <Paper sx={{ p: 4, borderRadius: 3 }}>
                    <Typography variant="h5" fontWeight="bold" gutterBottom>Overall study tracker..</Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ mb: 3 }}>
                        Log your hours to help the AI analyze your preparation level.
                    </Typography>

                    

                    <form onSubmit={handleSubmit}>
                        <TextField select fullWidth label="Select Subject" value={formData.subject_id} sx={{ mb: 2 }}
                            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })} required>
                            {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.subject_name}</MenuItem>)}
                        </TextField>

                        <TextField fullWidth type="number" label="Hours Studied" value={formData.hours} sx={{ mb: 2 }}
                            onChange={handleHoursChange} onKeyDown={handleKeyDown} required inputProps={{ step: 0.5, min: 0, max: 100 }} />



                        <TextField fullWidth type="number" label="Extra Tutoring Hours" value={formData.tutoring} sx={{ mb: 3 }}
                            onChange={handleTutoringChange} onKeyDown={handleKeyDown} inputProps={{ step: 0.5, min: 0, max: 60 }} />

                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5 }}>
                            {editingLogId ? 'Update Effort Log' : 'Save Effort Log'}
                        </Button>
                    </form>

                    {logs.length > 0 && (
                        <Box sx={{ mt: 5 }}>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Your Recent Logs
                            </Typography>
                            <TableContainer component={Paper} elevation={1} sx={{ borderRadius: 2 }}>
                                <Table size="small">
                                    <TableHead sx={{ backgroundColor: '#f5f5f5' }}>
                                        <TableRow>
                                            <TableCell><b>Date</b></TableCell>
                                            <TableCell><b>Subject</b></TableCell>
                                            <TableCell align="center"><b>Study Hours</b></TableCell>
                                            <TableCell align="center"><b>Extra Tutoring Hours</b></TableCell>
                                            <TableCell align="right"><b>Actions</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {logs.map((row) => (
                                            <TableRow key={row.id}>
                                                <TableCell>{new Date(row.created_at).toLocaleDateString()}</TableCell>
                                                <TableCell>{row.subject_name}</TableCell>
                                                <TableCell align="center">{row.study_hours}</TableCell>
                                                <TableCell align="center">{row.extra_tutoring || 0}</TableCell>
                                                <TableCell align="right" sx={{ whiteSpace: 'nowrap' }}>
                                                    <Button size="small" variant="outlined" sx={{ mr: 1 }} onClick={() => handleEdit(row)}>Edit</Button>
                                                    <Button size="small" variant="outlined" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </Box>
                    )}
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

export default StudyLog;