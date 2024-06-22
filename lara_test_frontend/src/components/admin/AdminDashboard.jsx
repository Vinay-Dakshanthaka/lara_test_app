import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AdminDashboard = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');

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

  // Function to handle role update
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
      toast.success('Role updated successfully');
      // Update the local state after successful update (if needed)
      // Example: Refresh student data after update
      // fetchStudentDetails();
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Something went wrong!!!');
    }
  };

  // Function to handle pagination
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Function to filter students based on search term
  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate indexes for pagination
  const indexOfLastStudent = currentPage * perPage;
  const indexOfFirstStudent = indexOfLastStudent - perPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Student Details</h1>
      <div className="mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name, Email or Phone Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Role</th>
            <th>Update Role</th>
          </tr>
        </thead>
        <tbody>
          {currentStudents.map((student) => (
            <tr key={student.student_id}>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <select
                  defaultValue={student.role}
                  data-id={student.student_id}
                  onChange={(e) => handleUpdateRole(student.student_id, e.target.value)}
                >
                  <option value="PLACEMENT OFFICER">PLACEMENT OFFICER</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </td>
              <td>
                <button
                  className="btn" style={{ borderRadius: '10px', background: '#4CAF50', borderColor: '#4CAF50', color:'#fff' }}
                  onClick={() => handleUpdateRole(student.student_id, document.querySelector(`select[data-id="${student.student_id}"]`).value)}
                >
                  Update
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredStudents.length / perPage) }, (_, index) => (
            <li key={index} className={`page-item ${currentPage === index + 1 ? 'active' : ''}`}>
              <button onClick={() => paginate(index + 1)} className="page-link">
                {index + 1}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <ToastContainer />
    </div>
  );
};

export default AdminDashboard;
