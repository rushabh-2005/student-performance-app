import axios from 'axios';

// Create an Axios instance for global configuration
const API = axios.create({
    baseURL: '/api' // Proxy will handle the rest in Vite
});

// Create a separate instance for the Python prediction
export const PredictionAPI = axios.create({
    baseURL: 'http://localhost:5000'
});

// Authentication endpoints
export const loginStudent = (data) => API.post('/auth/login', data);
export const registerStudent = (data) => API.post('/auth/register', data);
export const updateStudentProfile = (id, data) => API.put(`/auth/update-profile/${id}`, data);
export const loginAdmin = (data) => API.post('/auth/admin/login', data);
export const loginParent = (data) => API.post('/parent/login', data);
export const registerParent = (data) => API.post('/parent/register', data);

// Students endpoints
export const getAllStudents = () => API.get('/students');

// Subjects endpoints
export const getSubjectsBySem = (sem) => API.get(`/subjects/list/${sem}`);
export const addSubject = (data) => API.post('/subjects/add', data);
export const deleteSubject = (id) => API.delete(`/subjects/delete/${id}`);

// Results (External Marks)
export const getAllResults = () => API.get('/results');
export const getStudentResults = (userId) => API.get(`/results/user/${userId}`);
export const uploadResults = (data) => API.post('/results', data);
export const deleteResult = (id) => API.delete(`/results/${id}`);

// Internal Marks
export const getStudentInternals = (userId) => API.get(`/internals/user/${userId}`);
export const publishInternals = (data) => API.post('/internals/publish', data);

// Attendance
export const getStudentAttendance = (userId) => API.get(`/attendance/user/${userId}`);
export const updateAttendance = (data) => API.post('/attendance/update', data);

// Study Log Monitoring
export const getStudentMonitoring = (userId) => API.get(`/monitoring/user/${userId}`);
export const addStudyLog = (data) => API.post('/monitoring/add', data);
export const updateStudyLog = (id, data) => API.put(`/monitoring/update/${id}`, data);
export const deleteStudyLog = (id) => API.delete(`/monitoring/delete/${id}`);

// Parent specific
export const getParentStudentSnapshot = (studentId) => API.get(`/parent/student-snapshot/${studentId}`);
export const getChildByEmail = (email) => API.get(`/parent/get-student-by-email?email=${email}`);

// Admin specific
export const getAdminOverviewDesk = (sem) => API.get(`/admin/overview/${sem}`);

// Notification endpoints
export const notifyParent = (data) => API.post('/admin/notify-parent', data);
export const getNotifications = (parentId) => API.get(`/notifications/parent/${parentId}`);
export const markNotificationRead = (id) => API.post(`/notifications/mark-read/${id}`);

// Predict Endpoint
export const getPredictedScore = (data) => API.post('/predict-score', data);

// Analytics
export const getStudentAnalytics = (userId) => API.get(`/analytics/user/${userId}`);

export default API;
