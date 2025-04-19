const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

// 加载环境变量
dotenv.config();

// 创建 Express 应用
const app = express();

// 中间件
app.use(cors());
app.use(express.json());

// 基本路由
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Grocery Shop API' });
});

// 设置端口
const PORT = process.env.PORT || 5000;

// 启动服务器
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});