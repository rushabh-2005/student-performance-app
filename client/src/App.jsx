import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Import Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import Register from './pages/public/user/Register'; // <--- Import Register
import UserLogin from './pages/public/user/UserLogin';
import Login from './pages/public/user/UserLogin'; // alias for new route
import UserDashboard from './pages/public/user/UserDashboard';
import StudentDashboard from './pages/public/user/UserDashboard'; // alias for new route
import ParentLogin from './pages/public/parent/ParentLogin';
import ParentRegister from './pages/public/parent/ParentRegister';
import ParentDashboard from './pages/public/parent/ParentDashboard';
import ParentViewResults from './pages/public/parent/ParentViewResults';
import ParentViewInternalMarks from './pages/public/parent/ParentViewInternalMarks';
import ParentAnalyticalDashboard from './pages/public/parent/ParentAnalyticalDashboard';
import ParentFullMarksheet from './pages/public/parent/ParentFullMarksheet';
import AdminLogin from './pages/public/admin/AdminLogin';
import AdminDashboard from './pages/public/admin/AdminDashboard';
import UploadResult from './pages/public/admin/UploadResult';
import ManageSubjects from './pages/public/admin/ManageSubject'; // <--- Import ManageSubjects
import ViewResults from './pages/public/user/ViewResults';
import PublishResults from './pages/public/admin/PublishResults';
import ViewAttendance from './pages/public/user/ViewAttendance';
import ViewInternalMarks from './pages/public/user/ViewInternalMarks';
import FullMarksheet from './pages/public/user/FullMarksheet';
import AttendanceMonitoring from './pages/public/admin/AttendanceMonitoring';
import StudyLog from './pages/public/user/StudyLog';
import AdminRiskDashboard from './pages/public/admin/AdminRiskDashboard';
import PredictScore from './pages/public/user/PredictScore'; // <--- Import PredictScore
import AnalyticalDashboard from './pages/public/user/AnalyticalDashboard';
import UserProfileManagement from './pages/public/user/UserProfileManagement';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/register" element={<Register />} /> {/* <--- Route for Register */}

        {/* Student/Main Login */}
        <Route path="/login" element={<Login />} />
        <Route path="/login/user" element={<UserLogin />} />

        {/* Dedicated Parent Login */}
        <Route path="/parent-login" element={<ParentLogin />} />
        <Route path="/parent-register" element={<ParentRegister />} />

        {/* Admin Login */}
        <Route path="/login/admin" element={<AdminLogin />} />

        {/* --- Protected User Routes --- */}
        <Route element={<ProtectedRoute role="user" />}>
          <Route path="/student/dashboard" element={<StudentDashboard />} />
          <Route path="/user/dashboard" element={<UserDashboard />} />
          <Route path="/user/view-results" element={<ViewResults />} />
          <Route path="/user/view-attendance" element={<ViewAttendance />} />
          <Route path="/user/internal-marks" element={<ViewInternalMarks />} />
          <Route path="/user/full-marksheet" element={<FullMarksheet />} />
          <Route path="/user/study-log" element={<StudyLog />} />
          <Route path="/user/predict-score" element={<PredictScore />} />
          <Route path="/user/analytics" element={<AnalyticalDashboard />} />
          <Route path="/user/manage-profile" element={<UserProfileManagement />} />
        </Route>

        {/* --- Protected Parent Routes --- */}
        <Route element={<ProtectedRoute role="parent" />}>
          <Route path="/parent/dashboard" element={<ParentDashboard />} />
          <Route path="/parent/view-results" element={<ParentViewResults />} />
          <Route path="/parent/internal-marks" element={<ParentViewInternalMarks />} />
          <Route path="/parent/analytics" element={<ParentAnalyticalDashboard />} />
          <Route path="/parent/full-marksheet" element={<ParentFullMarksheet />} />
        </Route>

        {/* --- Protected Admin Routes --- */}
        <Route element={<ProtectedRoute role="admin" />}>
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          <Route path="/admin/upload-result" element={<UploadResult />} />
          <Route path="/admin/manage-subjects" element={<ManageSubjects />} />
          <Route path="/admin/publish-results" element={<PublishResults />} />
          <Route path="/admin/attendance" element={<AttendanceMonitoring />} />
          <Route path="/admin/risk-dashboard" element={<AdminRiskDashboard />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;