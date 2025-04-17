import React, { useContext, useState, useRef, useEffect } from 'react'
import './Navbar.css'
import { assets } from '../../assets/assets'
import { Link, useNavigate } from 'react-router-dom'
import { StoreContext } from '../../Context/StoreContext'

const Navbar = ({ setShowLogin }) => {
  const [menu, setMenu] = useState("home");
  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const { getTotalCartAmount, user, logout, isAdmin } = useContext(StoreContext);
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setSearchQuery("");
    }
  };

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const getUserInitial = () => {
    if (!user) return '';
    if (isAdmin) return 'A';
    return user.email.charAt(0).toUpperCase();
  };

  return (
    <div className='navbar'>
      <Link to='/'><img className='logo' src={assets.logo} alt="" /></Link>
      <ul className="navbar-menu">
        <Link to="/" onClick={() => setMenu("home")} className={`${menu === "home" ? "active" : ""}`}>Home</Link>
        <Link to="/categories" onClick={() => setMenu("categories")} className={`${menu === "categories" ? "active" : ""}`}>Categories</Link>
        <Link to="/myorder" onClick={() => setMenu("orders")} className={`${menu === "orders" ? "active" : ""}`}>My Orders</Link>
        <Link to="/contact" onClick={() => setMenu("contact")} className={`${menu === "contact" ? "active" : ""}`}>Contact Us</Link>
      </ul>
      <div className="navbar-right">
        <form onSubmit={handleSearch} className="search-box">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit">
            <img src={assets.search_icon} alt="Search" />
          </button>
        </form>
        <Link to='/cart' className='navbar-cart-icon'>
          <img src={assets.basket_icon} alt="" />
          <div className={getTotalCartAmount() > 0 ? "dot" : ""}></div>
        </Link>
        {user ? (
          <div className="user-menu" ref={dropdownRef}>
            <div
              className="user-profile"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <span>{getUserInitial()}</span>
            </div>
            {showDropdown && (
              <div className="dropdown-menu">
                <div className="dropdown-header">
                  <span className="user-email">{user.email}</span>
                  {isAdmin && <span className="admin-badge">Admin</span>}
                </div>
                <div className="dropdown-divider"></div>
                <Link to="/profile" onClick={() => setShowDropdown(false)}>Profile</Link>
                <Link to="/myorder" onClick={() => setShowDropdown(false)}>My Orders</Link>
                {isAdmin && (
                  <Link to="/admin" onClick={() => setShowDropdown(false)}>Admin Dashboard</Link>
                )}
                <button onClick={handleLogout}>Sign Out</button>
              </div>
            )}
          </div>
        ) : (
          <button onClick={() => setShowLogin(true)}>Sign In</button>
        )}
      </div>
    </div>
  )
}

export default Navbar
