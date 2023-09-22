const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');  

const app = express();
app.use(express.json());
app.use(cors());  

const PORT = 3003;

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
    db.run("CREATE TABLE bills (id INTEGER PRIMARY KEY, order_id INTEGER, amount REAL)");
});

// Routes
app.post('/billing', (req, res) => {
    const { order_id, amount } = req.body;
    db.run("INSERT INTO bills (order_id, amount) VALUES (?, ?)", [order_id, amount], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ id: this.lastID, order_id, amount });
    });
});

app.get('/billing', (req, res) => {
    db.all("SELECT * FROM bills", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`BillingService listening on http://localhost:${PORT}`);
});
