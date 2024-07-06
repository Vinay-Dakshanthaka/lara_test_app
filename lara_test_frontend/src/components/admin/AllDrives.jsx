import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import AnyCompanyLogo from './AnyCompanyLogo';

const AllDrives = () => {
  const [drives, setDrives] = useState([]);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
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

        const response = await axios.get(`${baseURL}/api/drive/getAllDrives`, config);
        // Sort drives by drive_date in descending order
        const sortedDrives = response.data.drives.sort((a, b) => {
          return new Date(b.drive.drive_date) - new Date(a.drive.drive_date);
        });
        setDrives(sortedDrives);
      } catch (error) {
        console.error('Failed to fetch drives', error);
        toast.error('Failed to fetch drives');
      }
    };

    fetchDrives();
  }, []);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">All Drives</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Logo</th>
            <th>Company Name</th>
            <th>Drive Date</th>
            <th>Drive Location</th>
            <th>Jobs</th>
          </tr>
        </thead>
        <tbody>
          {drives.map(({ drive, company }) => (
            <tr key={drive.drive_id}>
              <td>
                <AnyCompanyLogo companyId={company.company_id} style={{ width: '50px', height: '50px', borderRadius: '5%', margin: '10px' }} />
              </td>
              <td>{company.name}</td>
              <td>{drive.drive_date}</td>
              <td>{drive.drive_location}</td>
              <td>
                <Link to={`/drives/all-jobs/${drive.drive_id}/jobs`} className="btn btn-primary">View Jobs</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <ToastContainer />
    </div>
  );
};

export default AllDrives;
