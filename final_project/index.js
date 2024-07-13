const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

const SECRET_KEY = "your_secret_key"; // Replace with your secret key

app.use(express.json());

app.use("/customer", session({
    secret: "fingerprint_customer",
    resave: true,
    saveUninitialized: true
}));

// Middleware to authenticate token
app.use("/customer/auth/*", function auth(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(403).send('Token is required');

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token');
        req.user = decoded;
        next();
    });
});

// Login route to generate token
app.post('/login', (req, res) => {
    // Replace this with your actual login logic
    const { username, password } = req.body;
    if (username === "user" && password === "pass") { // Replace with real user validation
        const token = jwt.sign({ username }, SECRET_KEY, { expiresIn: '1h' });
        return res.json({ token });
    }
    res.status(401).send('Invalid credentials');
});

const PORT = 5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
