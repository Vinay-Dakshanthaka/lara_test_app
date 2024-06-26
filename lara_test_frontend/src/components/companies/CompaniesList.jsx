import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/companieslist.css';
import { Dropdown, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCompanies = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        console.log('No token Provided');
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      try {
        const response = await axios.get(`${baseURL}/api/company/getAllCompanyDetails`, config);
        setCompanies(response.data);
      } catch (error) {
        console.error('Error fetching companies:', error);
      }
    };
    fetchCompanies();
  }, []);

  const handleViewAgents = async (companyId) => {
    console.log('Viewing agents for company with ID:', companyId);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token does not exist');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    try {
      const response = await axios.post(`${baseURL}/api/agent/getAgentByCompanyId`, { companyId }, config);
      setAgents(response.data);
      console.log(response.data);
    } catch (error) {
      console.log(error);
      toast.error('Error fetching Agents');
    }
  };

  const handleAddAgent = (companyId) => {
    console.log('Adding agent for company with ID:', companyId);
    navigate(`/add-agent/${companyId}`);
  };

  const handleUpdateCompany = (companyId) => {
    console.log('Updating company with ID:', companyId);
    navigate(`/update-company/${companyId}`);
  };

  const handleShowDeleteModal = (companyId) => {
    setCompanyToDelete(companyId);
    setShowDeleteModal(true);
  };

  const handleCloseDeleteModal = () => {
    setShowDeleteModal(false);
    setCompanyToDelete(null);
  };

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

    console.log('Deleting company with ID:', companyToDelete);
    const token = localStorage.getItem('token');
    if (!token) {
      console.log('Token does not exist');
      return;
    }
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      data: {
        company_id: companyToDelete
      }
    };
    try {
      await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
      toast.success('Company deleted successfully');
      setCompanies(companies.filter((company) => company.company_id !== companyToDelete));
      handleCloseDeleteModal();
    } catch (error) {
      console.error('Error deleting company:', error);
      toast.error('Error deleting company');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">List of Companies</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Agents</th>
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.company_id}>
              <td>
                <img
                  src={company.logoPath}
                  alt={`${company.name} logo`}
                  className="company-logo"
                />
              </td>
              <td>{company.name}</td>
              <td>{company.description}</td>
              <td>{company.type}</td>
              <td>{company.address}</td>
              <td>{company.phoneNumber}</td>
              <td>{company.general_mail_id}</td>
              <td>
                <ul>
                  {agents
                    .filter((agent) => agent.company_id === company.company_id)
                    .map((agent) => (
                      <li key={agent.agent_id}>{agent.name} - {agent.email} - {agent.contactNumber}</li>
                    ))}
                </ul>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    <i className="fas fa-ellipsis-h"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item onClick={() => handleViewAgents(company.company_id)}>View Agents</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleAddAgent(company.company_id)}>Add Agent</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleUpdateCompany(company.company_id)}>Update Company</Dropdown.Item>
                    <Dropdown.Item onClick={() => handleShowDeleteModal(company.company_id)}>Delete Company</Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this company?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseDeleteModal}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteCompany}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CompaniesList;
