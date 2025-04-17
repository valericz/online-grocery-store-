import React, { useContext, useEffect, useState } from 'react'
import './PlaceOrder.css'
import { StoreContext } from '../../Context/StoreContext'
import { assets } from '../../assets/assets';
import { useNavigate } from 'react-router-dom';

const PlaceOrder = () => {
    const [data, setData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        street: "",
        city: "",
        state: "",
        postcode: "",
        phone: ""
    });

    const [errors, setErrors] = useState({});
    const { getTotalCartAmount, placeOrder } = useContext(StoreContext);
    const navigate = useNavigate();

    const states = [
        { value: "", label: "Select State" },
        { value: "NSW", label: "NSW" },
        { value: "VIC", label: "VIC" },
        { value: "QLD", label: "QLD" },
        { value: "WA", label: "WA" },
        { value: "SA", label: "SA" },
        { value: "TAS", label: "TAS" },
        { value: "ACT", label: "ACT" },
        { value: "NT", label: "NT" }
    ];

    const validateEmail = (email) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const validatePhone = (phone) => {
        // Accepts formats: 0412345678, 0412 345 678, 0412-345-678, +61412345678
        const re = /^(\+61|0)[2-478](\d{8}|\d{2}\s?\d{3}\s?\d{3}|\d{2}-\d{3}-\d{3})$/;
        return re.test(phone);
    };

    const validatePostcode = (postcode) => {
        // Australian postcodes are 4 digits, from 0200 to 9999
        const re = /^[0-9]{4}$/;
        return re.test(postcode) && parseInt(postcode) >= 200;
    };

    const validateName = (name) => {
        // Names should be at least 2 characters, only letters, spaces, hyphens, and apostrophes
        const re = /^[a-zA-Z\s'-]{2,}$/;
        return re.test(name);
    };

    const validateStreet = (street) => {
        // Street address should be at least 5 characters and contain at least one number
        return street.length >= 5 && /\d/.test(street);
    };

    const validateCity = (city) => {
        // City should be at least 2 characters, only letters, spaces, hyphens, and apostrophes
        const re = /^[a-zA-Z\s'-]{2,}$/;
        return re.test(city);
    };

    const validateForm = () => {
        const newErrors = {};

        if (!validateName(data.firstName)) newErrors.firstName = "Please enter a valid first name";
        if (!validateName(data.lastName)) newErrors.lastName = "Please enter a valid last name";
        if (!validateEmail(data.email)) newErrors.email = "Please enter a valid email address";
        if (!validateStreet(data.street)) newErrors.street = "Please enter a valid street address";
        if (!validateCity(data.city)) newErrors.city = "Please enter a valid city";
        if (!data.state) newErrors.state = "Please select a state";
        if (!validatePostcode(data.postcode)) newErrors.postcode = "Please enter a valid Australian postcode";
        if (!validatePhone(data.phone)) newErrors.phone = "Please enter a valid Australian phone number";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const onChangeHandler = (event) => {
        const name = event.target.name;
        const value = event.target.value;
        setData(data => ({ ...data, [name]: value }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(errors => ({ ...errors, [name]: "" }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            placeOrder(data);
            navigate('/order-confirmation');
        }
    };

    useEffect(() => {
        if (getTotalCartAmount() === 0) {
            navigate('/');
        }
    }, []);

    return (
        <div className='place-order'>
            <div className="place-order-left">
                <p className='title'>Delivery Information</p>
                <form onSubmit={handleSubmit}>
                    <div className="multi-field">
                        <div className="field">
                            <input
                                type="text"
                                name='firstName'
                                onChange={onChangeHandler}
                                value={data.firstName}
                                placeholder='First name'
                                className={errors.firstName ? 'error' : ''}
                            />
                            {errors.firstName && <span className="error-message">{errors.firstName}</span>}
                        </div>
                        <div className="field">
                            <input
                                type="text"
                                name='lastName'
                                onChange={onChangeHandler}
                                value={data.lastName}
                                placeholder='Last name'
                                className={errors.lastName ? 'error' : ''}
                            />
                            {errors.lastName && <span className="error-message">{errors.lastName}</span>}
                        </div>
                    </div>
                    <div className="field">
                        <input
                            type="email"
                            name='email'
                            onChange={onChangeHandler}
                            value={data.email}
                            placeholder='Email address'
                            className={errors.email ? 'error' : ''}
                        />
                        {errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="field">
                        <input
                            type="text"
                            name='street'
                            onChange={onChangeHandler}
                            value={data.street}
                            placeholder='Street address'
                            className={errors.street ? 'error' : ''}
                        />
                        {errors.street && <span className="error-message">{errors.street}</span>}
                    </div>
                    <div className="multi-field">
                        <div className="field">
                            <input
                                type="text"
                                name='city'
                                onChange={onChangeHandler}
                                value={data.city}
                                placeholder='City'
                                className={errors.city ? 'error' : ''}
                            />
                            {errors.city && <span className="error-message">{errors.city}</span>}
                        </div>
                        <div className="field">
                            <select
                                name='state'
                                onChange={onChangeHandler}
                                value={data.state}
                                className={errors.state ? 'error' : ''}
                            >
                                {states.map((state) => (
                                    <option key={state.value} value={state.value}>
                                        {state.label}
                                    </option>
                                ))}
                            </select>
                            {errors.state && <span className="error-message">{errors.state}</span>}
                        </div>
                    </div>
                    <div className="multi-field">
                        <div className="field">
                            <input
                                type="text"
                                name='postcode'
                                onChange={onChangeHandler}
                                value={data.postcode}
                                placeholder='Postcode'
                                className={errors.postcode ? 'error' : ''}
                            />
                            {errors.postcode && <span className="error-message">{errors.postcode}</span>}
                        </div>
                        <div className="field">
                            <input
                                type="text"
                                name='phone'
                                onChange={onChangeHandler}
                                value={data.phone}
                                placeholder='Phone (e.g., 0412345678)'
                                className={errors.phone ? 'error' : ''}
                            />
                            {errors.phone && <span className="error-message">{errors.phone}</span>}
                        </div>
                    </div>
                </form>
            </div>
            <div className="place-order-right">
                <div className="cart-total">
                    <h2>Cart Totals</h2>
                    <div>
                        <div className="cart-total-details"><p>Subtotal</p><p>${(Math.round(getTotalCartAmount() * 100) / 100).toFixed(2)}</p></div>
                        <hr />
                        <div className="cart-total-details"><p>Delivery Fee</p><p>${getTotalCartAmount() === 0 ? '0.00' : '5.00'}</p></div>
                        <hr />
                        <div className="cart-total-details"><b>Total</b><b>${(Math.round((getTotalCartAmount() === 0 ? 0 : getTotalCartAmount() + 5) * 100) / 100).toFixed(2)}</b></div>
                    </div>
                </div>
                <div className="payment-options">
                    <h2>Select Payment Method</h2>
                    <div className="payment-option">
                        <img src={assets.selector_icon} alt="" />
                        <p>COD ( Cash On Delivery )</p>
                    </div>
                    <button onClick={handleSubmit}>PLACE ORDER</button>
                </div>
            </div>
        </div>
    )
}

export default PlaceOrder
