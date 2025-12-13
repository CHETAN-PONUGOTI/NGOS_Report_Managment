require('dotenv').config();

const express = require('express');
const cors = require('cors');
const database = require('./config/database'); 
const reportRoutes = require('./routes/reports');
const jobRoutes = require('./routes/jobs');
const dashboardRoutes = require('./routes/dashboard');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

database.initializeDatabase().then(() => {
    console.log('Database initialized successfully.');

    app.use('/api/auth', authRoutes);
    app.use('/api/report', reportRoutes);
    app.use('/api/job-status', jobRoutes);
    app.use('/api/dashboard', dashboardRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}).catch(err => {
    console.error('Failed to initialize database:', err);
    process.exit(1);
});