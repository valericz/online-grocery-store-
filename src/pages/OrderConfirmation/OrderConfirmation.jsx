import React from 'react';
import './OrderConfirmation.css';
import { useNavigate } from 'react-router-dom';

const OrderConfirmation = () => {
    const navigate = useNavigate();

    return (
        <div className="order-confirmation">
            <div className="confirmation-container">
                <div className="confirmation-icon">✓</div>
                <h1>Order Placed Successfully!</h1>
                <p>Thank you for your order. A confirmation email has been sent to your email address.</p>
                <div className="confirmation-actions">
                    <button
                        className="view-orders-btn"
                        onClick={() => navigate('/myorder')}
                    >
                        View My Orders
                    </button>
                    <button
                        className="continue-shopping-btn"
                        onClick={() => navigate('/')}
                    >
                        Continue Shopping
                    </button>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmation; 