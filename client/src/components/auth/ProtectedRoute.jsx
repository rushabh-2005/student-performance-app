import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = ({ role }) => {
    // Check if user/parent is logged in
    const user = JSON.parse(localStorage.getItem('user'));

    // Check if admin is logged in
    const admin = JSON.parse(localStorage.getItem('admin'));

    if (role === 'admin') {
        if (!admin) {
            return <Navigate to="/login/admin" replace />;
        }
        return <Outlet />;
    }

    if (role === 'user') {
        if (!user || user.role === 'parent') {
            return <Navigate to="/login" replace />;
        }
        return <Outlet />;
    }

    if (role === 'parent') {
        if (!user || user.role !== 'parent') {
            return <Navigate to="/parent-login" replace />;
        }
        return <Outlet />;
    }

    // Default catch-all
    return <Navigate to="/" replace />;
};

export default ProtectedRoute;
