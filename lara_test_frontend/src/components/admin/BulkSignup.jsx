import React, { useState } from 'react';
import { Button, Modal, Spinner, Toast, ToastContainer, Table } from 'react-bootstrap';
import axios from 'axios';
import { baseURL } from '../config'; // Adjust the import according to your project structure
import 'bootstrap/dist/css/bootstrap.min.css';
import image from './Example_Excel_sheet.png';
import SingleSignup from './SingleSignup';

const BulkSignup = () => {
  const [showModal, setShowModal] = useState(false);
  const [file, setFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', variant: '' });
  const [emailErrors, setEmailErrors] = useState([]);

  const handleFileUpload = (event) => {
    const uploadedFile = event.target.files[0];
    const validFileTypes = ['application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'application/vnd.ms-excel'];

    if (uploadedFile && validFileTypes.includes(uploadedFile.type)) {
      setFile(uploadedFile);
    } else {
      setToast({ show: true, message: 'Invalid file type. Only .xlsx and .xls files are allowed.', variant: 'warning' });
      console.error('Invalid file type. Only .xlsx and .xls files are allowed.');
    }
  };

  const handleFileSubmit = async () => {
    if (!file) {
      setToast({ show: true, message: 'No file selected.', variant: 'warning' });
      console.error('No file selected.');
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
      if (response.data.invalidEmails) {
        setEmailErrors(response.data.invalidEmails);
        setToast({ show: true, message: 'Bulk signup success with some unsent emails', variant: 'warning' });
      } else {
        setEmailErrors([]);
        setToast({ show: true, message: response.data.message, variant: 'success' });
      }
    } catch (error) {
      setToast({ show: true, message: 'Something went wrong', variant: 'danger' });
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

        {emailErrors.length > 0 && (
          <div className="mt-3 col-lg-6 col-sm-12 rounded">
            <Table bordered hover className="bg-warning rounded card " style={{ border: '3px solid red', width:'auto'}}>
              <thead>
                <tr>
                  <th>Invalid Emails</th>
                  {/* <th>Error</th> */}
                </tr>
              </thead>
              <tbody>
                {emailErrors.map((error, index) => (
                  <tr key={index}>
                    <td><b>{error}</b></td>
                    {/* <td>{error.error}</td> */}
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        )}

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
      </div>
      <div>
        <SingleSignup />
      </div>

      <ToastContainer position="top-end" className="p-3">
        <Toast
          onClose={() => setToast({ ...toast, show: false })}
          show={toast.show}
          bg={toast.variant}
          delay={3000}
          autohide
        >
          <Toast.Body>{toast.message}</Toast.Body>
        </Toast>
      </ToastContainer>
    </>
  );
};

export default BulkSignup;
