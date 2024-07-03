import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { Modal, Button, Table, Toast } from 'react-bootstrap'; // Import Toast from react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import { BsPencilSquare } from 'react-icons/bs';

const AddCompanyType = () => {
  const [companyTypes, setCompanyTypes] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedType, setSelectedType] = useState({ companyType_id: '', type: '' });
  const [newType, setNewType] = useState('');
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success'); // success or danger (for error messages)
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    const fetchCompanyTypes = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };
        const response = await axios.get(`${baseURL}/api/company/getAllCompanyTypes`, config);
        setCompanyTypes(response.data.companyTypes);
      } catch (error) {
        console.error("Failed to fetch company types", error);
      }
    };

    fetchCompanyTypes();
  }, []); // Adding an empty dependency array to run the effect only once on mount

  const handleEditClick = (type) => {
    setSelectedType(type);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);
  const handleAddModalClose = () => setShowAddModal(false);
  const handleAddModalShow = () => setShowAddModal(true);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedType({ ...selectedType, [name]: value });
  };

  const handleNewTypeChange = (e) => {
    setNewType(e.target.value);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      await axios.post(`${baseURL}/api/company/updateCompanyType`, { id: selectedType.companyType_id, type: selectedType.type }, config);
      setCompanyTypes(companyTypes.map(type => type.companyType_id === selectedType.companyType_id ? selectedType : type));
      setToastVariant('success');
      setToastMessage("Company type updated successfully");
      setShowToast(true);
      handleModalClose();
    //   setTimeout(() => {
    //     window.location.reload()
    //   }, 2000);
    } catch (error) {
      console.error("Failed to update company type", error);
      setToastVariant('danger');
      setToastMessage("Failed to update company type");
      setShowToast(true);
    }
  };

  const handleAddTypeSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const response = await axios.post(`${baseURL}/api/company/saveCompanyType`, { type: newType }, config);
      setCompanyTypes([...companyTypes, response.data]);
      setToastVariant('success');
      setToastMessage("Company type added successfully");
      setShowToast(true);
      handleAddModalClose();
    //   setTimeout(() => {
    //     window.location.reload()
    //   }, 2000);
    } catch (error) {
      console.error("Failed to add company type", error);
      if (error.response && error.response.status === 400) {
        setToastVariant('danger');
        setToastMessage("This category already exists");
      } else {
        setToastVariant('danger');
        setToastMessage("Failed to add company type");
      }
      setShowToast(true);
    }
  };

  return (
    <div className="container mt-5">
      <h3>Company Types</h3>
      <h6 className='text-primary'>If the company category you are looking for is not available, add it here</h6>
      <Button variant="primary" onClick={handleAddModalShow} className="mb-3">Add Company Category</Button>
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {companyTypes.map(type => (
            <tr key={type.companyType_id}>
              <td>{type.companyType_id}</td>
              <td>{type.type}</td>
              <td>
                <Button variant="warning" onClick={() => handleEditClick(type)}>
                  <BsPencilSquare />
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Company Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="type">Company Category</label>
              <input
                type="text"
                className="form-control"
                id="type"
                name="type"
                value={selectedType.type}
                onChange={handleInputChange}
              />
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              Save Changes
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      <Modal show={showAddModal} onHide={handleAddModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add Company Category</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <form onSubmit={handleAddTypeSubmit}>
            <div className="form-group">
              <label htmlFor="newType">Company Category</label>
              <input
                type="text"
                className="form-control"
                id="newType"
                value={newType}
                onChange={handleNewTypeChange}
              />
            </div>
            <Button variant="primary" type="submit" className="mt-3">
              Add
            </Button>
          </form>
        </Modal.Body>
      </Modal>

      {/* Bootstrap Toast for notifications */}
      <Toast
        show={showToast}
        onClose={() => setShowToast(false)}
        style={{
          position: 'fixed',
          top: '20px',
          right: '20px',
          backgroundColor: toastVariant === 'success' ? '#28a745' : '#dc3545',
          color: '#ffffff',
          minWidth: '250px',
          zIndex: 9999,
        }}
        delay={3000}
        autohide
      >
        <Toast.Body>{toastMessage}</Toast.Body>
      </Toast>
    </div>
  );
};

export default AddCompanyType;
