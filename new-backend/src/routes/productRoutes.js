const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    checkProductStock
} = require('../controllers/productController');

// 获取所有产品
router.get('/', getProducts);

// 检查产品库存 - 注意这个路由要放在 /:id 之前
router.get('/:id/stock', checkProductStock);

// 获取单个产品
router.get('/:id', getProductById);

module.exports = router;