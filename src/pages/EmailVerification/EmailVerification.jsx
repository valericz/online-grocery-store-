import React, { useContext, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { StoreContext } from '../../Context/StoreContext';
import './EmailVerification.css';

const EmailVerification = () => {
    const [verificationCode, setVerificationCode] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const { verifyEmail, resendVerificationCode } = useContext(StoreContext);
    const navigate = useNavigate();
    const location = useLocation();
    const email = location.state?.email;

    const handleVerification = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!email) {
            setError('No email found. Please try signing up again.');
            return;
        }

        const result = await verifyEmail(email, verificationCode);
        if (result.success) {
            setSuccess(result.message);
            setTimeout(() => {
                navigate('/');
            }, 2000);
        } else {
            setError(result.message);
        }
    };

    const handleResendCode = async () => {
        setError('');
        setSuccess('');

        if (!email) {
            setError('No email found. Please try signing up again.');
            return;
        }

        const result = await resendVerificationCode(email);
        if (result.success) {
            setSuccess(result.message);
        } else {
            setError(result.message);
        }
    };

    if (!email) {
        return (
            <div className="email-verification">
                <div className="verification-container">
                    <h2>Email Verification</h2>
                    <p className="error-message">No email found. Please try signing up again.</p>
                    <button onClick={() => navigate('/signup')}>Go to Sign Up</button>
                </div>
            </div>
        );
    }

    return (
        <div className="email-verification">
            <div className="verification-container">
                <h2>Email Verification</h2>
                <p>Please enter the verification code sent to {email}</p>
                <form onSubmit={handleVerification}>
                    <div className="verification-input">
                        <input
                            type="text"
                            value={verificationCode}
                            onChange={(e) => setVerificationCode(e.target.value)}
                            placeholder="Enter verification code"
                            required
                        />
                    </div>
                    {error && <p className="error-message">{error}</p>}
                    {success && <p className="success-message">{success}</p>}
                    <button type="submit">Verify Email</button>
                </form>
                <p className="resend-code">
                    Didn't receive the code?{' '}
                    <span onClick={handleResendCode}>Resend verification code</span>
                </p>
            </div>
        </div>
    );
};

export default EmailVerification; 