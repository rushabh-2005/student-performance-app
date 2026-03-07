import React, { useState, useEffect } from 'react';
import { getSubjectsBySem, getPredictedScore } from '../../services/api';

import { Container, Paper, TextField, Button, Typography, Box, MenuItem, Grid } from '@mui/material';

import Swal from 'sweetalert2'; // Beautiful alert boxes
import Nav1 from '../../components/nav1';

const AbilityTestForm = () => {
    const [subjects, setSubjects] = useState([]);
    const [user] = useState(JSON.parse(localStorage.getItem('user')));
    const [formData, setFormData] = useState({
        subject_id: '',
        attendance_per: '',
        study_hours: '',
        internal_marks: '',
        tutoring: 0
    });

    useEffect(() => {
        if (user) {
            getSubjectsBySem(user.current_sem).then(res => setSubjects(res.data));
        }
    }, [user]);

    const showAlert = (score) => {
        Swal.fire({
            title: 'AI Prediction Result',
            text: `Based on your inputs, your predicted score is ${score}/70`,
            icon: score > 28 ? 'success' : 'warning',
            confirmButtonText: 'Understood'
        });
    };

    const handlePredict = async (e) => {
        e.preventDefault();

        try {
            // Sending data to our prediction logic
            const response = await getPredictedScore(formData);
            const { predicted_score } = response.data;

            // Displaying the result in an Alert Box
            showAlert(predicted_score);

        } catch (err) {
            Swal.fire('Error', 'Could not process prediction. Try again.', 'error');
        }
    };

    return (
        <Box sx={{ bgcolor: '#f4f6f8', minHeight: '100vh' }}>
            <Nav1 />
            <Container maxWidth="sm" sx={{ mt: 8 }}>
                <Paper sx={{ p: 4, borderRadius: 3, boxShadow: 3 }}>
                    <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
                        AI Performance Test
                    </Typography>
                    <Typography variant="body2" color="textSecondary" align="center" sx={{ mb: 3 }}>
                        Enter your current metrics to see your predicted external exam score.
                    </Typography>

                    <form onSubmit={handlePredict}>
                        <TextField select fullWidth label="Select Subject" sx={{ mb: 2 }} required
                            onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}>
                            {subjects.map(s => <MenuItem key={s.id} value={s.id}>{s.subject_name}</MenuItem>)}
                        </TextField>

                        <TextField fullWidth label="Current Attendance %" type="number" sx={{ mb: 2 }} required
                            onChange={(e) => setFormData({ ...formData, attendance_per: e.target.value })} />

                        <TextField fullWidth label="Avg. Daily Study Hours" type="number" sx={{ mb: 2 }} required
                            onChange={(e) => setFormData({ ...formData, study_hours: e.target.value })} />

                        <TextField fullWidth label="Internal Marks (out of 30)" type="number" sx={{ mb: 2 }} required
                            onChange={(e) => setFormData({ ...formData, internal_marks: e.target.value })} />

                        <TextField select fullWidth label="Extra Tutoring?" sx={{ mb: 3 }}
                            onChange={(e) => setFormData({ ...formData, tutoring: e.target.value })}>
                            <MenuItem value={1}>Yes, I take extra classes</MenuItem>
                            <MenuItem value={0}>No, I study on my own</MenuItem>
                        </TextField>

                        <Button type="submit" variant="contained" fullWidth size="large" sx={{ py: 1.5, fontWeight: 'bold' }}>
                            Analyze My Ability
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>
    );
};

export default AbilityTestForm;