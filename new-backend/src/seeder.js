const dotenv = require('dotenv');
const connectDB = require('./config/db');
const products = require('./data/products');
const Product = require('./models/Product');

// 加载环境变量
dotenv.config();

// 连接数据库
connectDB();

// 导入数据
const importData = async () => {
    try {
        // 清空现有数据
        await Product.deleteMany();

        // 插入新数据
        await Product.insertMany(products);

        console.log('Data Imported Successfully');
        process.exit();
    } catch (error) {
        console.error('Error with data import', error);
        process.exit(1);
    }
};

// 删除所有数据
const destroyData = async () => {
    try {
        // 清空现有数据
        await Product.deleteMany();

        console.log('Data Destroyed Successfully');
        process.exit();
    } catch (error) {
        console.error('Error with data destroy', error);
        process.exit(1);
    }
};

// 根据命令行参数决定导入或删除数据
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}