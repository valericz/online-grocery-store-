import React, { useContext, useState } from 'react'
import './SignUp.css'
import { StoreContext } from '../../Context/StoreContext'
import { useNavigate } from 'react-router-dom'

const SignUp = () => {
    const [data, setData] = useState({
        email: "",
        phone: "",
        password: "",
        confirmPassword: ""
    });
    const [errors, setErrors] = useState({});
    const [success, setSuccess] = useState('');
    const { registerUser } = useContext(StoreContext);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        const re = /^(\+61|0)[2-478]\d{8}$|^1234567890$/;
        return re.test(phone);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateEmail(data.email)) {
            newErrors.email = "Please enter a valid email address";
        }
        if (!validatePhone(data.phone)) {
            newErrors.phone = "Please enter a valid Australian phone number";
        }
        if (!validatePassword(data.password)) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (data.password !== data.confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(prev => ({ ...prev, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSuccess('');
        if (validateForm()) {
            const result = await registerUser(data.email, data.phone, data.password);
            if (result.success) {
                if (result.requiresVerification) {
                    navigate('/verify-email', { state: { email: data.email } });
                } else {
                    navigate('/');
                }
            } else {
                setErrors({ email: result.message });
            }
        }
    };

    return (
        <div className='signup'>
            <div className="signup-container">
                <h2>Create Account</h2>
                <form onSubmit={handleSubmit}>
                    <div className="signup-input">
                        <p>Email</p>
                        <input
                            type="email"
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            placeholder='Enter your email address'
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="signup-input">
                        <p>Phone</p>
                        <input
                            type="tel"
                            name='phone'
                            onChange={onChangeHandler}
                            value={data.phone}
                            placeholder='Enter your phone number (e.g., 0412345678)'
                            className={errors.phone ? 'error' : ''}
                        />
                        {errors.phone && <span className="error-message">{errors.phone}</span>}
                    </div>
                    <div className="signup-input">
                        <p>Password</p>
                        <input
                            type="password"
                            name='password'
                            onChange={onChangeHandler}
                            value={data.password}
                            placeholder='Enter your password'
                            className={errors.password ? 'error' : ''}
                        />
                        {errors.password && <span className="error-message">{errors.password}</span>}
                    </div>
                    <div className="signup-input">
                        <p>Confirm Password</p>
                        <input
                            type="password"
                            name='confirmPassword'
                            onChange={onChangeHandler}
                            value={data.confirmPassword}
                            placeholder='Confirm your password'
                            className={errors.confirmPassword ? 'error' : ''}
                        />
                        {errors.confirmPassword && <span className="error-message">{errors.confirmPassword}</span>}
                    </div>
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit">Sign Up</button>
                    <p className="signup-login-link">
                        Already have an account? <span onClick={() => navigate('/')}>Sign In</span>
                    </p>
                </form>
            </div>
        </div>
    )
}

export default SignUp 