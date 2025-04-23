const Order = require('../models/Order');
const Product = require('../models/Product');

// @desc    创建新订单
// @route   POST /api/orders
// @access  Public
const createOrder = async (req, res) => {
    try {
        const { user, items, deliveryData, totalAmount } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: '没有订单项' });
        }

        // 验证库存
        for (const item of items) {
            const product = await Product.findById(item.productId);

            if (!product) {
                return res.status(404).json({
                    message: `产品 ${item.name} 不存在`
                });
            }

            if (!product.isInStock || product.countInStock < item.quantity) {
                return res.status(400).json({
                    message: `产品 ${item.name} 库存不足。可用: ${product.countInStock}，请求: ${item.quantity}`
                });
            }

            // 更新库存
            product.countInStock -= item.quantity;
            if (product.countInStock <= 0) {
                product.isInStock = false;
            }
            await product.save();
        }

        const order = new Order({
            user,
            items,
            deliveryData,
            totalAmount
        });

        const createdOrder = await order.save();
        res.status(201).json(createdOrder);
    } catch (error) {
        console.error('创建订单错误:', error);
        res.status(500).json({ message: '创建订单失败', error: error.message });
    }
};

// @desc    获取所有订单
// @route   GET /api/orders
// @access  Public
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).sort({ createdAt: -1 });

        // 转换格式以匹配前端期望的格式
        const formattedOrders = orders.map(order => ({
            id: order._id,
            user: order.user,
            items: order.items.map(item => ({
                id: item._id,
                productId: item.productId,
                name: item.name,
                quantity: item.quantity,
                image: item.image,
                price: item.price
            })),
            deliveryData: order.deliveryData,
            totalAmount: order.totalAmount,
            status: order.status,
            date: order.createdAt
        }));

        res.json(formattedOrders);
    } catch (error) {
        console.error('获取订单错误:', error);
        res.status(500).json({ message: '获取订单失败', error: error.message });
    }
};

// @desc    更新订单状态
// @route   PUT /api/orders/:id/status
// @access  Public
const updateOrderStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ message: '状态不能为空' });
        }

        const order = await Order.findById(id);

        if (!order) {
            return res.status(404).json({ message: '订单未找到' });
        }

        order.status = status;
        const updatedOrder = await order.save();

        res.json({
            id: updatedOrder._id,
            status: updatedOrder.status
        });
    } catch (error) {
        console.error('更新订单状态错误:', error);
        res.status(500).json({ message: '更新订单状态失败', error: error.message });
    }
};

module.exports = {
    createOrder,
    getOrders,
    updateOrderStatus
}; 