const { getDB } = require('../config/database');
const { validateReport } = require('../utils/validator');
const multer = require('multer');
const csv = require('csv-parser');
const { Writable } = require('stream');
const { addJob } = require('../services/uploadProcessor');

const upload = multer({ storage: multer.memoryStorage() });

const submitSingleReport = async (req, res) => {
    const reportData = req.body;
    const validationErrors = validateReport(reportData);

    if (validationErrors) {
        return res.status(400).json({ success: false, errors: validationErrors });
    }

    const db = getDB();
    const { ngo_id, month, people_helped, events_conducted, funds_utilized } = reportData;

    try {
        await db.run(
            `INSERT INTO reports (ngo_id, month, people_helped, events_conducted, funds_utilized)
             VALUES (?, ?, ?, ?, ?)`,
            ngo_id, month, people_helped, events_conducted, funds_utilized
        );
        res.status(201).json({ success: true, message: 'Report submitted successfully.' });
    } catch (error) {
        if (error.code === 'SQLITE_CONSTRAINT') {
            return res.status(409).json({ success: false, message: 'Report for this NGO and month already exists. Data not double-counted.' });
        }
        console.error('Database error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

const bulkReportUpload = async (req, res) => {
    if (!req.file) {
        return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const rows = [];
    const bufferStream = new Writable({
        write(chunk, encoding, callback) {
            rows.push(chunk);
            callback();
        }
    });

    try {
        const stream = bufferStream.cork();
        // Pipe the buffer to csv-parser
        require('stream').Readable.from(req.file.buffer)
            .pipe(csv({
                mapValues: ({ header, value }) => {
                    if (['people_helped', 'events_conducted'].includes(header)) {
                        return parseInt(value);
                    }
                    if (header === 'funds_utilized') {
                        return parseFloat(value);
                    }
                    return value;
                }
            }))
            .on('data', (data) => rows.push(data))
            .on('end', () => {
                const jobId = addJob(rows);
                res.status(202).json({ success: true, message: 'File uploaded and processing started.', job_id: jobId });
            })
            .on('error', (err) => {
                console.error('CSV Parsing Error:', err);
                res.status(400).json({ success: false, message: 'Error parsing CSV file.' });
            });
    } catch (error) {
        console.error('File processing error:', error);
        res.status(500).json({ success: false, message: 'Internal server error during file processing.' });
    }
};

module.exports = { submitSingleReport, bulkReportUpload, upload };