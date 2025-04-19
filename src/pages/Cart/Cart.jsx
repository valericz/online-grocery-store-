import React, { useContext, useState, useRef } from 'react'
import './Cart.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const MAX_QUANTITY = 10;
  const { cartItems, food_list, removeFromCart, getTotalCartAmount, addToCart, clearCart } = useContext(StoreContext);
  const navigate = useNavigate();
  const [quantityErrors, setQuantityErrors] = useState({});
  const [inputValues, setInputValues] = useState({});
  const [removeConfirmations, setRemoveConfirmations] = useState({});
  const [clearCartConfirmation, setClearCartConfirmation] = useState(false);
  const confirmationTimers = useRef({});
  const clearCartTimer = useRef(null);

  const removeItemCompletely = (itemId) => {
    // Remove the item completely by calling removeFromCart for each quantity
    const quantity = cartItems[itemId];
    for (let i = 0; i < quantity; i++) {
      removeFromCart(itemId);
    }
    // Clear input value and confirmation state when item is removed
    setInputValues(prev => ({ ...prev, [itemId]: 0 }));
    setRemoveConfirmations(prev => ({ ...prev, [itemId]: false }));
  };

  const validateAndAdjustQuantity = (quantity) => {
    if (isNaN(quantity) || quantity === '') return null;
    const numQuantity = parseInt(quantity);
    if (numQuantity < 1) return 1;
    if (numQuantity > MAX_QUANTITY) return MAX_QUANTITY;
    return numQuantity;
  };

  const updateCartQuantity = (itemId, targetQuantity) => {
    const currentQuantity = cartItems[itemId] || 0;
    if (targetQuantity > currentQuantity) {
      // Add the difference
      for (let i = currentQuantity; i < targetQuantity; i++) {
        addToCart(itemId);
      }
    } else if (targetQuantity < currentQuantity) {
      // Remove the difference
      for (let i = currentQuantity; i > targetQuantity; i--) {
        removeFromCart(itemId);
      }
    }
  };

  const handleQuantityChange = (itemId, newValue) => {
    // Clear any removal confirmation when quantity is changed
    if (removeConfirmations[itemId]) {
      setRemoveConfirmations(prev => ({ ...prev, [itemId]: false }));
    }

    // Update the input value immediately for responsive UI
    setInputValues(prev => ({ ...prev, [itemId]: newValue }));

    // Clear error if input is empty (user is still typing)
    if (newValue === '') {
      setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
      return;
    }

    const quantity = parseInt(newValue);

    // Show error only if the number is invalid
    if (isNaN(quantity)) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Please enter a valid number`
      }));
      return;
    }

    if (quantity > MAX_QUANTITY) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Maximum quantity is ${MAX_QUANTITY}`
      }));
      // Immediately adjust the quantity to MAX_QUANTITY
      const adjustedQuantity = MAX_QUANTITY;
      setInputValues(prev => ({ ...prev, [itemId]: adjustedQuantity }));
      updateCartQuantity(itemId, adjustedQuantity);
      return;
    }

    if (quantity < 1) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Minimum quantity is 1`
      }));
      // Immediately adjust the quantity to 1
      setInputValues(prev => ({ ...prev, [itemId]: 1 }));
      updateCartQuantity(itemId, 1);
      return;
    }

    // Clear error if number is valid
    setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
    // Update cart with validated quantity
    updateCartQuantity(itemId, quantity);
  };

  const handleInputBlur = (itemId) => {
    const currentValue = inputValues[itemId];
    const adjustedQuantity = validateAndAdjustQuantity(currentValue);

    if (adjustedQuantity !== null) {
      // Update input and cart to adjusted quantity
      setInputValues(prev => ({ ...prev, [itemId]: adjustedQuantity }));
      updateCartQuantity(itemId, adjustedQuantity);
    } else {
      // Reset to current cart quantity if invalid
      setInputValues(prev => ({ ...prev, [itemId]: cartItems[itemId] }));
    }
    setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
  };

  const handleKeyDown = (e, itemId) => {
    if (e.key === 'Enter') {
      e.preventDefault(); // Prevent form submission if within a form
      e.target.blur(); // Remove focus from input
      handleInputBlur(itemId);
    }
  };

  const handleAddToCart = (itemId) => {
    // Clear any removal confirmation when adding items
    if (removeConfirmations[itemId]) {
      setRemoveConfirmations(prev => ({ ...prev, [itemId]: false }));
    }

    const currentQuantity = cartItems[itemId] || 0;
    if (currentQuantity >= MAX_QUANTITY) {
      setQuantityErrors(prev => ({
        ...prev,
        [itemId]: `Maximum quantity is ${MAX_QUANTITY}`
      }));
      setTimeout(() => {
        setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
      }, 2000);
      return;
    }
    addToCart(itemId);
    setInputValues(prev => ({ ...prev, [itemId]: currentQuantity + 1 }));
  };

  const handleRemoveFromCart = (itemId) => {
    const currentQuantity = cartItems[itemId];

    if (currentQuantity === 1) {
      // If this is the first confirmation
      if (!removeConfirmations[itemId]) {
        setQuantityErrors(prev => ({
          ...prev,
          [itemId]: "Are you sure you want to remove this item completely?"
        }));
        setRemoveConfirmations(prev => ({ ...prev, [itemId]: true }));

        // Clear the confirmation after 3 seconds
        if (confirmationTimers.current[itemId]) {
          clearTimeout(confirmationTimers.current[itemId]);
        }
        confirmationTimers.current[itemId] = setTimeout(() => {
          setRemoveConfirmations(prev => ({ ...prev, [itemId]: false }));
          setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
        }, 3000);

        return;
      } else {
        // Second confirmation, remove the item
        removeItemCompletely(itemId);
        return;
      }
    }

    // Normal quantity reduction
    if (currentQuantity > 0) {
      removeFromCart(itemId);
      setInputValues(prev => ({ ...prev, [itemId]: currentQuantity - 1 }));
      // Clear any existing confirmation state
      if (removeConfirmations[itemId]) {
        setRemoveConfirmations(prev => ({ ...prev, [itemId]: false }));
        setQuantityErrors(prev => ({ ...prev, [itemId]: null }));
      }
    }
  };

  const handleClearCart = () => {
    clearCart();
    setClearCartConfirmation(false);
    if (clearCartTimer.current) {
      clearTimeout(clearCartTimer.current);
    }
  };

  return (
    <div className='cart'>
      <div className="cart-items">
        <div className="cart-header">
          <h2>Shopping Cart</h2>
        </div>
        <div className="clear-button-container">
          <button
            className={Object.keys(cartItems).length === 0 ? "disabled" : ""}
            disabled={Object.keys(cartItems).length === 0}
            onClick={handleClearCart}
          >
            CLEAR
          </button>
        </div>
        <div className="cart-items-title">
          <p>Items</p> <p>Title</p> <p>Price</p> <p>Quantity</p> <p>Total</p> <p>Remove</p>
        </div>
        <br />
        <hr />
        {food_list.map((item, index) => {
          if (cartItems[item.food_id] > 0) {
            return (<div key={index}>
              <div className="cart-items-title cart-items-item">
                <img src={item.food_image} alt="" />
                <p>{item.food_name}</p>
                <p>${item.food_price.toFixed(2)}</p>
                <div className="cart-quantity-controls">
                  <button onClick={() => handleRemoveFromCart(item.food_id)}>-</button>
                  <div className="cart-quantity-input-container">
                    <input
                      type="number"
                      value={inputValues[item.food_id] ?? cartItems[item.food_id]}
                      onChange={(e) => handleQuantityChange(item.food_id, e.target.value)}
                      onBlur={() => handleInputBlur(item.food_id)}
                      onKeyDown={(e) => handleKeyDown(e, item.food_id)}
                      min="1"
                      max={MAX_QUANTITY}
                    />
                    {quantityErrors[item.food_id] &&
                      <div className="quantity-error">{quantityErrors[item.food_id]}</div>
                    }
                  </div>
                  <button
                    onClick={() => handleAddToCart(item.food_id)}
                    disabled={cartItems[item.food_id] >= MAX_QUANTITY}
                  >+</button>
                </div>
                <p>${(item.food_price * cartItems[item.food_id]).toFixed(2)}</p>
                <p className='cart-items-remove-icon' onClick={() => removeItemCompletely(item.food_id)}>x</p>
              </div>
              <hr />
            </div>)
          }
          return null;
        })}
      </div>
      <div className="cart-bottom">
        <div className="cart-total">
          <h2>Cart Totals</h2>
          <div>
            <div className="cart-total-details"><p>Subtotal</p><p>${(Math.round(getTotalCartAmount() * 100) / 100).toFixed(2)}</p></div>
            <hr />
            <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? '0.00' : '5.00'}</p></div>
            <hr />
            <div className="cart-total-details"><b>Total</b><b>${(Math.round((getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5) * 100) / 100).toFixed(2)}</b></div>
          </div>
          <button
            className={getTotalCartAmount() === 0 ? "disabled" : ""}
            disabled={getTotalCartAmount() === 0}
            onClick={() => navigate('/order')}
          >
            PROCEED TO CHECKOUT
          </button>
        </div>
        <div className="cart-promocode">
          <div>
            <p>If you have a promo code, Enter it here</p>
            <div className='cart-promocode-input'>
              <input type="text" placeholder='promo code' />
              <button>Submit</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
