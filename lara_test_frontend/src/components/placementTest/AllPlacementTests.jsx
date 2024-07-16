import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-solid-svg-icons';
import { BsCopy } from 'react-icons/bs';
import { ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';

const AllPlacementTests = () => {
    const [placementTests, setPlacementTests] = useState([]);

    useEffect(() => {
        const fetchPlacementTests = async () => {
            try {
                const response = await axios.get(`${baseURL}/api/placement-test/get-all-placement-tests`);
                setPlacementTests(response.data.placementTests);
            } catch (error) {
                console.error('Error fetching placement tests:', error);
            }
        };

        fetchPlacementTests();
    }, []);

    // Function to copy test link to clipboard
    const copyTestLinkToClipboard = (testLink) => {
        navigator.clipboard.writeText(testLink)
            .then(() => {
                toast.info('Test link copied to clipboard');
            })
            .catch((error) => {
                console.error('Error copying to clipboard:', error);
            });
    };

    return (
        <div className="container mt-5">
            <h2>All Placement Tests</h2>
            <div className="table-responsive">
                <table className="table table-bordered">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Test Link</th>
                            <th>Number of Questions</th>
                            <th>Description</th>
                            <th>Start Time</th>
                            <th>End Time</th>
                            <th>Show Result</th>
                            <th>Results</th>
                        </tr>
                    </thead>
                    <tbody>
                        {placementTests.map(test => (
                            <tr key={test.placement_test_id}>
                                <td>{test.placement_test_id}</td>
                                <td>{test.test_link}
                                <button
                                        className="btn btn-link"
                                        onClick={() => copyTestLinkToClipboard(test.test_link)}
                                        style={{ marginLeft: '10px' }}
                                    >
                                        <BsCopy />
                                    </button>
                                </td>
                                <td>{test.number_of_questions}</td>
                                <td>{test.description}</td>
                                <td>{test.start_time}</td>
                                <td>{test.end_time}</td>
                                <td>{test.show_result ? 'Yes' : 'No'}</td>
                                <td>
                                    <Link to={`/get-result/${test.placement_test_id}`}>
                                        Results
                                    </Link>
                                    
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <ToastContainer />
        </div>
    );
};

export default AllPlacementTests;
