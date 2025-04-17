import React, { useContext, useState } from 'react'
import './FoodItem.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext';

const FoodItem = ({ image, name, price, desc, id, in_stock }) => {
    const [itemCount, setItemCount] = useState(0);
    const { cartItems, addToCart, removeFromCart } = useContext(StoreContext);

    return (
        <div className={`food-item ${!in_stock ? 'out-of-stock' : ''}`}>
            <div className='food-item-img-container'>
                <img className='food-item-image' src={image} alt="" />
                {in_stock ? (
                    !cartItems[id] ? (
                        <img className='add' onClick={() => addToCart(id)} src={assets.add_icon_white} alt="" />
                    ) : (
                        <div className="food-item-counter">
                            <img src={assets.remove_icon_red} onClick={() => removeFromCart(id)} alt="" />
                            <p>{cartItems[id]}</p>
                            <img src={assets.add_icon_green} onClick={() => addToCart(id)} alt="" />
                        </div>
                    )
                ) : (
                    <div className="out-of-stock-label">Out of Stock</div>
                )}
            </div>
            <div className="food-item-info">
                <div className="food-item-name-rating">
                    <p>{name}</p>
                    {in_stock && <img src={assets.rating_starts} alt="" />}
                </div>
                <p className="food-item-desc">{desc}</p>
                <p className="food-item-price">${price}</p>
            </div>
        </div>
    )
}

export default FoodItem
