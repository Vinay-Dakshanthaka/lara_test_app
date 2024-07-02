import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { baseURL } from '../config';
import axios from 'axios';

const AddJobs = ({ selectedCompanyId }) => {
  console.log("CompanyId", selectedCompanyId);
    const [jobData, setJobData] = useState({
        company_id: selectedCompanyId,
        job_title: '',
        position: '',
        job_description: '',
        job_location: '',
        no_of_openings: '',
        drive_date: '',
        drive_location:''
    });

    const handleChange = (e) => {
        setJobData({ ...jobData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
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

            const response = await axios.post(
                `${baseURL}/api/drive/saveDrive`,
                jobData,
                config
            );
            toast.success('Job added successfully');
        } catch (error) {
            console.error('Error adding job:', error);
            toast.error('Failed to add job');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Add Job</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Job Title</label>
                    <input
                        type="text"
                        className="form-control"
                        name="job_title"
                        value={jobData.job_title}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Position</label>
                    <input
                        type="text"
                        className="form-control"
                        name="position"
                        value={jobData.position}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Openings</label>
                    <input
                        type="number"
                        className="form-control"
                        name="no_of_openings"
                        value={jobData.no_of_openings}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Job Description</label>
                    <textarea
                        className="form-control"
                        name="job_description"
                        value={jobData.job_description}
                        onChange={handleChange}
                        rows="3"
                        required
                    ></textarea>
                </div>
                <div className="form-group">
                    <label>Job Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="job_location"
                        value={jobData.job_location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Drive Date</label>
                    <input
                        type="text"
                        className="form-control"
                        name="drive_date"
                        value={jobData.drive_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Drive Location</label>
                    <input
                        type="text"
                        className="form-control"
                        name="drive_location"
                        value={jobData.drive_location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Job
                </button>
            </form>
        </div>
    );
};

export default AddJobs;
