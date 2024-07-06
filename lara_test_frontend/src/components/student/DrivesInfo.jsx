import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import { baseURL } from "../config";
import "react-toastify/dist/ReactToastify.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Spinner } from "react-bootstrap";
import AnyCompanyLogo from "../admin/AnyCompanyLogo";

const DrivesInfo = () => {
  const [jobDetails, setJobDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        setLoading(true);
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
          `${baseURL}/api/job/getAllJobDetailsByStudent`,
          config
        );

        if (response.status === 200) {
          setJobDetails(response.data.job_details);
        }
      } catch (error) {
        console.error("Error fetching job details:", error);
        toast.error("Failed to fetch job details");
      } finally {
        setLoading(false);
      }
    };

    fetchJobDetails();
  }, []);

  return (
    <div className="container mt-3">
      <h2 className="text-center mb-4">Interviews</h2>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : (
        <table className="table table-striped table-hover">
          <thead className="thead-dark">
            <tr>
              <th>Company Name</th>
              <th>Job</th>
              <th>Job Description</th>
              <th>Total Rounds</th>
              <th>Rounds Cleared</th>
            </tr>
          </thead>
          <tbody>
            {jobDetails.length > 0 ? (
              jobDetails.map((job, index) => (
                <tr key={index}>
                  <td>
                <AnyCompanyLogo companyId={job.company.company_id} style={{ width: '50px', height: '50px', borderRadius: '5%', margin: '10px' }} />
                    {job.company.name}
                    </td>
                  <td>{job.job_details.Job}</td>
                  <td>{job.job_details.JD}</td>
                  <td>{job.job_details.Total_Rounds}</td>
                  <td>{job.rounds}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center">
                  No job details found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
      <ToastContainer position="top-right" />
    </div>
  );
};

export default DrivesInfo;
