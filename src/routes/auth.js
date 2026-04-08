const express = require('express');
const router = express.Router();
const { tokens } = require('../data/seed');

// POST /api/v1/auth/login
router.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    // Fake login logic - accept anything for the lab
    const tokenKeys = Object.keys(tokens);
    const randomToken = tokenKeys[Math.floor(Math.random() * tokenKeys.length)];
    
    res.json({ 
        success: true, 
        token: randomToken,
        user_id: tokens[randomToken]
    });
});

// POST /api/v1/auth/logout
router.post('/logout', (req, res) => {
    res.json({ success: true, message: 'Logged out successfully' });
});

module.exports = router;
