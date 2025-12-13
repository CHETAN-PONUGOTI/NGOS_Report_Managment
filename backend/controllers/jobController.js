const { getJobStatus } = require('../services/uploadProcessor');

const getJobStatusController = async (req, res) => {
    const { job_id } = req.params;

    const status = await getJobStatus(job_id);

    if (!status) {
        return res.status(404).json({ success: false, message: 'Job not found.' });
    }

    res.status(200).json({ success: true, status });
};

module.exports = { getJobStatusController };