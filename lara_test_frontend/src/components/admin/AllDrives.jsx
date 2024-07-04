import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';

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
        setDrives(response.data.drives);
        // console.log("drives ", response);
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
            <th>Company Name</th>
            <th>Drive Date</th>
            <th>Drive Location</th>
            <th>Jobs</th>
          </tr>
        </thead>
        <tbody>
          {drives.map(({ drive, company }) => (
            <tr key={drive.drive_id}>
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
