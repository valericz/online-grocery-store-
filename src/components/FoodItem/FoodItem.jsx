import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id, in_stock }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    // Default in_stock to true if undefined
    const isInStock = in_stock !== undefined ? in_stock : true;

    // Safely access cart items
    const quantity = cartItems && cartItems[id] ? cartItems[id] : 0;

    return (
        <div className={`food-item ${!isInStock ? 'out-of-stock' : ''}`}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={image} alt="" />
                {isInStock ? (
                    !quantity ? (
                        <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                    ) : (
                        <div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
                            <p>{quantity}</p>
                            <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
                        </div>
                    )
                ) : (
                    <>
                        <div className="out-of-stock-overlay"></div>
                        <div className="out-of-stock-label">Out of Stock</div>
                    </>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    {isInStock ? (
                        <img src={assets.rating_starts} alt="" />
                    ) : (
                        <span className="out-of-stock-badge">SOLD OUT</span>
                    )}
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    )
}

export default FoodItem
