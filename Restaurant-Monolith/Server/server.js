const express = require("express");
const bodyParser = require("body-parser");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

const PORT = 3001;

// Setup SQLite database
const db1 = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Failed to create in-memory SQLite database:", err);
        process.exit(1);
    }
    console.log("Connected to in-memory SQLite database.");
});

// Initialize the database table
db1.serialize(() => {
    db1.run(
        "CREATE TABLE orders (id INTEGER PRIMARY KEY, item TEXT, quantity INTEGER)"
    );
});

// Middleware to parse JSON requests
app.use(bodyParser.json());

// Routes
app.get("/orders", (req, res) => {
    db1.all("SELECT * FROM orders", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

app.post("/orders", (req, res) => {
    const { item, quantity } = req.body;
    db1.run(
        "INSERT INTO orders (item, quantity) VALUES (?, ?)",
        [item, quantity],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, item, quantity });
        }
    );
});

const db2 = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Failed to create in-memory SQLite database:", err);
        process.exit(1);
    }
    console.log("Connected to in-memory SQLite database.");
});

// Initialize the database table
db2.serialize(() => {
    db2.run(
        "CREATE TABLE cooking_tasks (id INTEGER PRIMARY KEY, order_id INTEGER, status TEXT)"
    );
});

// Routes
app.post("/cooking", (req, res) => {
    const { order_id } = req.body;
    db2.run(
        "INSERT INTO cooking_tasks (order_id, status) VALUES (?, ?)",
        [order_id, "Cooking"],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, order_id, status: "Cooking" });
        }
    );
});

app.get("/cooking", (req, res) => {
    db2.all("SELECT * FROM cooking_tasks", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

const db3 = new sqlite3.Database(":memory:", (err) => {
    if (err) {
        console.error("Failed to create in-memory SQLite database:", err);
        process.exit(1);
    }
    console.log("Connected to in-memory SQLite database.");
});

// Initialize the database table
db3.serialize(() => {
    db3.run(
        "CREATE TABLE bills (id INTEGER PRIMARY KEY, order_id INTEGER, amount INTEGER)"
    );
});

app.post("/billing", (req, res) => {
    const { order_id, amount } = req.body;
    db3.run(
        "INSERT INTO bills (order_id, amount) VALUES (?, ?)",
        [order_id, amount],
        function (err) {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json({ id: this.lastID, order_id, amount });
        }
    );
});

app.get("/billing", (req, res) => {
    db3.all("SELECT * FROM bills", [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`OrderService listening on http://localhost:${PORT}`);
});
