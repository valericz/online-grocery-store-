const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const path = require('path');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 创建Express应用 - 必须在使用app之前定义
const app = express();

// 中间件
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
}));
app.use(express.json());

// 测试路由
app.get('/test', (req, res) => {
    console.log('Test endpoint accessed');
    res.json({ success: true, message: 'API is working' });
});

// 基本路由
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Grocery Shop API' });
});

// 导入产品路由
const productRoutes = require('./routes/productRoutes');

// 添加产品路由，带有日志
app.use('/api/products', (req, res, next) => {
    console.log(`Product API request: ${req.method} ${req.url}`);
    next();
}, productRoutes);

// 通配符路由处理404
app.all('*', (req, res) => {
    console.log(`404 Not Found: ${req.originalUrl}`);
    res.status(404).json({ message: '路由不存在' });
});

// 错误处理中间件
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    console.error(`Error: ${err.message}`);
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 设置端口 - 使用3000避免冲突
const PORT = process.env.PORT || 3000;

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});