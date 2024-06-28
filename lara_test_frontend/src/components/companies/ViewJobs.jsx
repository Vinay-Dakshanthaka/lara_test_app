import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { baseURL } from '../config';
import { toast } from 'react-toastify';

const ViewJobs = () => {
  const [jobs, setJobs] = useState([]);
  const { company_id } = useParams(); // Get company_id from URL route parameter
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/job/getJobsBycompanyId`,
          {
            params: { company_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log(response.data.job);

        setJobs(response.data.job);
      } catch (error) {
        console.error('Error fetching jobs:', error);
        toast.error('Failed to fetch jobs');
      }
    };

    fetchJobs();
  }, [company_id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Jobs for the Company</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Position</th>
            <th>Description</th>
            <th>Location</th>
            <th>Openings</th>
          </tr>
        </thead>
        <tbody>
          {jobs.map((job) => (
            <tr key={job.job_id}>
              <td>{job.name}</td>
              <td>{job.position}</td>
              <td>{job.description}</td>
              <td>{job.job_location}</td>
              <td>{job.no_of_openings}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewJobs;
