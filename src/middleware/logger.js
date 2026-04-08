const logger = (req, res, next) => {
    const start = Date.now();
    
    // Once the response is sent, log the details
    res.on('finish', () => {
        const duration = Date.now() - start;
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl} ${res.statusCode} - ${duration}ms`);
    });

    next();
};

module.exports = logger;
