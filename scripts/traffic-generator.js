const BASE_URL = process.env.API_BASE_URL || 'http://localhost:3000';
const BATCH_SIZE = parseInt(process.env.BATCH_SIZE || '100', 10);
const INTERVAL_HOURS = parseFloat(process.env.INTERVAL_HOURS || '4');

const tokens = [
    'token-user-1-abc',
    'token-user-5-def',
    'token-user-12-ghi',
    'token-user-25-jkl',
    'token-user-40-mno'
];

const userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_3 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Mobile/15E148 Safari/604.1',
    'api-discovery-lab-client/1.0.0'
];

// Helper to pick random item
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];
// Helper to get random ID
const randId = (max) => Math.floor(Math.random() * max) + 1;
// Helper to sleep
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const endpoints = [
    // GETs (~60% weight by duplication)
    ...Array(5).fill({ method: 'GET', path: '/api/v1/users', maxId: null }),
    ...Array(15).fill({ method: 'GET', path: '/api/v1/users/:id', maxId: 50 }),
    ...Array(5).fill({ method: 'GET', path: '/api/v1/products', maxId: null }),
    ...Array(15).fill({ method: 'GET', path: '/api/v1/products/:id', maxId: 30 }),
    ...Array(10).fill({ method: 'GET', path: '/api/v1/products/:id/reviews', maxId: 30 }),
    ...Array(10).fill({ method: 'GET', path: '/api/v1/orders/:id', maxId: 20 }),
    ...Array(5).fill({ method: 'GET', path: '/api/v1/orders/:id/status', maxId: 20 }),
    
    // POSTs (~25% weight)
    ...Array(10).fill({ method: 'POST', path: '/api/v1/users', maxId: null }),
    ...Array(10).fill({ method: 'POST', path: '/api/v1/orders', maxId: null }),
    ...Array(5).fill({ method: 'POST', path: '/api/v1/auth/login', maxId: null }),
    ...Array(5).fill({ method: 'POST', path: '/api/v1/auth/logout', maxId: null }),
    
    // PUT/DELETE (~15% weight)
    ...Array(10).fill({ method: 'PUT', path: '/api/v1/users/:id', maxId: 50 }),
    ...Array(5).fill({ method: 'DELETE', path: '/api/v1/users/:id', maxId: 50 }),
];

async function sendRequest(endpoint) {
    const token = pickRandom(tokens);
    const ua = pickRandom(userAgents);
    
    // Resolve path
    let urlPath = endpoint.path;
    if (urlPath.includes(':id')) {
        urlPath = urlPath.replace(':id', randId(endpoint.maxId));
    }
    
    const url = `${BASE_URL}${urlPath}`;
    const options = {
        method: endpoint.method,
        headers: {
            'Authorization': `Bearer ${token}`,
            'User-Agent': ua,
            'Content-Type': 'application/json'
        }
    };

    // Add dummy body for mutations
    if (['POST', 'PUT'].includes(endpoint.method)) {
        options.body = JSON.stringify({
            dummyData: 'test-value',
            timestamp: new Date().toISOString()
        });
    }

    try {
        const res = await fetch(url, options);
        return { ok: res.ok, status: res.status, url: urlPath };
    } catch (error) {
        return { ok: false, error: error.message, url: urlPath };
    }
}

async function runBatch() {
    console.log(`\n[${new Date().toISOString()}] Starting traffic batch of ${BATCH_SIZE} requests to ${BASE_URL}...`);
    
    let successes = 0;
    let failures = 0;

    for (let i = 0; i < BATCH_SIZE; i++) {
        const endpoint = pickRandom(endpoints);
        const result = await sendRequest(endpoint);
        
        if (result.ok) {
            successes++;
        } else {
            failures++;
            console.error(`Failed: ${endpoint.method} ${result.url} - ${result.error || result.status}`);
        }

        // Small random delay between requests (50-200ms)
        await sleep(Math.floor(Math.random() * 150) + 50);
    }

    console.log(`[${new Date().toISOString()}] Batch complete. Success: ${successes}, Failures: ${failures}`);
}

async function start() {
    console.log('Traffic Generator Started!');
    console.log(`Target: ${BASE_URL}`);
    console.log(`Schedule: ${BATCH_SIZE} requests every ${INTERVAL_HOURS} hours`);
    
    // Wait for API to boot up on first run
    await sleep(5000);
    
    while (true) {
        await runBatch();
        
        const waitMs = INTERVAL_HOURS * 60 * 60 * 1000;
        console.log(`Sleeping for ${INTERVAL_HOURS} hours...`);
        await sleep(waitMs);
    }
}

start().catch(console.error);
