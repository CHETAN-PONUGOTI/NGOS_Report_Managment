const { getDB } = require('../config/database');

const getDashboardData = async (req, res) => {
    const { month } = req.query;

    if (!month || !/^\d{4}-\d{2}$/.test(month)) {
        return res.status(400).json({ success: false, message: 'Month query parameter is required and must be in YYYY-MM format.' });
    }

    const db = getDB();

    try {
        const results = await db.get(`
            SELECT
                COUNT(DISTINCT ngo_id) as total_ngos_reporting,
                SUM(people_helped) as total_people_helped,
                SUM(events_conducted) as total_events_conducted,
                SUM(funds_utilized) as total_funds_utilized
            FROM
                reports
            WHERE
                month = ?
        `, month);

        if (!results) {
            return res.status(404).json({ success: false, message: 'No data found for the selected month.' });
        }

        const dashboardData = {
            month: month,
            total_ngos_reporting: results.total_ngos_reporting || 0,
            total_people_helped: results.total_people_helped || 0,
            total_events_conducted: results.total_events_conducted || 0,
            total_funds_utilized: results.total_funds_utilized || 0
        };

        res.status(200).json({ success: true, data: dashboardData });

    } catch (error) {
        console.error('Dashboard query error:', error);
        res.status(500).json({ success: false, message: 'Internal server error.' });
    }
};

module.exports = { getDashboardData };