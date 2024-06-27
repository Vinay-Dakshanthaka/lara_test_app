import React, { useState } from 'react';
import { Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { BsEye, BsEyeSlash } from 'react-icons/bs';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { baseURL } from './config'; // Ensure you have a proper baseURL in config
// import './style.css';


const UpdatePassword = () => {
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // Password pattern for validation
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

    const validateForm = () => {
        if (!oldPassword || !newPassword || !confirmPassword) {
            setErrorMessage('All fields are required');
            return false;
        }
        if (newPassword !== confirmPassword) {
            setErrorMessage('New password and confirm password do not match');
            return false;
        }
        if (!passwordPattern.test(newPassword)) {
            setErrorMessage('Password must contain at least 1 uppercase letter, 1 lowercase letter, 1 numeric character, 1 special symbol, and have a minimum length of 6 characters');
            return false;
        }
        setErrorMessage('');
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) {
            return;
        }

        setIsLoading(true);
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setErrorMessage('Authorization token not found');
                setIsLoading(false);
                return;
            }

            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            };
            const response = await axios.post(`${baseURL}/api/auth/student/update-password`, {
                oldPassword,
                newPassword
            }, config);

            if (response.status === 200) {
                setSuccessMessage('Password updated successfully');
                toast.success('Password updated successfully');
                // localStorage.setItem('passwordUpdated', 'true'); // Set the flag in local storage
                localStorage.clear();
                setTimeout(() => {
                    navigate('/signin'); // Navigate to the dashboard or any other authenticated page
                }, 2000);
            }
        } catch (error) {
            if (error.response.status === 400) {
                setErrorMessage('Incorrect Password');
            } else {
                setErrorMessage('Failed to update password. Please try again.');
            }
            console.error('Error updating password:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const toggleOldPasswordVisibility = () => setShowOldPassword(!showOldPassword);
    const toggleNewPasswordVisibility = () => setShowNewPassword(!showNewPassword);
    const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword);

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
            <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '100%', borderRadius: '20px', background: '#ecf0f3', boxShadow: '7px 7px 15px #cbced1, -7px -7px 15px #ffffff' }}>
                <h3 className="card-title text-center" style={{ marginBottom: '20px', color: '#333' }}>Update Password</h3>
                {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
                {successMessage && <Alert variant="success">{successMessage}</Alert>}
                <Form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Old Password</label>
                        <div className="input-group">
                            <input
                                type={showOldPassword ? 'text' : 'password'}
                                className={`form-control`}
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                style={{ borderRadius: '10px' }}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={toggleOldPasswordVisibility}
                                style={{ borderRadius: '10px' }}
                            >
                                {showOldPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>New Password</label>
                        <div className="input-group">
                            <input
                                type={showNewPassword ? 'text' : 'password'}
                                className={`form-control`}
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                style={{ borderRadius: '10px' }}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={toggleNewPasswordVisibility}
                                style={{ borderRadius: '10px' }}
                            >
                                {showNewPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`form-control`}
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                style={{ borderRadius: '10px' }}
                                required
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                style={{ borderRadius: '10px' }}
                            >
                                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                    </div>
                    <Button type="submit" className="btn btn-primary w-100" disabled={isLoading} style={{ borderRadius: '10px', background: '#4CAF50', borderColor: '#4CAF50' }}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Update Password'
                        )}
                    </Button>
                    <div className="container text-center my-2">
                        <button onClick={() => { navigate('/reset-password-email') }} className='link'>Forgot Password?</button>
                    </div>
                </Form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default UpdatePassword;
