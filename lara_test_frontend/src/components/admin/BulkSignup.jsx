import React, { useState } from 'react';
import { Button, Modal, Spinner, Alert } from 'react-bootstrap';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { baseURL } from '../config'; // Adjust the import according to your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import image from './Example_Excel_sheet.png';
import SingleSignup from './SingleSignup';

const BulkSignup = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [alertMessage, setAlertMessage] = useState('');
  const [alertVariant, setAlertVariant] = useState('');

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    if (uploadedFile && validFileTypes.includes(uploadedFile.type)) {
      setFile(uploadedFile);
    } else {
      toast.warning('Invalid file type. Only .xlsx and .xls files are allowed.');
      console.error('Invalid file type. Only .xlsx and .xls files are allowed.');
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      toast.warning('No file selected');
      console.error('No file selected.');
      setAlertMessage('No file selected.');
      setAlertVariant('warning');
      return;
    }

    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token provided.');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
      },
    };

    const formData = new FormData();
    formData.append('file', file);

    setIsUploading(true); // Disable the button and show spinner

    try {
      const response = await axios.post(`${baseURL}/api/auth/student/bulk-signup`, formData, config);
      toast.success(response.data.message);
    } catch (error) {
      toast.error('Something went wrong');
      console.error('Error uploading file:', error);
    } finally {
      setIsUploading(false); // Enable the button and hide spinner
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <>
    <div className="container mt-5">
      <h1>Upload Excel for Bulk Account Creation</h1>
      <div className="mb-3">
        <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} disabled={isUploading} />
        <Button variant="primary" onClick={handleFileSubmit} className="ml-2" disabled={isUploading}>
          {isUploading ? <>Bulk Account Creation May take a while, please wait <Spinner animation="border" size="sm" /></> : 'Upload'}
        </Button>
      </div>
      <Button variant="info" onClick={handleShowModal}>Example Excel Sheet</Button>

      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Example Excel Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={image} alt="Example Excel Sheet" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>Close</Button>
        </Modal.Footer>
      </Modal>
      <ToastContainer />
    </div>
    <div>
        <SingleSignup />
    </div>
    </>
  );
};

export default BulkSignup;
