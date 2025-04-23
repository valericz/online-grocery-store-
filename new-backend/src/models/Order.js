const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    user: {
        email: {
            type: String,
            required: true
        },
        name: {
            type: String,
            required: true
        }
    },
    items: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Product'
        },
        name: {
            type: String,
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
        image: {
            type: String,
            required: true
        },
        price: {
            type: Number,
            required: true
        }
    }],
    deliveryData: {
        firstName: {
            type: String,
            required: true
        },
        lastName: {
            type: String,
            required: true
        },
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        postcode: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        }
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0
    },
    status: {
        type: String,
        required: true,
        default: 'Pending'
    },
    date: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order; 