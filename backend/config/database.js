const sqlite = require('sqlite');
const sqlite3 = require('sqlite3');
let db;

const initializeDatabase = async () => {
    db = await sqlite.open({
        filename: './ngo_reports.db',
        driver: sqlite3.Database
    });

    await db.exec(`
        CREATE TABLE IF NOT EXISTS reports (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            ngo_id TEXT NOT NULL,
            month TEXT NOT NULL,
            people_helped INTEGER NOT NULL,
            events_conducted INTEGER NOT NULL,
            funds_utilized REAL NOT NULL,
            UNIQUE (ngo_id, month) ON CONFLICT IGNORE
        );
        CREATE TABLE IF NOT EXISTS jobs (
            job_id TEXT PRIMARY KEY,
            total_rows INTEGER,
            processed_rows INTEGER,
            status TEXT,
            failures TEXT
        );
    `);
};

const getDB = () => db;

module.exports = { initializeDatabase, getDB };