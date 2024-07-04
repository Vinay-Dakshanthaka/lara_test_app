import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";

function ViewJobs() {
  const [jobs, setJobs] = useState([]);
  const [noJobs, setNoJobs] = useState(false);
  const { drive_id } = useParams();
  console.log("drive_id", drive_id);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/job/getJobsByDriveId?drive_id=${drive_id}`,
          config
        );

        if (response.status === 200) {
          setJobs(response.data.job);
          setNoJobs(response.data.job.length === 0);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response && error.response.status === 404) {
          setNoJobs(true);
        } else {
          toast.error("Failed to fetch jobs");
        }
      }
    };

    fetchJobs();
  }, [drive_id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Jobs for the Drive</h2>
      {noJobs ? (
        <div className="alert alert-info" role="alert">
          No job added for the drive, please add a job.
        </div>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Location</th>
              <th>Openings</th>
              <th>Experience</th>
              <th>Position</th>
              <th>Rounds</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((job) => (
              <tr key={job.job_id}>
                <td>{job.job_title}</td>
                <td>{job.description}</td>
                <td>{job.job_location}</td>
                <td>{job.no_of_openings}</td>
                <td>{job.year_of_exp}</td>
                <td>{job.position}</td>
                <td>{job.total_rounds}</td>
                <td>
                  <Link to={`/jobs/${job.job_id}/edit`} className="btn btn-warning">
                    Edit
                  </Link>
                  <Link to={`/jobs/${job.job_id}/skills`} className="btn btn-info ml-2">
                    Manage Skills
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default ViewJobs;
