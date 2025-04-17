import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './Login.css';

const Login = () => {
    const navigate = useNavigate();
    const { login } = useContext(StoreContext);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const validatePassword = (password) => {
        const requirements = {
            minLength: password.length >= 8,
            hasUpperCase: /[A-Z]/.test(password),
            hasLowerCase: /[a-z]/.test(password),
            hasNumber: /\d/.test(password),
            hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password)
        };

        const failed = [];
        if (!requirements.minLength) failed.push('at least 8 characters');
        if (!requirements.hasUpperCase) failed.push('an uppercase letter');
        if (!requirements.hasLowerCase) failed.push('a lowercase letter');
        if (!requirements.hasNumber) failed.push('a number');
        if (!requirements.hasSpecialChar) failed.push('a special character');

        return {
            isValid: Object.values(requirements).every(Boolean),
            requirements,
            failed
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password) {
            setError('Please fill in both email and password');
            return;
        }

        // Password format validation
        const passwordValidation = validatePassword(password);
        if (!passwordValidation.isValid) {
            setError(`Password must contain ${passwordValidation.failed.join(', ')}`);
            return;
        }

        setError('');
        setIsLoading(true);

        try {
            // Simulate network delay for better UX
            await new Promise(resolve => setTimeout(resolve, 500));

            const result = login(email, password);
            console.log('Login result:', result);

            if (result.success) {
                navigate('/');
            } else {
                setError(result.message || 'Invalid email or password');
                setPassword(''); // Clear password on failed attempt
            }
        } catch (err) {
            console.error('Login error:', err);
            setError('An error occurred. Please try again.');
            setPassword(''); // Clear password on error
        } finally {
            setIsLoading(false);
        }
    };

    const getPasswordStrength = () => {
        if (!password) return null;

        const validation = validatePassword(password);
        const passedCount = Object.values(validation.requirements).filter(Boolean).length;

        if (passedCount <= 1) return { strength: 'weak', color: '#ff4444' };
        if (passedCount <= 3) return { strength: 'medium', color: '#ffbb33' };
        if (passedCount <= 4) return { strength: 'strong', color: '#00C851' };
        return { strength: 'very strong', color: '#007E33' };
    };

    const passwordStrength = getPasswordStrength();

    return (
        <div className="login-container">
            <form onSubmit={handleSubmit} className="login-form">
                <h2>Sign In</h2>
                {error && (
                    <div className="error-message" role="alert">
                        {error}
                    </div>
                )}
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                            setError('');
                        }}
                        disabled={isLoading}
                        required
                        autoComplete="email"
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => {
                            setPassword(e.target.value);
                            setError('');
                        }}
                        disabled={isLoading}
                        required
                        autoComplete="current-password"
                    />
                    {password && (
                        <div className="password-strength" style={{ color: passwordStrength?.color }}>
                            Password strength: {passwordStrength?.strength}
                        </div>
                    )}
                    <div className="password-requirements">
                        Password must contain:
                        <ul>
                            <li>At least 8 characters</li>
                            <li>At least one uppercase letter</li>
                            <li>At least one lowercase letter</li>
                            <li>At least one number</li>
                            <li>At least one special character (!@#$%^&*(),.?&quot;:{ }|{'<'}&gt;)</li>
                        </ul>
                    </div>
                </div>
                <button
                    type="submit"
                    className={`login-button ${isLoading ? 'loading' : ''}`}
                    disabled={isLoading || !email || !password}
                >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                </button>
                <button
                    type="button"
                    onClick={() => navigate('/signup')}
                    className="signup-link"
                    disabled={isLoading}
                >
                    Don't have an account? Sign Up
                </button>
            </form>
        </div>
    );
};

export default Login; 