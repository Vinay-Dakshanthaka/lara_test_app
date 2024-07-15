import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, Modal } from 'react-bootstrap';

const SavePlacementTestStudent = ({ show, onSuccess, handleClose }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/placement-test/save-placement-test-student', formData);

            // Handle success, close modal, clear form data
            console.log('Student data saved:', response.data);
            onSuccess(response.data.student_id); // Pass student_id to onSuccess callback
            handleClose(); // Call handleClose to close the modal
            setFormData({
                name: '',
                email: '',
                phone_number: ''
            });
        } catch (error) {
            console.error('Error saving student data:', error);
            setError('Failed to save student data. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>Save Student Data</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <div className="alert alert-danger">{error}</div>}
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                        <Form.Label>Name</Form.Label>
                        <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                            type="text"
                            name="phone_number"
                            value={formData.phone_number}
                            onChange={handleChange}
                            required
                        />
                    </Form.Group>
                    <Button variant="primary" type="submit" disabled={loading}>
                        {loading ? 'Saving...' : 'Save'}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default SavePlacementTestStudent;
