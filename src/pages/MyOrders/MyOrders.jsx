import React, { useContext, useEffect, useState } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../Context/StoreContext'

const MyOrders = () => {
  const { getOrders, user, isAdmin, updateOrderStatus, getProductImage } = useContext(StoreContext);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const ordersData = await getOrders();
        setOrders(ordersData);
      } catch (error) {
        console.error('Error fetching orders:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    if (isAdmin) {
      const success = await updateOrderStatus(orderId, newStatus);
      if (success) {
        // Refresh orders after status update
        const updatedOrders = await getOrders();
        setOrders(updatedOrders);
      }
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-AU', {
      style: 'currency',
      currency: 'AUD',
      minimumFractionDigits: 2
    }).format(amount);
  };

  if (loading) {
    return <div className="loading">Loading orders...</div>;
  }

  return (
    <div className='my-orders'>
      <h2>{isAdmin ? 'All Orders' : 'My Orders'}</h2>
      <div className="orders-list">
        {orders.length === 0 ? (
          <p className="no-orders">No orders found</p>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="order-item">
              <div className="order-header">
                <div>
                  <p className="order-id">Order #{order.id}</p>
                  <p className="order-date">{new Date(order.date).toLocaleString()}</p>
                </div>
                <div className="order-status-container">
                  <div className={`order-status ${order.status.toLowerCase()}`}>
                    {order.status}
                  </div>
                  {isAdmin && (
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
                  )}
                </div>
              </div>

              {/* Order Items Table */}
              <div className="order-items-table">
                <table>
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Quantity</th>
                      <th>Price</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.items.map((item) => (
                      <tr key={item.productId || item._id}>
                        <td className="item-info">
                          <div className="item-image">
                            <img src={getProductImage(item.image)} alt={item.name} />
                          </div>
                          <div className="item-details">
                            <p className="item-name">{item.name}</p>
                            <p className="item-category">{item.category}</p>
                          </div>
                        </td>
                        <td className="item-quantity" data-label="Quantity">
                          {item.quantity}
                        </td>
                        <td className="item-price" data-label="Price">
                          {formatCurrency(item.price)}
                        </td>
                        <td className="item-subtotal" data-label="Subtotal">
                          {formatCurrency(item.price * item.quantity)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Order Summary */}
              <div className="order-footer">
                <div className="order-total">
                  <div className="order-summary-table">
                    <div className="summary-row">
                      <span>Subtotal:</span>
                      <span>{formatCurrency(order.totalAmount - 5)}</span>
                    </div>
                    <div className="summary-row">
                      <span>Delivery Fee:</span>
                      <span>{formatCurrency(5)}</span>
                    </div>
                    <div className="summary-row total">
                      <span>Total:</span>
                      <span>{formatCurrency(order.totalAmount)}</span>
                    </div>
                  </div>
                </div>
                <div className="order-delivery">
                  <h3 className="delivery-title">Delivery Information</h3>
                  <p className="delivery-name">
                    Recipient: {order.deliveryData.firstName} {order.deliveryData.lastName}
                  </p>
                  <p className="delivery-address">
                    Address: {order.deliveryData.street}, {order.deliveryData.city}, {order.deliveryData.state} {order.deliveryData.postcode}
                  </p>
                  <p className="delivery-contact">Phone: {order.deliveryData.phone}</p>
                  <p className="delivery-email">Email: {order.deliveryData.email}</p>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default MyOrders
