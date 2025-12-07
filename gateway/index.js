const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();

// Proxy /api requests to the API app
app.use('/api', createProxyMiddleware({
    target: 'http://localhost:4001',
    changeOrigin: true,
}));

// Proxy all other requests to the frontend app
app.use('/', createProxyMiddleware({
    target: 'http://localhost:4002',
    changeOrigin: true,
}));

app.listen(3000, () => {
    console.log(`Gateway listening on http://localhost:3000`);
});
