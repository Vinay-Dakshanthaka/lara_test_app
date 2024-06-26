import React, { useEffect, useState } from 'react';
import axios from 'axios';

const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);

//   useEffect(() => {
//     fetchCompanies();
//   }, []);

//   const fetchCompanies = async () => {
//     try {
//       const response = await axios.get('/api/companies');
//       setCompanies(response.data);
//     } catch (error) {
//       console.error('Error fetching companies:', error);
//     }
//   };

  const handleAddAgent = async (companyId) => {
    // Implement agent addition functionality
    console.log('Adding agent for company with ID:', companyId);
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">List of Companies</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Description</th>
            <th>Type</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            <th>Agents</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {companies.map(company => (
            <tr key={company.id}>
              <td><img src={company.logoPath} alt={`${company.name} logo`} style={{ width: '50px', height: 'auto' }} /></td>
              <td>{company.name}</td>
              <td>{company.description}</td>
              <td>{company.type}</td>
              <td>{company.address}</td>
              <td>{company.phoneNumber}</td>
              <td>{company.mailId}</td>
              
              <td>
                <ul>
                  {company.Agents.map(agent => (
                    <li key={agent.id}>{agent.name} - {agent.email} - {agent.phone}</li>
                  ))}
                </ul>
              </td>
              <td>
                <button className="btn btn-primary" onClick={() => handleAddAgent(company.id)}>
                  Add Agent
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CompaniesList;
