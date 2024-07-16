import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Table } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import { baseURL } from '../config';

const FetchResultsByTestId = () => {
  const { test_id } = useParams();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const response = await axios.post(`${baseURL}/api/placement-test/getAllResultsByTestId`, { placement_test_id: test_id });
        setResults(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching results:', error);
        toast.error('Failed to fetch results.');
        setLoading(false);
      }
    };

    fetchResults();
  }, [test_id]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <h2>Placement Test Results</h2>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>Student Name</th>
            <th>Email</th>
            <th>Phone Number</th>
            <th>Marks Obtained</th>
            <th>Total Marks</th>
          </tr>
        </thead>
        <tbody>
          {results.map(result => (
            <tr key={result.placement_test_student_id}>
              <td>{result.student_details.student_name}</td>
              <td>{result.student_details.email}</td>
              <td>{result.student_details.phone_number}</td>
              <td>{result.marks_obtained}</td>
              <td>{result.total_marks}</td>
            </tr>
          ))}
        </tbody>
      </Table>
      <ToastContainer />
    </div>
  );
};

export default FetchResultsByTestId;
