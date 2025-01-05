const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

require("dotenv").config();

const app = express();
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: {
        rejectUnauthorized: false,
    },
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
    });


app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Welcome to your Express server" });
});

//make a get all users
app.get("/users", async (req, res) => {
  try {
    const allUsers = await pool.query("SELECT * FROM users");
    res.json(allUsers.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// make a create user route
app.post("/user", async (req, res) => {
  try {
    const { name, email,  bio} = req.body;
    const newUser = await pool.query(
      "INSERT INTO users (name, email, bio) VALUES($1, $2, $3) RETURNING *",
      [name, email, bio]
    );
    res.json(newUser.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

// get all saved users
app.get("/saved", async (req, res) => {
  try {
    const allSaved = await pool.query("SELECT * FROM users WHERE id IN (SELECT user_id FROM saved)");
    res.json(allSaved.rows);
  } catch (error) {
    console.error(error.message);
  }
});

// save a user
app.post("/saved", async (req, res) => {
  try {
    const { user_id } = req.body;
    const newSaved = await pool.query(
      "INSERT INTO saved (user_id) VALUES($1) RETURNING *",
      [user_id]
    );
    res.json(newSaved.rows[0]);
  } catch (error) {
    console.error(error.message);
  }
});

const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;