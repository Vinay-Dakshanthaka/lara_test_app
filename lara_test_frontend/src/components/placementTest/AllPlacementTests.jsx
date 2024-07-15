import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';

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

    return (
        <div className="container mt-5">
            <h2>All Placement Tests</h2>
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
                        {/* <th>Topics</th>
                        <th>Created At</th>
                        <th>Updated At</th> */}
                    </tr>
                </thead>
                <tbody>
                    {placementTests.map(test => (
                        <tr key={test.placement_test_id}>
                            <td>{test.placement_test_id}</td>
                            <td>{test.test_link}</td>
                            <td>{test.number_of_questions}</td>
                            <td>{test.description}</td>
                            <td>{test.start_time}</td>
                            <td>{test.end_time}</td>
                            <td>{test.show_result ? 'Yes' : 'No'}</td>
                            {/* <td>
                                {test.topics.map(topic => (
                                    <div key={topic.topic_id}>{topic.name}</div>
                                ))}
                            </td>
                            <td>{new Date(test.created_at).toLocaleString()}</td>
                            <td>{new Date(test.updated_at).toLocaleString()}</td> */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AllPlacementTests;
