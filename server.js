const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.static(__dirname)); // Serve static files from the current directory
app.use(express.json({ limit: '50mb' })); // Increase limit for image data

// Initialize SQLite database
const db = new sqlite3.Database('./templates.db', (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS templates (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT UNIQUE,
            frame TEXT,
            canvasWidth INTEGER,
            canvasHeight INTEGER,
            textFields TEXT
        )`, (createErr) => {
            if (createErr) {
                console.error('Error creating table:', createErr.message);
            } else {
                console.log('Templates table created or already exists.');
            }
        });
    }
});

// API to get all templates
app.get('/api/templates', (req, res) => {
    db.all('SELECT * FROM templates', [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({
            message: 'success',
            data: rows.map(row => ({
                ...row,
                textFields: JSON.parse(row.textFields)
            }))
        });
    });
});

// API to save a template
app.post('/api/templates', (req, res) => {
    const { name, frame, canvasWidth, canvasHeight, textFields } = req.body;
    if (!name || !frame || !canvasWidth || !canvasHeight || !textFields) {
        return res.status(400).json({ error: 'Missing required fields' });
    }

    const textFieldsString = JSON.stringify(textFields);

    db.run(`INSERT INTO templates (name, frame, canvasWidth, canvasHeight, textFields) VALUES (?, ?, ?, ?, ?)`, 
        [name, frame, canvasWidth, canvasHeight, textFieldsString], 
        function(err) {
            if (err) {
                if (err.message.includes('UNIQUE constraint failed')) {
                    return res.status(409).json({ error: 'Template name already exists' });
                }
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({
                message: 'Template saved successfully',
                id: this.lastID
            });
        }
    );
});

// API to delete a template
app.delete('/api/templates/:name', (req, res) => {
    const templateName = req.params.name;
    db.run(`DELETE FROM templates WHERE name = ?`, templateName, function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        if (this.changes === 0) {
            res.status(404).json({ message: 'Template not found' });
        } else {
            res.json({ message: 'Template deleted successfully', changes: this.changes });
        }
    });
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
