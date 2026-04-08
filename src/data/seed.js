// In-memory data
const users = Array.from({ length: 50 }).map((_, i) => ({
    id: i + 1,
    name: `User ${i + 1}`,
    email: `user${i + 1}@example.com`,
    role: i < 5 ? 'admin' : 'user',
    created_at: new Date(Date.now() - Math.random() * 10000000000).toISOString()
}));

const products = Array.from({ length: 30 }).map((_, i) => ({
    id: i + 1,
    name: `Product ${i + 1}`,
    price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
    category: ['Electronics', 'Books', 'Clothing', 'Home'][Math.floor(Math.random() * 4)],
    stock: Math.floor(Math.random() * 100)
}));

const reviews = Array.from({ length: 60 }).map((_, i) => ({
    id: i + 1,
    productId: Math.floor(Math.random() * 30) + 1,
    author: `User ${Math.floor(Math.random() * 50) + 1}`,
    rating: Math.floor(Math.random() * 5) + 1,
    comment: 'Great product!'
}));

const orders = Array.from({ length: 20 }).map((_, i) => ({
    id: i + 1,
    userId: Math.floor(Math.random() * 50) + 1,
    products: [
        { productId: Math.floor(Math.random() * 30) + 1, quantity: 1 },
        { productId: Math.floor(Math.random() * 30) + 1, quantity: 2 }
    ],
    total: parseFloat((Math.random() * 200 + 20).toFixed(2)),
    status: ['pending', 'shipped', 'delivered'][Math.floor(Math.random() * 3)]
}));

const tokens = {
    'token-user-1-abc': 1,
    'token-user-5-def': 5,
    'token-user-12-ghi': 12,
    'token-user-25-jkl': 25,
    'token-user-40-mno': 40
};

module.exports = {
    users,
    products,
    reviews,
    orders,
    tokens
};
