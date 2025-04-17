import React from 'react';
import './Header.css';
import { useNavigate } from 'react-router-dom';
import { assets } from '../../assets/assets';

const Header = () => {
    const navigate = useNavigate();

    const handleViewMenu = () => {
        navigate('/categories');
    };

    return (
        <div className='header'>
            <div className='header-contents'>
                <h2>
                    <span className="leaf-icon">🥬</span>
                    Shop the Fresh Around You
                </h2>
                <p>
                    Discover the freshest produce, artisan goods, and everyday essentials—sourced locally, delivered conveniently.
                    <br /><br />
                    At Shop the Fresh Around You, we connect you with trusted local grocers, markets, and independent food makers right in your neighborhood. Whether you're craving crisp seasonal fruits, organic veggies, or handcrafted pantry items, we've got you covered—straight from farm to doorstep.
                    <br /><br />
                    Browse by location, shop with confidence, and enjoy the taste of freshness that supports your community. Because fresh isn't just better—it's closer than you think.
                </p>
                <button onClick={handleViewMenu}>
                    <span className="cart-icon">🛒</span>
                    Start Shopping
                </button>
            </div>
            <img src={assets.header_img} alt="Fresh Food Banner" className="header-image" />
        </div>
    );
};

export default Header;