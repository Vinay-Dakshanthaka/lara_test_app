import React, { useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from './config';
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const DeleteAccount = () => {
    const [showModal, setShowModal] = useState(false);
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleDelete = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setError("No token provided.");
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        };

        try {
            await axios.put(`${baseURL}/api/auth/student/deleteAccount`, {}, config);
            // Add any additional actions on successful deletion

            toast.success('Account Deleted ')
            // console.log("Account deleted successfully");
            localStorage.clear();
            setTimeout(() => {
              navigate('/signin');
          }, 2000);
            setShowModal(false);
        } catch (err) {
          if(err.response.status === 404){
            toast.success('No User Found')
          }
            toast.error('Something went wrong!!!')
            setError(err.response ? err.response.data.message : err.message);
        }
    };

    return (
        <div className='container mt-5 bg-default'>
          <h5 className='my-2'>Delete Account </h5>
            <button className="btn btn-danger my-2" onClick={() => setShowModal(true)}>
                Delete Your Account
            </button>

            {error && <p className="text-danger">{error}</p>}

            {/* Bootstrap Modal */}
            <div className={`modal fade ${showModal ? 'show' : ''}`} style={{ display: showModal ? 'block' : 'none' }}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h5 className="modal-title">Confirm Delete</h5>
                            <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
                        </div>
                        <div className="modal-body">
                            <p>Are you sure you want to delete your account?</p>
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button type="button" className="btn btn-danger" onClick={handleDelete}>Delete</button>
                        </div>
                    </div>
                </div>
            </div>
            <ToastContainer />
        </div>
    );
};

export default DeleteAccount;
