const express = require('express');
const router = express.Router();
const { submitSingleReport, bulkReportUpload, upload } = require('../controllers/reportController');

router.post('/', submitSingleReport);
router.post('/upload', upload.single('csvFile'), bulkReportUpload);

module.exports = router;