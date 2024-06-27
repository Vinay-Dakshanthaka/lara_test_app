import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../config';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AllStudentDetails = ({ children, showRole = true }) => {
  const [data, setData] = useState({ students: [], profiles: [] });
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(10);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchSpecialization, setSearchSpecialization] = useState('');
  const [searchEducation, setSearchEducation] = useState('');
  const [filterYear, setFilterYear] = useState('');

  useEffect(() => {
    const fetchDetails = async () => {
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
        const response = await axios.get(`${baseURL}/api/student/profile/getAllProfileDetails`, config);
        setData(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };

    fetchDetails();
  }, []);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const filteredProfiles = data.profiles.filter((profile) => {
    if (!profile) {
        return false; // Skip undefined or null profiles
    }

    const searchTermMatch = (profile.name && profile.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
                            (profile.mobile_number && profile.mobile_number.toLowerCase().includes(searchTerm.toLowerCase()));
    const searchSpecializationMatch = profile.specialization && profile.specialization.toLowerCase().includes(searchSpecialization.toLowerCase());
    const searchEducationMatch = profile.highest_education && profile.highest_education.toLowerCase().includes(searchEducation.toLowerCase());
    const filterYearMatch = filterYear ? profile.year_of_passout === parseInt(filterYear) : true;

    return searchTermMatch && searchSpecializationMatch && searchEducationMatch && filterYearMatch;
});

  const indexOfLastProfile = currentPage * perPage;
  const indexOfFirstProfile = indexOfLastProfile - perPage;
  const currentProfiles = filteredProfiles.slice(indexOfFirstProfile, indexOfLastProfile);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container mt-5">
      <h1>Student and Profile Details</h1>
      <div className="container row">
      <div className="mb-3 col-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Name or Mobile Number"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="mb-3 col-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Specialization"
          value={searchSpecialization}
          onChange={(e) => setSearchSpecialization(e.target.value)}
        />
      </div>
      <div className="mb-3 col-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search by Highest Education"
          value={searchEducation}
          onChange={(e) => setSearchEducation(e.target.value)}
        />
      </div>
      <div className="mb-3 col-4">
        <input
          type="number"
          className="form-control"
          placeholder="Filter by Year of Passout"
          value={filterYear}
          onChange={(e) => setFilterYear(e.target.value)}
        />
      </div>
      </div>
      <div className="table-responsive">
        <table className="table table-striped">
          <thead>
            <tr>
              <th>Name</th>
              <th>Gender</th>
              <th>Highest Education</th>
              <th>Year of Passout</th>
              <th>Specialization</th>
              <th>Highest Education Percent</th>
              <th>10<sup>th</sup> </th>
              <th>12<sup>th</sup></th>
              <th>Mobile Number</th>
              <th>Father Name</th>
              <th>Father Mobile Number</th>
              <th>Father Occupation</th>
              <th>Mother Name</th>
              <th>Aadhaar Number</th>
              <th>Address</th>
              <th>Pincode</th>
              <th>City</th>
              <th>District</th>
              <th>State</th>
              <th>Country</th>
              {showRole && <th>Role</th>}
            </tr>
          </thead>
          <tbody>
            {currentProfiles.map((profile, index) => {
              const student = data.students[index];
              return (
                <tr key={index}>
                  <td>{profile.name}</td>
                  <td>{profile.gender}</td>
                  <td>{profile.highest_education}</td>
                  <td>{profile.year_of_passout}</td>
                  <td>{profile.specialization}</td>
                  <td>{profile.highest_education_percent}</td>
                  <td>{profile.tenth_percentage}</td>
                  <td>{profile.twelth_percentage}</td>
                  <td>{profile.mobile_number}</td>
                  <td>{profile.father_name}</td>
                  <td>{profile.father_mobile_number}</td>
                  <td>{profile.father_occupation}</td>
                  <td>{profile.mother_name}</td>
                  <td>{profile.adhaar_number}</td>
                  <td>{profile.address}</td>
                  <td>{profile.pincode}</td>
                  <td>{profile.city}</td>
                  <td>{profile.district}</td>
                  <td>{profile.state}</td>
                  <td>{profile.country}</td>
                  {showRole && <td>{student?.role}</td>}
                  {children && React.cloneElement(children, { student })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <nav>
        <ul className="pagination">
          {Array.from({ length: Math.ceil(filteredProfiles.length / perPage) }, (_, index) => (
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

export default AllStudentDetails;
