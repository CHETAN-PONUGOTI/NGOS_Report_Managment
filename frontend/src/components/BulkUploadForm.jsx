import React, { useState } from 'react';
import JobStatusTracker from './JobStatusTracker';

const BulkUploadForm = () => {
    const [file, setFile] = useState(null);
    const [status, setStatus] = useState(null);
    const [jobId, setJobId] = useState(null);
    const API_BASE_URL = import.meta.env.VITE_REACT_APP_API_BASE_URL;
    const API_URL = `${API_BASE_URL}/api/report/upload`;

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile && selectedFile.type === 'text/csv') {
            setFile(selectedFile);
            setStatus(null);
        } else {
            setFile(null);
            setStatus({ type: 'error', message: 'Please select a valid CSV file.' });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setStatus(null);
        setJobId(null);

        if (!file) {
            setStatus({ type: 'error', message: 'Please select a file to upload.' });
            return;
        }

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            setStatus({ type: 'info', message: 'Uploading file...' });
            const response = await fetch(API_URL, {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.status === 202) {
                setStatus({ type: 'success', message: data.message });
                setJobId(data.job_id);
                setFile(null);
            } else {
                setStatus({ type: 'error', message: data.message || 'File upload failed.' });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setStatus({ type: 'error', message: 'Network error or unable to connect to the server.' });
        }
    };

    return (
        <div className="max-w-xl mx-auto">
            <div className="card">
                <h2 className="text-2xl font-semibold mb-6 text-gray-800">Bulk Report Upload (CSV)</h2>
                <div className="mb-4 p-4 border border-blue-200 bg-blue-50 rounded-lg text-sm text-blue-800">
                    <p className="font-semibold">Required CSV Columns:</p>
                    {/* ADDED: break-words to prevent text overflow */}
                    <code className="block mt-1 break-words">ngo_id,month,people_helped,events_conducted,funds_utilized</code> 
                </div>
                {status && (
                    <div className={`p-3 mb-4 rounded-lg ${
                        status.type === 'success' ? 'bg-green-100 text-green-700' :
                        status.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                    }`}>
                        {status.message}
                    </div>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="csvFile" className="block text-sm font-medium text-gray-700 mb-1">Select CSV File</label>
                        <input
                            type="file"
                            name="csvFile"
                            id="csvFile"
                            accept=".csv"
                            onChange={handleFileChange}
                            required
                            className="w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                        />
                        {file && <p className="mt-2 text-sm text-gray-500">File selected: {file.name}</p>}
                    </div>
                    <button type="submit" disabled={!file} className="primary-button w-full disabled:opacity-50">
                        Start Bulk Upload
                    </button>
                </form>
            </div>

            {jobId && <JobStatusTracker jobId={jobId} />}
        </div>
    );
};

export default BulkUploadForm;