import React, { useState } from 'react';

const SingleReportForm = () => {
    const [formData, setFormData] = useState({
        ngo_id: '',
        month: new Date().toISOString().slice(0, 7),
        people_helped: 0,
        events_conducted: 0,
        funds_utilized: 0.00
    });
    const [status, setStatus] = useState(null);

    const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL

    const API_URL = `${API_BASE_URL}/api/report`;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: name === 'funds_utilized' ? parseFloat(value) : (name === 'ngo_id' || name === 'month' ? value : parseInt(value) || 0)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setStatus({ type: 'success', message: data.message });
                setFormData({ // Reset form data
                    ngo_id: '',
                    month: new Date().toISOString().slice(0, 7),
                    people_helped: 0,
                    events_conducted: 0,
                    funds_utilized: 0.00
                });
            } else {
                const message = data.errors ? data.errors.join(', ') : data.message || 'Submission failed due to server error.';
                setStatus({ type: 'error', message });
            }
        } catch (error) {
            console.error('Submission error:', error);
            setStatus({ type: 'error', message: 'Network error or unable to connect to the server.' });
        }
    };

    return (
        <div className="card max-w-lg mx-auto">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Submit Monthly Report</h2>
            {status && (
                <div className={`p-3 mb-4 rounded-lg ${status.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {status.message}
                </div>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="ngo_id" className="block text-sm font-medium text-gray-700">NGO ID</label>
                    <input
                        type="text"
                        name="ngo_id"
                        id="ngo_id"
                        value={formData.ngo_id}
                        onChange={handleChange}
                        required
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="month" className="block text-sm font-medium text-gray-700">Month</label>
                    <input
                        type="month"
                        name="month"
                        id="month"
                        value={formData.month}
                        onChange={handleChange}
                        required
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="people_helped" className="block text-sm font-medium text-gray-700">People Helped</label>
                    <input
                        type="number"
                        name="people_helped"
                        id="people_helped"
                        value={formData.people_helped}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="events_conducted" className="block text-sm font-medium text-gray-700">Events Conducted</label>
                    <input
                        type="number"
                        name="events_conducted"
                        id="events_conducted"
                        value={formData.events_conducted}
                        onChange={handleChange}
                        required
                        min="0"
                        className="input-field mt-1"
                    />
                </div>
                <div>
                    <label htmlFor="funds_utilized" className="block text-sm font-medium text-gray-700">Funds Utilized (₹)</label>
                    <input
                        type="number"
                        name="funds_utilized"
                        id="funds_utilized"
                        value={formData.funds_utilized}
                        onChange={handleChange}
                        required
                        min="0"
                        step="0.01"
                        className="input-field mt-1"
                    />
                </div>
                <button type="submit" className="primary-button w-full">
                    Submit Report
                </button>
            </form>
        </div>
    );
};

export default SingleReportForm;