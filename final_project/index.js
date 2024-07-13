const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use(session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Login endpoint
app.post("/customer/login", (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).json({ message: "Username and password are required" });
    }

    // Placeholder authentication logic
    if (username === "user" && password === "pass") {
        // Generate JWT access token
        let accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

        // Store access token in session
        req.session.accessToken = accessToken;

        return res.status(200).json({ message: "User successfully logged in", token: accessToken });
    } else {
        return res.status(401).json({ message: "Invalid username or password" });
    }
});

// Middleware for user authentication
const authenticateUser = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(403).json({ message: "A token is required for authentication" });
    }

    const token = authHeader.split(' ')[1]; // Bearer <token>

    jwt.verify(token, "access", (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
};

// Apply authentication middleware to routes requiring authentication
app.use("/customer/auth/*", authenticateUser);

// Middleware to check user authentication
app.use("/user", authenticateUser);

// Mount authenticated routes for customers
app.use("/customer", customer_routes);

// Mount general routes
app.use("/", genl_routes);

const PORT = 5002;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
