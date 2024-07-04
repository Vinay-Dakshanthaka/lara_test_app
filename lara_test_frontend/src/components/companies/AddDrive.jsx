import React, { useState } from 'react';
import { baseURL } from '../config';
import { toast } from 'react-toastify';
import axios from 'axios';

function AddDrive({ selectedCompanyId }) {
    console.log("selectedCompanyId", selectedCompanyId);
    const [driveData, setDriveData] = useState({
        company_id: selectedCompanyId,
        drive_date: '',
        drive_time: '',
        drive_location: ''
    });

    const handleChange = (e) => {
        setDriveData({ ...driveData, [e.target.name]: e.target.value });
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
                driveData,
                config
            );
            toast.success('Drive added successfully');
        } catch (error) {
            console.error('Error adding drive:', error);
            toast.error('Failed to add drive');
        }
    };

    return (
        <div className="container mt-5">
            <h2 className="text-center mb-4">Add Drive Details</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group">
                    <label>Drive Date</label>
                    <input
                        type="date"
                        className="form-control"
                        name="drive_date"
                        value={driveData.drive_date}
                        onChange={handleChange}
                        required
                    />
                </div>
                <div className="form-group">
                    <label>Drive Time</label>
                    <input
                        type="time"
                        className="form-control"
                        name="drive_time"
                        value={driveData.drive_time}
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
                        value={driveData.drive_location}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">
                    Add Drive
                </button>
            </form>
        </div>
    );
}

export default AddDrive;
