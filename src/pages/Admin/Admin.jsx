import React, { useContext, useState } from 'react';
import { StoreContext } from '../../Context/StoreContext';
import { useNavigate } from 'react-router-dom';
import './Admin.css';

const Admin = () => {
    const { user, isAdmin, getOrders, updateOrderStatus } = useContext(StoreContext);
    const navigate = useNavigate();
    const [selectedStatus, setSelectedStatus] = useState('all');
    const allOrders = getOrders();

    // Redirect if not admin
    React.useEffect(() => {
        if (!user || !isAdmin) {
            navigate('/');
        }
    }, [user, isAdmin, navigate]);

    const filteredOrders = selectedStatus === 'all'
        ? allOrders
        : allOrders.filter(order => order.status.toLowerCase() === selectedStatus);

    const handleStatusChange = (orderId, newStatus) => {
        updateOrderStatus(orderId, newStatus);
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case 'pending':
                return '#ffc107';
            case 'processing':
                return '#17a2b8';
            case 'shipped':
                return '#007bff';
            case 'delivered':
                return '#28a745';
            case 'cancelled':
                return '#dc3545';
            default:
                return '#6c757d';
        }
    };

    return (
        <div className="admin-dashboard">
            <div className="admin-header">
                <h1>Admin Dashboard</h1>
                <div className="status-filter">
                    <label>Filter by status:</label>
                    <select
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value)}
                    >
                        <option value="all">All Orders</option>
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>
            </div>

            <div className="orders-container">
                {filteredOrders.length === 0 ? (
                    <p className="no-orders">No orders found</p>
                ) : (
                    filteredOrders.map((order) => (
                        <div key={order.id} className="order-card">
                            <div className="order-header">
                                <div className="order-info">
                                    <h3>Order #{order.id}</h3>
                                    <p className="order-date">
                                        {new Date(order.date).toLocaleString()}
                                    </p>
                                </div>
                                <div className="order-status">
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: getStatusColor(order.status) }}
                                    >
                                        {order.status}
                                    </span>
                                    <select
                                        value={order.status}
                                        onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                        className="status-select"
                                    >
                                        <option value="pending">Pending</option>
                                        <option value="processing">Processing</option>
                                        <option value="shipped">Shipped</option>
                                        <option value="delivered">Delivered</option>
                                        <option value="cancelled">Cancelled</option>
                                    </select>
                                </div>
                            </div>

                            <div className="order-details">
                                <div className="customer-info">
                                    <h4>Customer Details</h4>
                                    <p>Email: {order.userEmail}</p>
                                    <p>Delivery Address: {order.deliveryData.address}</p>
                                    <p>Phone: {order.deliveryData.phone}</p>
                                </div>

                                <div className="order-items">
                                    <h4>Order Items</h4>
                                    <div className="items-list">
                                        {order.items.map((item, index) => (
                                            <div key={index} className="item">
                                                <span className="item-name">{item.food_name}</span>
                                                <span className="item-quantity">x{item.quantity}</span>
                                                <span className="item-price">${(item.food_price * item.quantity).toFixed(2)}</span>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="order-total">
                                        <span>Total Amount:</span>
                                        <span>${order.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default Admin; 