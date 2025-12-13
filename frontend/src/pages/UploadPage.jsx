import React from 'react';
import BulkUploadForm from '../components/BulkUploadForm';

const UploadPage = () => {
    return (
        <div className="py-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Bulk Upload Center</h1>
            <BulkUploadForm />
        </div>
    );
};

export default UploadPage;