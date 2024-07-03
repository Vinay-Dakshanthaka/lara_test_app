import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../config";

function EditJob() {
  const [job, setJob] = useState({
    job_title: "",
    description: "",
    job_location: "",
    no_of_openings: "",
    year_of_exp: "",
    position: "",
    total_rounds: ""
  });
  const { job_id } = useParams();
  const history = useNavigate();

  useEffect(() => {
    const fetchJob = async () => {
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
          `${baseURL}/api/getJobById`,
          {
            params: { job_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
        toast.error("Failed to fetch job");
      }
    };

    fetchJob();
  }, [job_id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob((prevJob) => ({
      ...prevJob,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      await axios.put(
        `${baseURL}/api/updateJob`,
        { job_id, ...job },
        config
      );

      toast.success("Job updated successfully");
      history(`/drives/${job.drive_id}/jobs`);
    } catch (error) {
      console.error("Error updating job:", error);
      toast.error("Failed to update job");
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Edit Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="job_title">Title</label>
          <input
            type="text"
            className="form-control"
            id="job_title"
            name="job_title"
            value={job.job_title}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="description">Description</label>
          <textarea
            className="form-control"
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            required
          ></textarea>
        </div>
        <div className="form-group">
          <label htmlFor="job_location">Location</label>
          <input
            type="text"
            className="form-control"
            id="job_location"
            name="job_location"
            value={job.job_location}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="no_of_openings">No. of Openings</label>
          <input
            type="number"
            className="form-control"
            id="no_of_openings"
            name="no_of_openings"
            value={job.no_of_openings}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="year_of_exp">Years of Experience</label>
          <input
            type="number"
            className="form-control"
            id="year_of_exp"
            name="year_of_exp"
            value={job.year_of_exp}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="position">Position</label>
          <input
            type="text"
            className="form-control"
            id="position"
            name="position"
            value={job.position}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="total_rounds">Total Rounds</label>
          <input
            type="number"
            className="form-control"
            id="total_rounds"
            name="total_rounds"
            value={job.total_rounds}
            onChange={handleChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary mt-3">
          Update Job
        </button>
      </form>
    </div>
  );
}

export default EditJob;
