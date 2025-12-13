import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import ReportPage from './pages/ReportPage';
import UploadPage from './pages/UploadPage';
import DashboardPage from './pages/DashboardPage';
import LoginPage from './pages/LoginPage'; // NEW
import Navbar from './components/Navbar';

const App = () => {
    return (
        <Router>
            <div className="min-h-screen bg-gray-50">
                <Navbar />
                <main className="bg-[#DEB5AD] min-h-screen container mx-auto p-4 sm:p-6 lg:p-8">
                    <Routes>
                        <Route path="/" element={<Navigate to="/report" />} />
                        <Route path="/report" element={<ReportPage />} />
                        <Route path="/upload" element={<UploadPage />} />
                        <Route path="/login" element={<LoginPage />} /> // NEW
                        <Route path="/dashboard" element={<DashboardPage />} />
                    </Routes>
                </main>
            </div>
        </Router>
    );
};

export default App;
