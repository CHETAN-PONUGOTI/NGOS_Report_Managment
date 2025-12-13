import React, { useState, useEffect } from 'react';

const JobStatusTracker = ({ jobId }) => {
    const [jobStatus, setJobStatus] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = `http://localhost:3000/api/job-status/${jobId}`;

    const fetchJobStatus = async () => {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('Failed to fetch job status');
            }
            const data = await response.json();
            setJobStatus(data.status);
            setLoading(false);
        } catch (error) {
            console.error('Job status fetch error:', error);
            setLoading(false);
        }
    };

    useEffect(() => {
        setLoading(true);
        fetchJobStatus();

        let interval;
        if (jobStatus?.status !== 'COMPLETED' && jobStatus?.status !== 'FAILED') {
            interval = setInterval(fetchJobStatus, 3000);
        }

        return () => clearInterval(interval);
    }, [jobId, jobStatus?.status]);

    if (loading) {
        return <p className="text-gray-600">Loading job status...</p>;
    }

    if (!jobStatus) {
        return <p className="text-red-500">Could not retrieve job status for ID: {jobId}</p>;
    }

    const { total_rows, processed_rows, status, failures } = jobStatus;
    const progress = total_rows > 0 ? Math.round((processed_rows / total_rows) * 100) : 0;
    const isCompleted = status === 'COMPLETED';
    const isFailed = status === 'FAILED';
    const hasFailures = failures.length > 0;

    return (
        <div className="card mt-6">
            <h3 className="text-xl font-semibold mb-4">Bulk Upload Job Status ({jobId.slice(0, 8)}...)</h3>
            <div className={`p-3 rounded-lg font-medium mb-4 ${
                isCompleted ? (hasFailures ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700') :
                isFailed ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
            }`}>
                Status: {status}
            </div>

            <div className="mb-4">
                <p className="text-sm text-gray-700 mb-1">Processed {processed_rows} of {total_rows} rows</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                        className="bg-blue-600 h-2.5 rounded-full"
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <p className="text-xs text-gray-500 mt-1">{progress}% Complete</p>
            </div>

            {hasFailures && (
                <div className="mt-4 border-t pt-4">
                    <h4 className="font-semibold text-red-600 mb-2">Partial Failures ({failures.length} rows failed)</h4>
                    <div className="max-h-60 overflow-y-auto border p-3 rounded-lg bg-red-50">
                        <ul className="list-disc pl-5 text-sm space-y-2">
                            {failures.slice(0, 5).map((failure, index) => (
                                <li key={index} className="text-red-800">
                                    Row {failure.row}: {failure.errors.join('; ')} (Data: NGO ID {failure.data.ngo_id})
                                </li>
                            ))}
                            {failures.length > 5 && (
                                <li className="text-red-800 font-medium">...and {failures.length - 5} more failures.</li>
                            )}
                        </ul>
                    </div>
                </div>
            )}

            {isCompleted && !hasFailures && (
                <p className="text-green-600 mt-4 font-medium">✅ All rows successfully processed.</p>
            )}
        </div>
    );
};

export default JobStatusTracker;