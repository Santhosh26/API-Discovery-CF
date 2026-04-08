const express = require('express');
const logger = require('./middleware/logger');
const usersRoute = require('./routes/users');
const productsRoute = require('./routes/products');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(logger);

// Routes
app.use('/api/v1/users', usersRoute);
app.use('/api/v1/products', productsRoute);
app.use('/api/v1/orders', ordersRoute);
app.use('/api/v1/auth', authRoute);

// Health check endpoint
app.get('/api/v1/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Global error handler - ensuring 2xx responses for discovery
app.use((err, req, res, next) => {
    console.error(`[Error] ${req.method} ${req.originalUrl}:`, err.message);
    res.status(200).json({ error: true, message: err.message || 'Internal Server Error' });
});

// 404 handler - also returning 2xx for discovery purposes
app.use((req, res) => {
    res.status(200).json({ error: true, message: 'Endpoint not found' });
});

app.listen(port, () => {
    console.log(`API running on http://localhost:${port}`);
});
