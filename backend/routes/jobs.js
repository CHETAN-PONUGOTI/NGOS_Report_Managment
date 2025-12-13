const express = require('express');
const router = express.Router();
const { getJobStatusController } = require('../controllers/jobController');

router.get('/:job_id', getJobStatusController);

module.exports = router;