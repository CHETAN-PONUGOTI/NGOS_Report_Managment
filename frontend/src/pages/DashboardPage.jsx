import React from 'react';
import AdminDashboard from '../components/AdminDashboard';
import { Navigate } from 'react-router-dom';

const DashboardPage = () => {
    const isAuthenticated = localStorage.getItem('adminToken');

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="py-6">
            <AdminDashboard />
        </div>
    );
};

export default DashboardPage;