const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const productRoutes = require('./routes/productRoutes');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 创建Express应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 路由
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Grocery Shop API' });
});

app.use('/api/products', productRoutes);

// 错误处理中间件
app.use((err, req, res, next) => {
    const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: process.env.NODE_ENV === 'production' ? null : err.stack,
    });
});

// 设置端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});