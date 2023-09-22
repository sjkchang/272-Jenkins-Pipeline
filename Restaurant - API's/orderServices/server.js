const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors'); 

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// Setup SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Failed to create in-memory SQLite database:', err);
        process.exit(1);
    }
    console.log('Connected to in-memory SQLite database.');
});

// Initialize the database table
db.serialize(() => {
    db.run("CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, quantity INTEGER)");
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.get('/orders', (req, res) => {
    db.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post('/orders', (req, res) => {
    const { item, quantity } = req.body;
    db.run("INSERT INTO orders (item, quantity) VALUES (?, ?)", [item, quantity], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, item, quantity });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`OrderService listening on http://localhost:${PORT}`);
});
