import React, { useState, useEffect } from 'react';
import CustomModal from '../../../components/CustomModal';

import { getSubjectsBySem, getStudentInternals, getStudentAttendance, getStudentMonitoring, getStudentResults, PredictionAPI } from '../../../services/api';

import {
    Container,
    TextField,
    Button,
    Typography,
    Paper,
    Box,
    MenuItem,
    Alert
} from '@mui/material';

import UserNav from '../../../components/UserNav';
import FooterBlack from '../../../components/FooterBlack';
import '../../../Css_Files/HomeCss.css';

const PredictScore = () => {
    const [user, setUser] = useState(null);
    const [modalProps, setModalProps] = useState({ open: false, severity: 'success', message: '', isConfirm: false, onConfirm: null, title: '' });
    const [subjects, setSubjects] = useState([]);

    // Data stores
    const [attendanceData, setAttendanceData] = useState([]);
    const [monitoringData, setMonitoringData] = useState([]);
    const [marksData, setMarksData] = useState(null);
    const [isPublished, setIsPublished] = useState(false);

    // Form states
    const [selectedSubject, setSelectedSubject] = useState('');
    const [formData, setFormData] = useState({
        internal_marks: 0,
        attendance_per: 0,
        study_hours: 0
    });

    const [loadingData, setLoadingData] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loggedInUser = JSON.parse(localStorage.getItem('user'));
        if (loggedInUser) {
            setUser(loggedInUser);
            fetchAllData(loggedInUser.id, loggedInUser.current_sem);
        }
    }, []);

    const fetchAllData = async (userId, semester) => {
        setLoadingData(true);
        try {
            // 1. Fetch subjects
            const subRes = await getSubjectsBySem(encodeURIComponent(semester));
            setSubjects(subRes.data);

            // 2. Fetch Attendance
            const attRes = await getStudentAttendance(userId);
            const currentAtt = attRes.data.filter(a => String(a.semester).trim().toLowerCase() === String(semester).trim().toLowerCase());
            // fallback if empty
            setAttendanceData(currentAtt.length > 0 ? currentAtt : attRes.data);

            // 3. Fetch Monitoring (Study Logs)
            const monRes = await getStudentMonitoring(userId);
            setMonitoringData(monRes.data);

            // 4. Fetch Internal Marks
            const resRes = await getStudentInternals(userId);
            const currentRes = resRes.data.reverse().find(r => r.semester === semester);
            setMarksData(currentRes || null);

            // 5. Check if External Results are already published
            const extRes = await getStudentResults(userId);
            const alreadyPublished = extRes.data.some(r => r.semester === semester);
            setIsPublished(alreadyPublished);

        } catch (err) {
            console.error("Error fetching data:", err);
            setModalProps({ open: true, severity: 'error', message: "Failed to fetch necessary data for prediction.", isConfirm: false });
        } finally {
            setLoadingData(false);
        }
    };

    const handleSubjectChange = (e) => {
        const subId = e.target.value;
        setSelectedSubject(subId);

        const subject = subjects.find(s => s.id === subId);
        if (!subject) return;

        // Auto-fetch internal marks
        let internal = 0;
        if (marksData && marksData[`subject_${subject.slot_number}`]) {
            internal = parseFloat(marksData[`subject_${subject.slot_number}`]);
        }

        // Auto-fetch attendance
        let attendancePer = 0;
        const attRecord = attendanceData.find(a => String(a.subject_id) === String(subId));
        if (attRecord && parseInt(attRecord.total_lectures) > 0) {
            attendancePer = (parseInt(attRecord.attended_lectures) / parseInt(attRecord.total_lectures)) * 100;
        }

        // Auto-fetch study hours (Summing up for the selected subject)
        let totalStudyHours = 0;
        const subLogs = monitoringData.filter(m => String(m.subject_id) === String(subId));
        subLogs.forEach(log => {
            totalStudyHours += parseFloat(log.study_hours || 0);
            totalStudyHours += parseFloat(log.extra_tutoring || 0);
        });

        setFormData({
            internal_marks: parseFloat(internal.toFixed(2)),
            attendance_per: parseFloat(attendancePer.toFixed(2)),
            study_hours: parseFloat(totalStudyHours.toFixed(2))
        });

        if (totalStudyHours === 0) {
            setModalProps({
                open: true,
                severity: 'warning',
                message: "at least study first",
                isConfirm: false,
                title: 'Insufficient Progress'
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoadingData(true);

        if (!selectedSubject) {
            setLoadingData(false);
            setModalProps({ open: true, severity: 'error', message: "Please select a subject first.", isConfirm: false });
            return;
        }

        // Logic to check if admin published internal marks OR user published study logs
        const subLogs = monitoringData.filter(m => String(m.subject_id) === String(selectedSubject));
        const userPublished = subLogs.length > 0;

        // Admin publishes all internal marks for a semester at once.
        // If marksData (the row for current semester) is missing, it's not published.
        const adminPublished = !!marksData;

        if (!adminPublished && !userPublished) {
            setLoadingData(false);
            setModalProps({
                open: true,
                severity: 'info',
                message: "No prediction",
                isConfirm: false
            });
            return;
        }

        try {
            // Predict using the Python AI Engine
            const response = await PredictionAPI.post('/predict', formData);

            if (response.data) {
                const { predicted_score, grade, category, advice } = response.data;
                const alertMessage = `🎯 PREDICTION RESULTS 🎯\n\n` +
                    `Score: ${predicted_score} / 100\n` +
                    `Grade: ${grade} (${category})\n\n` +
                    `💡 Advice: ${advice}`;

                // Show in alert box as requested
                setModalProps({ open: true, severity: 'success', message: alertMessage, isConfirm: false });
            }
        } catch (err) {
            console.error("Prediction Error:", err);
            setModalProps({ open: true, severity: 'error', message: "Prediction failed. Make sure the AI Engine (app.py) is running.", isConfirm: false });
        } finally {
            setLoadingData(false);
        }
    };

    return (
        <div className="home-container" style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <div className="home-bg-gradient"></div>
            <div className="moving-blob blob-1"></div>
            <div className="moving-blob blob-2"></div>
            <div className="moving-blob blob-3"></div>

            <UserNav />

            <Container maxWidth="xs" sx={{ mt: 10, mb: 10, position: 'relative', zIndex: 10, flexGrow: 1 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Typography variant="h4" gutterBottom align="center" color="primary" sx={{ fontWeight: 'bold' }}>
                        Predict Score
                    </Typography>

                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Select a subject to automatically fetch your performance metrics and predict your final score.
                    </Typography>

                    {isPublished && (
                        <Alert severity="warning" sx={{ mb: 3, borderRadius: 2 }}>
                            <strong>Results Published!</strong> External marks for {user?.current_sem} are already out. Prediction is disabled.
                        </Alert>
                    )}



                    <Box component="form" onSubmit={handleSubmit} noValidate>
                        <TextField
                            select
                            fullWidth
                            label="Subject Name *"
                            value={selectedSubject}
                            onChange={handleSubjectChange}
                            margin="normal"
                            disabled={loadingData || isPublished}
                        >
                            {subjects.map((sub) => (
                                <MenuItem key={sub.id} value={sub.id}>
                                    {sub.subject_name}
                                </MenuItem>
                            ))}
                        </TextField>

                        <TextField
                            fullWidth
                            label="Internal Marks"
                            name="internal_marks"
                            type="number"
                            margin="normal"
                            value={formData.internal_marks}
                            InputProps={{ readOnly: true }}
                            helperText="Auto-fetched institutional assessment"
                        />

                        <TextField
                            fullWidth
                            label="Attendance (%)"
                            name="attendance_per"
                            type="number"
                            margin="normal"
                            value={formData.attendance_per}
                            InputProps={{ readOnly: true }}
                            helperText="Auto-fetched attendance representation"
                        />

                        <TextField
                            fullWidth
                            label="Total Study & Tutoring (Hours)"
                            name="study_hours"
                            type="number"
                            margin="normal"
                            value={formData.study_hours}
                            InputProps={{ readOnly: true }}
                            helperText="Auto-fetched aggregated effort logs"
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            size="large"
                            sx={{ mt: 3, mb: 2, fontWeight: 'bold' }}
                            disabled={loadingData || !selectedSubject || isPublished || formData.study_hours === 0}
                        >
                            {loadingData ? 'Loading Data...' : isPublished ? 'PREDICTION UNAVAILABLE' : formData.study_hours === 0 ? 'STUDY FIRST' : 'PREDICT'}
                        </Button>
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
                title={modalProps.title}
            />
        </div>
    );
};

export default PredictScore;
