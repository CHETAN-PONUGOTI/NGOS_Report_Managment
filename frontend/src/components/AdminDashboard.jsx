import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StatCard = ({ title, value, unit = '' }) => (
    <div className="card flex flex-col justify-center items-center text-center">
        <p className="text-3xl font-bold text-blue-600">{value.toLocaleString()}{unit}</p>
        <p className="text-sm font-medium text-gray-500 mt-1">{title}</p>
    </div>
);

const Spinner = () => (
    <div className="flex flex-col items-center justify-center py-10">
        <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-gray-800"></div>
        <p className="text-gray-700 mt-4 text-lg">
            Loading data<span className="animate-pulse">...</span>
        </p>
    </div>
);

const AdminDashboard = () => {
    const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL; 
    const [month, setMonth] = useState(new Date().toISOString().slice(0, 7));
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const fetchData = async (selectedMonth) => {
        setLoading(true);
        setError(null);
        setData(null);
        const token = localStorage.getItem('adminToken');

        try {
            const response = await fetch(`${API_BASE_URL}/api/dashboard?month=${selectedMonth}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 401 || response.status === 403) {
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
            setError('Error fetching data: ' + err.message);
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
            {/* NEW LAYOUT: Use flex-col on mobile, flex-row on md screens, and mb-4 spacing */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
                    Admin Dashboard
                </h1>
                
                {/* Controls: Month Selector and Logout (Aligned horizontally on all sizes) */}
                <div className="flex flex-row space-x-3 items-center w-full md:w-auto justify-end">
                    <label htmlFor="month-selector" className="text-sm font-medium text-gray-700 whitespace-nowrap">
                        Select Month:
                    </label>
                    <input
                        type="month"
                        id="month-selector"
                        value={month}
                        onChange={handleMonthChange}
                        // Reduced input width for mobile
                        className="input-field w-[120px] text-sm" 
                    />
                    <button onClick={handleLogout} className="secondary-button py-1 px-3 text-sm">
                        Logout
                    </button>
                </div>
            </div>

            {/* Title moved here, directly below the main header/controls */}
            <div className="mb-6 mt-4">
                <h2 className="text-xl font-semibold text-gray-700">Summary for {month}</h2>
            </div>
            {/* END OF NEW LAYOUT */}


            {loading && <Spinner />} 
            {error && <p className="text-center text-red-500">{error}</p>}
            
            {!loading && !error && data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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