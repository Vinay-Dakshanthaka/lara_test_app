import React, { useEffect, useState } from 'react';
import { Table, Spinner, Button, Container, Row, Col } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../config'; // Ensure this points to the correct configuration
import { useNavigate } from 'react-router-dom';

const AllTestResults = () => {
    const [testResults, setTestResults] = useState([]);
    const [loading, setLoading] = useState(true); // Add loading state

    useEffect(() => {
        const fetchTestResults = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    throw new Error("No token provided.");
                }

                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                };

                const response = await axios.get(`${baseURL}/api/test/cumulative-test/getTestResultsByStudentId`, config);
                const sortedResults = response.data.sort((a, b) => new Date(b.completed_date_time) - new Date(a.completed_date_time));
                setTestResults(sortedResults);
            } catch (error) {
                console.error('Error fetching test results:', error);
            } finally {
                setLoading(false); // Update loading state after fetching
            }
        };

        fetchTestResults();
    }, []);

    const formatDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
    };

    const navigate = useNavigate();

    const handleNavigate = (testResultId) => {
        navigate(`/all-test-results/${testResultId}`);
    };

    return (
        <div style={{ position: 'relative', minHeight: '100vh' }} className='container mt-5'>
            {loading && ( // Display preloader and dark backdrop while loading
                <div
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        zIndex: 9999,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent dark backdrop
                    }}
                >
                    <Spinner animation="border" variant="primary" style={{ width: '60px', height: '60px' }} />
                </div>
            )}
            <Container style={{ padding: '20px' }}>
                <Row>
                    <Col>
                        <h4 className="mb-4">Test Results</h4>
                        {testResults.length === 0 && !loading ? ( // Display appropriate message if no test results are available
                            <p>No test results available.</p>
                        ) : (
                            <Table striped bordered hover>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Total Marks</th>
                                        <th>Obtained Marks</th>
                                        <th>View Details</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {testResults.map((result) => (
                                        <tr key={result.testResult_id}>
                                            <td>{formatDate(result.completed_date_time)}</td>
                                            <td>{result.total_marks}</td>
                                            <td>{result.obtained_marks}</td>
                                            <td>
                                                <Button
                                                    variant="secondary"
                                                    onClick={() => handleNavigate(result.testResult_id)}
                                                >
                                                    View Details
                                                </Button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </Table>
                        )}
                    </Col>
                </Row>
            </Container>
        </div>
    );
};

export default AllTestResults;
