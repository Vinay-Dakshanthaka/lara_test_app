import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    const token = localStorage.getItem('token');
    const passwordUpdateRequired = localStorage.getItem('passwordUpdateRequired') === 'true';

    if (!token) {
        return <Navigate to="/signin" />;
    }

    if (passwordUpdateRequired) {
        return <Navigate to="/password-update-warning" />;
    }

    return <Outlet />;
};

export default ProtectedRoute;
