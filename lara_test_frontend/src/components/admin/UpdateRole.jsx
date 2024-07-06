import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AnyProfileImage from './AnyProfileImage';

const UpdateRole = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoles, setSelectedRoles] = useState({});

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${baseURL}/api/admin/activites/all-student-details`, config);
      setStudents(response.data.allStudents);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const handleUpdateRole = async (id) => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const newRole = selectedRoles[id];
      await axios.post(
        `${baseURL}/api/admin/activites/update-role`,
        { id, role: newRole },
        config
      );
      toast.success('Role updated successfully');
      fetchStudentDetails(); // Refetch student details to update the state
    } catch (error) {
      console.error('Error updating role:', error);
      toast.error('Something went wrong!!!');
    }
  };

  const handleRoleChange = (id, newRole) => {
    setSelectedRoles((prevState) => ({ ...prevState, [id]: newRole }));
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredStudents = students.filter((student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastStudent = currentPage * perPage;
  const indexOfFirstStudent = indexOfLastStudent - perPage;
  const currentStudents = filteredStudents.slice(indexOfFirstStudent, indexOfLastStudent);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Update Role</h1>
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
            <th>Image</th>
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
              <td>
              <AnyProfileImage studentId={student.student_id} style={{ width: '50px', height: '50px' }} />
              </td>
              <td>{student.name}</td>
              <td>{student.email}</td>
              <td>{student.phoneNumber}</td>
              <td>
                <select
                  value={selectedRoles[student.student_id] || student.role}
                  onChange={(e) => handleRoleChange(student.student_id, e.target.value)}
                >
                  <option value="PLACEMENT OFFICER">PLACEMENT OFFICER</option>
                  <option value="STUDENT">STUDENT</option>
                </select>
              </td>
              <td>
                <button
                  className="btn"
                  style={{ borderRadius: '10px', background: '#4CAF50', borderColor: '#4CAF50', color: '#fff' }}
                  onClick={() => handleUpdateRole(student.student_id)}
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

export default UpdateRole;
