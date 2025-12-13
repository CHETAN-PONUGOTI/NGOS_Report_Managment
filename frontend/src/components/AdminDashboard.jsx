import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, unit = '' }) => (
    <div className="card flex flex-col justify-center items-center text-center">
        <p className="text-3xl font-bold text-blue-600">{value.toLocaleString()}{unit}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
    </div>
);

const AdminDashboard = () => {
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const API_BASE_URL = 'http://localhost:3000/api/dashboard';

    const fetchData = async (selectedMonth) => {
        setLoading(true);
        setError(null);
        setData(null);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_BASE_URL}?month=${selectedMonth}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
                // If token is invalid or expired, clear it and redirect to login
                localStorage.removeItem('adminToken');
                navigate('/login', { replace: true });
                return;
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to fetch dashboard data.');
            }
            
            const result = await response.json();
            setData(result.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData(month);
    }, [month]);

    const handleMonthChange = (e) => {
        setMonth(e.target.value);
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        navigate('/login', { replace: true });
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
                <div className="flex space-x-3 items-center">
                    <label htmlFor="month-selector" className="text-sm font-medium text-gray-700 mr-2">Select Month:</label>
                    <input
                        type="month"
                        id="month-selector"
                        value={month}
                        onChange={handleMonthChange}
                        className="input-field w-auto"
                    />
                    <button onClick={handleLogout} className="secondary-button py-1 px-3">
                        Logout
                    </button>
                </div>
            </div>

            <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-700">Summary for {month}</h2>
            </div>

            {loading && <p className="text-center text-blue-600">Loading data...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && data && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <StatCard title="Total NGOs Reporting" value={data.total_ngos_reporting} />
                    <StatCard title="Total People Helped" value={data.total_people_helped} />
                    <StatCard title="Total Events Conducted" value={data.total_events_conducted} />
                    <StatCard title="Total Funds Utilized" value={data.total_funds_utilized} unit=" ₹" />
                </div>
            )}
            
            {!loading && !error && !data && (
                <p className="text-center text-gray-500">No data found for this month.</p>
            )}
        </div>
    );
};

export default AdminDashboard;