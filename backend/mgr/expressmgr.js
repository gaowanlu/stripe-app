const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());

// ⚠️ 不能在 webhook 路由之前使用 express.json() 否则会破坏 raw body！
app.use((req, res, next) => {
    if (req.originalUrl === '/webhook') {
        next(); // 不处理 webhook 的 body
    } else {
        express.json()(req, res, next); // 其他路由照常处理 json
    }
});

module.exports = app;
