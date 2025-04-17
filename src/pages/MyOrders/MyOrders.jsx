import React, { useContext } from 'react'
import './MyOrders.css'
import { StoreContext } from '../../Context/StoreContext'

const MyOrders = () => {
  const { getOrders, user, isAdmin, updateOrderStatus } = useContext(StoreContext);
  const orders = getOrders();

  const handleStatusChange = (orderId, newStatus) => {
    if (isAdmin) {
      updateOrderStatus(orderId, newStatus);
    }
  };

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
              <div className="order-items">
                {order.items.map((item) => (
                  <div key={item.food_id} className="order-item-detail">
                    <div className="item-left">
                      <img src={item.food_image} alt={item.food_name} />
                      <div>
                        <p className="item-name">{item.food_name}</p>
                      </div>
                    </div>
                    <div className="item-right">
                      <p className="item-quantity">Quantity: {item.quantity}</p>
                      <p className="item-price">Price: ${item.food_price}</p>
                      <p className="item-total">Total: ${(item.food_price * item.quantity).toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="order-footer">
                <div className="order-total">
                  <p>Subtotal: ${(order.totalAmount - 5).toFixed(2)}</p>
                  <p>Delivery Fee: $5.00</p>
                  <p className="total-amount">Total Amount: ${order.totalAmount.toFixed(2)}</p>
                </div>
                <div className="order-delivery">
                  <p className="delivery-title">Delivery Information</p>
                  <p className="delivery-address">
                    {order.deliveryData.street}, {order.deliveryData.city}, {order.deliveryData.state} {order.deliveryData.postcode}
                  </p>
                  <p className="delivery-contact">Contact: {order.deliveryData.phone}</p>
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
