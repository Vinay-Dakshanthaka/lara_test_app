import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../config';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem('token'); // Retrieve token from localStorage
      if (!token) {
        // Handle case where token is not found in localStorage
        console.error('No token found');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`, // Include token in request headers
        },
      };

      try {
        const response = await axios.get(`${baseURL}/api/admin/activites/all-student-details`, config);
        setStudents(response.data.allStudents); // Access the allStudents array
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, []);

  const handleUpdateRole = async (id, newRole) => {
    const token = localStorage.getItem('token'); // Retrieve token from localStorage
    if (!token) {
      // Handle case where token is not found in localStorage
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`, // Include token in request headers
      },
    };

    try {
      const response = await axios.post(
        `${baseURL}/api/admin/activites/update-role`,
        { id, role: newRole },
        config
      );
      console.log('Update successful:', response.data);
    } catch (error) {
      console.error('Error updating role:', error);
    }
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Student Details</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {students.map((student) => (
            <tr key={student.student_id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <select
                  defaultValue={student.role}
                  data-id={student.student_id}
                >
                  <option value="PLACEMENT OFFICER">PLACEMENT OFFICER</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    const selectedRole = document.querySelector(`select[data-id="${student.student_id}"]`).value;
                    handleUpdateRole(student.student_id, selectedRole);
                  }}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
