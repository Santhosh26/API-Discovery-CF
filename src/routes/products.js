const express = require('express');
const router = express.Router();
const { products, reviews } = require('../data/seed');

// GET /api/v1/products
router.get('/', (req, res) => {
    let result = products;
    if (req.query.category) {
        result = products.filter(p => p.category.toLowerCase() === req.query.category.toLowerCase());
    }
    res.json({ count: result.length, data: result });
});

// GET /api/v1/products/:id
router.get('/:id', (req, res) => {
    const product = products.find(p => p.id === parseInt(req.params.id, 10));
    if (!product) {
        return res.status(200).json({ error: true, message: 'Product not found' });
    }
    res.json(product);
});

// GET /api/v1/products/:id/reviews
router.get('/:id/reviews', (req, res) => {
    const productId = parseInt(req.params.id, 10);
    const productReviews = reviews.filter(r => r.productId === productId);
    
    // Always return 2xx
    res.json({ count: productReviews.length, data: productReviews });
});

module.exports = router;
