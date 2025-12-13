import React from 'react';
import SingleReportForm from '../components/SingleReportForm';

const ReportPage = () => {
    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Individual Report Submission</h1>
            <SingleReportForm />
        </div>
    );
};

export default ReportPage;