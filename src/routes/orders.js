const express = require('express');
const router = express.Router();
const { orders } = require('../data/seed');

// POST /api/v1/orders
router.post('/', (req, res) => {
    const newOrder = {
        id: orders.length + 1,
        ...req.body,
        status: 'pending',
        created_at: new Date().toISOString()
    };
    orders.push(newOrder);
    res.json(newOrder);
});

// GET /api/v1/orders/:id
router.get('/:id', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id, 10));
    if (!order) {
        return res.status(200).json({ error: true, message: 'Order not found' });
    }
    res.json(order);
});

// GET /api/v1/orders/:id/status
router.get('/:id/status', (req, res) => {
    const order = orders.find(o => o.id === parseInt(req.params.id, 10));
    if (!order) {
        return res.status(200).json({ error: true, message: 'Order not found' });
    }
    res.json({ id: order.id, status: order.status });
});

module.exports = router;
