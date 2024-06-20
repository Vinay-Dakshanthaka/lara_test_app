import { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { BsEye, BsEyeSlash } from 'react-icons/bs'; // Using react-icons for bootstrap icons
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../config';
import './style.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: ''
    });

    const navigate = useNavigate();
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10}$/
    const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/

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

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword(!showConfirmPassword);
    };

    const validateField = (name, value) => {
        let error;
        switch (name) {
            case 'name':
                error = value.length < 3 ? 'Name must contain at least 3 characters' : '';
                break;
            case 'email':
                // const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                error = !emailPattern.test(value) ? 'Please enter a valid email' : '';
                break;
            case 'phone':
                // const phonePattern = /^\d{10}$/;
                error = !phonePattern.test(value) ? 'Phone number must be 10 digits' : '';
                break;
            case 'password':
                // const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
                error = !passwordPattern.test(value)
                    ? 'Password must contain at least 1 uppercase letter, lowercase letters, 1 numerical character, and 1 special symbol, with a minimum length of 6 characters'
                    : '';
                break;
            case 'confirmPassword':
                error = value !== formData.password ? 'Passwords do not match' : '';
                break;
            default:
                break;
        }
        return error;
    };

    const validateForm = () => {
        const { name, email, phone, password, confirmPassword } = formData;
        const newErrors = {};
        const navigate = useNavigate

        newErrors.name = validateField('name', name);
        newErrors.email = validateField('email', email);
        newErrors.phone = validateField('phone', phone);
        newErrors.password = validateField('password', password);
        newErrors.confirmPassword = validateField('confirmPassword', confirmPassword);

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
            const response = await axios.post(`${baseURL}/api/auth/student/signup`, formData, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.status === 200) {
                toast.success('Signup successful!');
                setFormData({ name: '', email: '', phone: '', password: '', confirmPassword: '' });
                setErrors({});
            } else {
                toast.error('Signup failed. Please try again.');
            }
        } catch (error) {
            console.log("erroro : ",error)
            if(error.response.status === 400){
                toast.error('Account exist with this email Id')
            }else{
                toast.error('Signup failed. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container d-flex justify-content-center align-items-center vh-100" style={{ backgroundColor: '#f0f2f5' }}>
            <div className="card p-4 shadow-lg" style={{ width: '400px', maxWidth: '100%', borderRadius: '20px', background: '#ecf0f3', boxShadow: '7px 7px 15px #cbced1, -7px -7px 15px #ffffff' }}>
                <h3 className="card-title text-center" style={{ marginBottom: '20px', color: '#333' }}>Signup</h3>
                <form onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label className="form-label" style={{ color: '#555' }}>Name</label>
                        <input
                            type="text"
                            className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            style={{ borderRadius: '10px' }}
                        />
                        {errors.name && <div className="invalid-feedback">{errors.name}</div>}
                    </div>
                    <div className="mb-2">
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
                    <div className="mb-2">
                        <label className="form-label" style={{ color: '#555' }}>Phone Number</label>
                        <input
                            type="text"
                            className={`form-control ${errors.phone ? 'is-invalid' : ''}`}
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            style={{ borderRadius: '10px' }}
                        />
                        {errors.phone && <div className="invalid-feedback">{errors.phone}</div>}
                    </div>
                    <div className="mb-2">
                        <label className="form-label" style={{ color: '#555' }}>Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
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
                            {errors.password && <div className="invalid-feedback d-block">{errors.password}</div>}
                        </div>
                    </div>
                    <div className="mb-3">
                        <label className="form-label" style={{ color: '#555' }}>Confirm Password</label>
                        <div className="input-group">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                className={`form-control ${errors.confirmPassword ? 'is-invalid' : ''}`}
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                style={{ borderRadius: '10px' }}
                            />
                            <button
                                className="btn btn-outline-secondary"
                                type="button"
                                onClick={toggleConfirmPasswordVisibility}
                                style={{ borderRadius: '10px' }}
                            >
                                {showConfirmPassword ? <BsEyeSlash /> : <BsEye />}
                            </button>
                            {errors.confirmPassword && <div className="invalid-feedback d-block">{errors.confirmPassword}</div>}
                        </div>
                    </div>
                    <button type="submit" className="btn btn-primary w-100" disabled={isLoading} style={{ borderRadius: '10px', background: '#4CAF50', borderColor: '#4CAF50' }}>
                        {isLoading ? (
                            <span className="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                        ) : (
                            'Signup'
                        )}
                    </button>
                    <div className="mt-3 text-center">
                        <span style={{ color: '#555' }}>Already have an account? </span>
                        <button onClick={() => { navigate('/signin') }} className='link'>Sign In</button>
                    </div>
                </form>
            </div>
            <ToastContainer />
        </div>
    );
};

export default Signup;
