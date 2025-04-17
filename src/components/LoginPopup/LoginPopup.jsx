import React, { useContext, useState } from 'react'
import './LoginPopup.css'
import { assets } from '../../assets/assets'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const LoginPopup = ({ setShowLogin }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const { login } = useContext(StoreContext);
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        const result = login(email, password);
        if (result.success) {
            setShowLogin(false);
            navigate('/');
        } else {
            setError(result.message || "Invalid email or password");
        }
    };

    return (
        <div className='login-popup'>
            <form onSubmit={handleSubmit} className="login-popup-container">
                <div className="login-popup-title">
                    <h2>Sign In</h2>
                    <img onClick={() => setShowLogin(false)} src={assets.cross_icon} alt="" />
                </div>
                <div className="login-popup-inputs">
                    <div className="login-popup-input">
                        <p>Email</p>
                        <input
                            type="email"
                            placeholder='Enter your email address'
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="login-popup-input">
                        <p>Password</p>
                        <input
                            type="password"
                            placeholder='Enter your password'
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                </div>
                {error && <p className="error-message">{error}</p>}
                <button type="submit">Sign In</button>
                <p className="login-popup-note">
                    Admin login: admin@admin.com / admin123
                </p>
                <p className="login-popup-signup">
                    New with us? <span onClick={() => { setShowLogin(false); navigate('/signup'); }}>Sign Up NOW</span>
                </p>
                <div className="login-popup-condition">
                    <input type="checkbox" required />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>
            </form>
        </div>
    )
}

export default LoginPopup
