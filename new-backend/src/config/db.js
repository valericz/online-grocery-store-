const mongoose = require('mongoose');

// 连接到MongoDB数据库
const connectDB = async () => {
    try {
        // 添加默认连接字符串
        const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/grocery-shop-db';
        console.log(`Connecting to MongoDB at: ${mongoUri}`);
        const conn = await mongoose.connect(mongoUri);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

module.exports = connectDB;