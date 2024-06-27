import React, { useState } from 'react';
import { Button, Form, Spinner } from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { baseURL } from '../config';

const SingleSignup = () => {
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token provided.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    };

    const body = { email };

    setIsSubmitting(true);

    try {
      const response = await axios.post(`${baseURL}/api/auth/student/single-signup`, body, config);
      toast.success(response.data.message);
      console.log('Account created successfully:', response.data);
    } catch (error) {
      if (error.response && error.response.status === 400) {
        toast.error('Account exists with this email ID');
      } else {
        console.error('Error creating account:', error);
        toast.error('Something went wrong');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mt-5">
      <h1>Create Account via Email</h1>
      <Form onSubmit={handleSubmit} className='my-2'>
        <Form.Group controlId="formEmail" className='col-lg-6 col-sm-10'>
          <Form.Label>Email address</Form.Label>
          <Form.Control
            type="email"
            placeholder="Enter email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setEmailError('');
            }}
            isInvalid={!!emailError}
            disabled={isSubmitting}
          />
          <Form.Control.Feedback type="invalid">{emailError}</Form.Control.Feedback>
        </Form.Group>
        <Button variant="primary" type="submit" className='my-2' disabled={isSubmitting}>
          {isSubmitting ? <><Spinner animation="border" size="sm" /> Creating Account...</> : 'Create Account'}
        </Button>
      </Form>
      <ToastContainer />
    </div>
  );
};

export default SingleSignup;
