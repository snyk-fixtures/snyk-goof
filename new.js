const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const fileUpload = require("express-fileupload");
const path = require("path");
const fs = require("fs");

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload());

const db = new sqlite3.Database(":memory:");

// ❌ Create an insecure database schema (No password hashing)
db.serialize(() => {
    db.run("CREATE TABLE users (id INTEGER PRIMARY KEY, username TEXT, password TEXT)");
    db.run("INSERT INTO users (username, password) VALUES ('admin', 'password123')"); // ❌ Hardcoded credentials
});

// ❌ SQL Injection Vulnerability
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    
    // Directly injecting user input into SQL query (BAD)
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    db.get(query, (err, user) => {
        if (user) {
            res.send(`Welcome, ${username}!`);
        } else {
            res.send("Invalid credentials!");
        }
    });
});

// ❌ Cross-Site Scripting (XSS) Vulnerability
app.get("/
