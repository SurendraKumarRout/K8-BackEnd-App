require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// MySQL Database Connection Pool
const db = mysql.createPool({
  host: process.env.DB_HOST || "k8-mysql",
  user: process.env.DB_USER || "user",
  password: process.env.DB_PASS || "password",
  database: process.env.DB_NAME || "ecommerce",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
}).promise(); // Use promise-based pool for cleaner async handling

// API Endpoint: Get List of Products
app.get('/products', async (req, res) => {
  try {
    const [results] = await db.query('SELECT id, name, price FROM products');
    const parsedResults = results.map(product => ({
      ...product,
      price: parseFloat(product.price), // Convert price to a number
    }));
    res.json(parsedResults);
  } catch (err) {
    console.error("Error retrieving products:", err);
    res.status(500).send("Error retrieving products");
  }
});

// API Endpoint: Place an Order
app.post("/orders", async (req, res) => {
  const { product_id, quantity } = req.body;
  try {
    const [results] = await db.query(
      "INSERT INTO orders (product_id, quantity) VALUES (?, ?)",
      [product_id, quantity]
    );
    res.json({ orderId: results.insertId });
  } catch (err) {
    console.error("Error placing order:", err);
    res.status(500).json({ error: "Database error" });
  }
});

// Start the Backend Server
app.listen(port, () => {
  console.log(`Backend API running on port ${port}`);
});