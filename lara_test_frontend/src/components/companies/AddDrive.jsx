import React, { useEffect, useState } from 'react';
import { baseURL } from '../config';
import { toast, ToastContainer } from 'react-toastify';
import axios from 'axios';
import AnyCompanyLogo from '../admin/AnyCompanyLogo';
import CompanyDetails from './CompanyDetails';
import { useNavigate } from 'react-router-dom';

function AddDrive({ selectedCompanyId }) {
    const navigate = useNavigate();
    const [driveData, setDriveData] = useState({
        company_id: selectedCompanyId, // Initialize with selectedCompanyId
        drive_date: '',
        drive_time: '',
        drive_location: ''
    });

    // Update company_id in state if selectedCompanyId changes
    useEffect(() => {
        setDriveData((prevDriveData) => ({
            ...prevDriveData,
            company_id: selectedCompanyId
        }));
    }, [selectedCompanyId]);

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
            console.log("Drive Date", driveData.drive_date);
            toast.success('Drive added successfully');
            // setTimeout(() => {
            //     navigate('/view-drives')
            // }, 3000)
            setDriveData({
                drive_date: '',
                drive_time: '',
                drive_location: '' 
            })
        } catch (error) {
            console.error('Error adding drive:', error);
            toast.error('Failed to add drive');
        }
    };

    return (
        <div className="container mt-5">
            <CompanyDetails companyId={driveData.company_id} />
           
            <form onSubmit={handleSubmit}>
                <div className="form-group col-lg-3 col-sm-12 col-md-6">
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
                <div className="form-group col-lg-3 col-sm-12 col-md-6">
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
                <div className="form-group col-lg-3 col-sm-12 col-md-6">
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
                <button type="submit" className="btn btn-primary my-3" onClick={handleSubmit}>
                    Add Drive
                </button>
            </form>
            <ToastContainer />
        </div>
    );
}

export default AddDrive;
