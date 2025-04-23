const express = require('express');
const router = express.Router();
const {
    createOrder,
    getOrders,
    updateOrderStatus
} = require('../controllers/orderController');

// 获取所有订单
router.get('/', getOrders);

// 创建新订单
router.post('/', createOrder);

// 更新订单状态
router.put('/:id/status', updateOrderStatus);

module.exports = router; 