const Product = require('../models/Product');

// @desc    获取所有产品
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
    try {
        // 检查是否有category查询参数
        const categoryFilter = req.query.category ? { category: req.query.category } : {};

        const products = await Product.find(categoryFilter);
        res.json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    获取单个产品
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ message: '产品未找到' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    获取所有产品类别
// @route   GET /api/products/categories
// @access  Public
const getProductCategories = async (req, res) => {
    try {
        // 使用distinct获取所有唯一的类别
        const categories = await Product.distinct('category');
        res.json(categories);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};

// @desc    检查产品库存
// @route   GET /api/products/:id/stock
// @access  Public
const checkProductStock = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (product) {
            res.json({
                id: product._id,
                name: product.name,
                countInStock: product.countInStock,
                isInStock: product.isInStock
            });
        } else {
            res.status(404).json({ message: '产品未找到' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: '服务器错误' });
    }
};

module.exports = {
    getProducts,
    getProductById,
    getProductCategories,
    checkProductStock
};