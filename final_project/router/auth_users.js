const express = require('express');
const jwt = require('jsonwebtoken');
const books = require("./booksdb.js");

const regd_users = express.Router();
let users = [];

// Register a new user
regd_users.post("/register", (req, res) => {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Check if the username already exists
    if (users.some(user => user.username === username)) {
        return res.status(400).json({ message: "Username already exists" });
    }

    // Register the user
    users.push({ username, password });
    return res.status(200).json({ message: "User registered successfully" });
});

// Check if the username is valid
const isValid = (username) => {
    return users.some(user => user.username === username);
};

// Authenticate the user
const authenticatedUser = (username, password) => {
    return users.some(user => user.username === username && user.password === password);
};

// Login route to generate token
regd_users.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    if (!isValid(username)) {
        return res.status(401).json({ message: "Invalid username" });
    }

    if (!authenticatedUser(username, password)) {
        return res.status(401).json({ message: "Invalid password" });
    }

    // Generate JWT token
    const token = jwt.sign({ username }, "your_jwt_secret_key", { expiresIn: '1h' });

    return res.status(200).json({ message: "Login successful", token });
});

// Add or modify a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
    const { isbn } = req.params;
    const { review } = req.body;
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    try {
        const decoded = jwt.verify(token, "your_jwt_secret_key");
        const username = decoded.username;

        if (!books[isbn]) {
            return res.status(404).json({ message: "Book not found" });
        }

        if (!books[isbn].reviews) {
            books[isbn].reviews = {};
        }

        // Check if the user already reviewed this book
        if (books[isbn].reviews[username]) {
            // Modify existing review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review modified successfully" });
        } else {
            // Add new review
            books[isbn].reviews[username] = review;
            return res.status(200).json({ message: "Review added successfully" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
});

module.exports = {
    authenticated: regd_users,
    isValid,
    users
};
