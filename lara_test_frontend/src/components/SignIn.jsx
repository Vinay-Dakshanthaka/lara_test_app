import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsEye, BsEyeSlash } from 'react-icons/bs'; // Using react-icons for bootstrap icons
import {  useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import './style.css';

const Signin = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;



    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
        setErrors({
            ...errors,
            [name]: validateField(name, value)
        });
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const validateField = (name, value) => {
        let error;
        switch (name) {
            case 'email':
                // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                error = !emailPattern.test(value) ? 'Please enter a valid email' : '';
                break;
            case 'password':
                error = value.length < 6 ? 'Password must be at least 6 characters long' : '';
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = () => {
        const { email, password } = formData;
        const newErrors = {};

        newErrors.email = validateField('email', email);
        newErrors.password = validateField('password', password);

        return newErrors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const validationErrors = validateForm();
        if (Object.keys(validationErrors).some((key) => validationErrors[key])) {
            setErrors(validationErrors);
            return;
        }
    
        setIsLoading(true);
    
        try {
            const response = await axios.post(`${baseURL}/api/auth/student/verifyByEmail`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });
    
            if (response.status === 200) {
                const { token, role } = response.data;
                localStorage.setItem('token', token);
                localStorage.setItem('role', role);
                localStorage.removeItem('passwordUpdated'); // Remove the flag if it exists
                toast.success('Signin successful!');
                setTimeout(() => {
                    navigate('/dashboard');
                }, 2000);
            } else if (response.status === 400) {
                toast.warning('Password update required.');
                localStorage.setItem('token', response.data.token); // Save token for future use
                setTimeout(() => {
                    navigate('/password-update-warning');
                }, 2000);
            } else {
                toast.error('Signin failed. Please try again.');
            }
        } catch (error) {
            if (error.response) {
                if (error.response.status === 404) {
                    toast.error('User Not Exist!!');
                } else if (error.response.status === 401) {
                    toast.error('Invalid Password!!');
                } else if (error.response.status === 400) {
                    toast.warning('Password update required.');
                    localStorage.setItem('token', error.response.data.token); // Save token for future use
                    setTimeout(() => {
                        navigate('/password-update-warning');
                    }, 2000);
                } else {
                    toast.error('Signin failed. Please try again.');
                }
            } else if (error.request) {
                toast.error('No response from server. Please try again later.');
            } else {
                toast.error('Signin failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };
    
    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
            <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '100%', borderRadius: '20px', background: '#ecf0f3', boxShadow: '7px 7px 15px #cbced1, -7px -7px 15px #ffffff' }}>
                <h3 className="card-title text-center" style={{ marginBottom: '20px', color: '#333' }}>Signin</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Email</label>
                        <input
                            type="email"
                            className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            style={{ borderRadius: '10px' }}
                        />
                        {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-control`}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                style={{ borderRadius: '10px' }}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={togglePasswordVisibility}
                                style={{ borderRadius: '10px' }}
                            >
                                {showPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading} style={{ borderRadius: '10px', background: '#4CAF50', borderColor: '#4CAF50' }}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Signin'
                        )}
                    </button>
                </form>
                <div className="mt-3 text-center">
                    <span style={{ color: '#555' }}>Don&apos;t have an account? </span>
                    <button onClick={()=>{navigate('/signup')}}  className='link'>Sign Up</button>
                </div>
                    <button onClick={() => { navigate('/reset-password-email') }} className='link'>Forgot Password?</button>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signin;
