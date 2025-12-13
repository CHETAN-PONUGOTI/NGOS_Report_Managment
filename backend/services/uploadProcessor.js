const { getDB } = require('../config/database');
const { validateReport } = require('../utils/validator');
const { v4: uuidv4 } = require('uuid');

const jobQueue = new Map();
const JOB_STATUS = {
    PENDING: 'PENDING',
    PROCESSING: 'PROCESSING',
    COMPLETED: 'COMPLETED',
    FAILED: 'FAILED'
};

const addJob = (rows) => {
    const job_id = uuidv4();
    const total_rows = rows.length;

    const jobData = {
        job_id,
        total_rows,
        processed_rows: 0,
        status: JOB_STATUS.PENDING,
        failures: []
    };

    jobQueue.set(job_id, jobData);
    processJob(job_id, rows);
    return job_id;
};

const processJob = async (job_id, rows) => {
    const db = getDB();
    const job = jobQueue.get(job_id);

    if (!job) return;

    job.status = JOB_STATUS.PROCESSING;
    await db.run('INSERT INTO jobs (job_id, total_rows, processed_rows, status, failures) VALUES (?, ?, ?, ?, ?)',
        job.job_id, job.total_rows, job.processed_rows, job.status, JSON.stringify(job.failures)
    );

    for (const [index, row] of rows.entries()) {
        const rowNumber = index + 1;
        const validationErrors = validateReport(row);

        if (validationErrors) {
            job.failures.push({ row: rowNumber, errors: validationErrors, data: row });
        } else {
            try {
                await db.run(
                    `INSERT INTO reports (ngo_id, month, people_helped, events_conducted, funds_utilized)
                     VALUES (?, ?, ?, ?, ?)`,
                    row.ngo_id, row.month, row.people_helped, row.events_conducted, row.funds_utilized
                );
            } catch (err) {
                job.failures.push({ row: rowNumber, errors: ['Database insertion failed (Possible duplicate NGO/Month)'], data: row });
            }
        }

        job.processed_rows = rowNumber;

        if (rowNumber % 10 === 0 || rowNumber === job.total_rows) {
            await db.run(
                'UPDATE jobs SET processed_rows = ?, failures = ? WHERE job_id = ?',
                job.processed_rows, JSON.stringify(job.failures), job.job_id
            );
        }
    }

    job.status = JOB_STATUS.COMPLETED;
    await db.run(
        'UPDATE jobs SET processed_rows = ?, status = ?, failures = ? WHERE job_id = ?',
        job.total_rows, job.status, JSON.stringify(job.failures), job.job_id
    );

    console.log(`Job ${job_id} completed. Failures: ${job.failures.length}`);
};

const getJobStatus = async (job_id) => {
    const db = getDB();
    const job = await db.get('SELECT * FROM jobs WHERE job_id = ?', job_id);

    if (!job) return null;

    job.failures = JSON.parse(job.failures);
    return job;
};

module.exports = { addJob, getJobStatus, JOB_STATUS };