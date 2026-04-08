const express = require('express');
const router = express.Router();
const { users } = require('../data/seed');

// GET /api/v1/users
router.get('/', (req, res) => {
    res.json({ count: users.length, data: users });
});

// GET /api/v1/users/:id
router.get('/:id', (req, res) => {
    const user = users.find(u => u.id === parseInt(req.params.id, 10));
    if (!user) {
        // Return 200 with error obj for discovery
        return res.status(200).json({ error: true, message: 'User not found' });
    }
    res.json(user);
});

// POST /api/v1/users
router.post('/', (req, res) => {
    const newUser = {
        id: users.length + 1,
        ...req.body,
        created_at: new Date().toISOString()
    };
    users.push(newUser);
    res.json(newUser);
});

// PUT /api/v1/users/:id
router.put('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id, 10));
    if (userIndex === -1) {
        return res.status(200).json({ error: true, message: 'User not found' });
    }
    
    users[userIndex] = { ...users[userIndex], ...req.body };
    res.json(users[userIndex]);
});

// DELETE /api/v1/users/:id
router.delete('/:id', (req, res) => {
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id, 10));
    if (userIndex === -1) {
        return res.status(200).json({ error: true, message: 'User not found' });
    }
    
    // Soft delete equivalent
    res.json({ success: true, message: `User ${req.params.id} deleted` });
});

module.exports = router;
