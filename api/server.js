const express = require('express');
const mysql = require('mysql2/promise'); // Use mysql2/promise for async/await
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' })); // Increase limit for image data

// Database connection pool
let pool;

async function initializeDatabase() {
    try {
        pool = mysql.createPool({
            host: process.env.MYSQL_HOST,
            user: process.env.MYSQL_USER,
            password: process.env.MYSQL_PASSWORD,
            database: process.env.MYSQL_DATABASE,
            port: process.env.MYSQL_PORT || 3306,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        // Test connection and create table if not exists
        const connection = await pool.getConnection();
        await connection.query(`
            CREATE TABLE IF NOT EXISTS templates (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) UNIQUE NOT NULL,
                frame LONGTEXT NOT NULL,
                canvasWidth INT NOT NULL,
                canvasHeight INT NOT NULL,
                textFields LONGTEXT NOT NULL
            )
        `);
        connection.release();
        console.log('Connected to MySQL and templates table ensured.');
    } catch (err) {
        console.error('Failed to connect to MySQL or create table:', err.message);
        // Exit process if database connection fails on startup
        process.exit(1);
    }
}

// Initialize database on startup
initializeDatabase();

// API to get all templates
app.get('/api/templates', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM templates');
        res.json({
            message: 'success',
            data: rows.map(row => ({
                ...row,
                textFields: JSON.parse(row.textFields)
            }))
        });
    } catch (err) {
        console.error('Error fetching templates:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// API to save a template
app.post('/api/templates', async (req, res) => {
    const { name, frame, canvasWidth, canvasHeight, textFields } = req.body;
    if (!name || !frame || !canvasWidth || !canvasHeight || !textFields) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const textFieldsString = JSON.stringify(textFields);

    try {
        await pool.query(
            `INSERT INTO templates (name, frame, canvasWidth, canvasHeight, textFields) VALUES (?, ?, ?, ?, ?)`, 
            [name, frame, canvasWidth, canvasHeight, textFieldsString]
        );
        res.json({
            message: 'Template saved successfully'
        });
    } catch (err) {
        console.error('Error saving template to MySQL:', err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ error: 'Template name already exists' });
        }
        res.status(500).json({ error: err.message });
    }
});

// API to delete a template
app.delete('/api/templates/:name', async (req, res) => {
    const templateName = req.params.name;
    try {
        const [result] = await pool.query(`DELETE FROM templates WHERE name = ?`, [templateName]);
        if (result.affectedRows === 0) {
            res.status(404).json({ message: 'Template not found' });
        } else {
            res.json({ message: 'Template deleted successfully', changes: result.affectedRows });
        }
    } catch (err) {
        console.error('Error deleting template:', err.message);
        res.status(500).json({ error: err.message });
    }
});

// For Vercel Serverless Function deployment
module.exports = app;
