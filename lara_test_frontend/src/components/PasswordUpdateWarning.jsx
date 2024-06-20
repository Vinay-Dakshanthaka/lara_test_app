import React from 'react';
import { Alert, Button, Container, Row, Col } from 'react-bootstrap';
import { BsExclamationTriangle } from 'react-icons/bs';
import { useNavigate } from 'react-router-dom';

const PasswordUpdateWarning = () => {
    const navigate = useNavigate();

    return (
        <Container className="d-flex vh-100">
            <Row className="m-auto align-items-center">
                <Col className="text-center">
                    <Alert variant="warning" className="d-flex flex-column align-items-center" style={{ fontSize: '1.25rem' }}>
                        <BsExclamationTriangle className="mb-2" style={{ fontSize: '3rem' }} /> 
                        <span>
                            Update your password to access further steps. You cannot access the test until you change your password.
                        </span>
                    </Alert>
                    <Button onClick={() => navigate('/update-password')} variant="primary" size="lg">
                        Update Password
                    </Button>
                </Col>
            </Row>
        </Container>
    );
};

export default PasswordUpdateWarning;
