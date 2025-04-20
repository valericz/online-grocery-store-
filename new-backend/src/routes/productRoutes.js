const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    checkProductStock
} = require('../controllers/productController');

// 获取所有产品
router.get('/', getProducts);

// 获取单个产品
router.get('/:id', getProductById);

// 检查产品库存
router.get('/:id/stock', checkProductStock);

module.exports = router;