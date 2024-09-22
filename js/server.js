const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const bodyParser = require('body-parser');
const app = express();
const path = require('path');

app.use(express.static(path.join(__dirname, '..')));
app.use(bodyParser.json());


const db = new sqlite3.Database('./database.db', (err) => {
    if (err) {
        console.error(err.message);
    } else {
        console.log('Connected to the SQLite database.');
    }
});


db.run(`CREATE TABLE IF NOT EXISTS blogs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    content TEXT NOT NULL
)`);

// Fetch all blogs
app.get('/blogs', (req, res) => {
    const sql = 'SELECT * FROM blogs';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Add a new blog
app.post('/addBlog', (req, res) => {
    const { title, content } = req.body;
    const sql = 'INSERT INTO blogs (title, content) VALUES (?, ?)';
    db.run(sql, [title, content], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.json({ id: this.lastID, title, content });
    });
});

// Delete a blog 
app.delete('/deleteBlog/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM blogs WHERE id = ?';
    db.run(sql, id, function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
        }
        res.status(204).send();
    });
});

// Update a blog by ID
app.put('/updateBlog/:id', (req, res) => {
    const { id } = req.params;
    const { title, content } = req.body;
    const sql = 'UPDATE blogs SET title = ?, content = ? WHERE id = ?';

    db.run(sql, [title, content, id], function(err) {
        if (err) {
            res.status(400).json({ error: err.message });
        } else {
            res.json({ id, title, content });
        }
    });
});


// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
