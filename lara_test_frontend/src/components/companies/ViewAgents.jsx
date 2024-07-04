import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";

const ViewAgents = () => {
  const { companyId } = useParams();
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [company, setCompany] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAgents = async () => {
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

        const response = await axios.post(
          `${baseURL}/api/agent/getAgentByCompanyId`,
          { company_id: companyId },
          config
        );

        setAgents(response.data.agent || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching agents:", error);
        if (error.response && error.response.status === 404) {
          setError("No Agents found for this company");
        } else {
          setError("Error fetching agents");
        }
        setLoading(false);
      }
    };

    const fetchCompanyDetails = async () => {
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

        const companyResponse = await axios.get(
          `${baseURL}/api/company/company/${companyId}`,
          config
        );

        setCompany(companyResponse.data);
      } catch (error) {
        console.error("Error fetching company details:", error);
      }
    };

    fetchAgents();
    fetchCompanyDetails();
  }, [companyId]);

  const handleBackClick = () => {
    navigate(-1);
  };

  const handleAddAgentClick = () => {
    navigate(`/add-agent/${companyId}`);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || agents.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Agents</h2>
        <div className="text-center mb-4">
          <Button onClick={handleAddAgentClick} variant="primary">
            Add Agent
          </Button>
        </div>
        <p className="text-center">{error || "No Agents found for this company"}</p>
        <div className="text-center">
          <Button onClick={handleBackClick} variant="secondary">
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <div className="mb-4">
        <Button onClick={handleAddAgentClick} variant="primary">
          Add Agent
        </Button>
      </div>

      {/* Company Details Section */}
      {company && (
        <div className="mb-4">
          <h2 className="text-center mb-4">
            {company.name} 
          </h2>
          <p><strong>Address:</strong> {company.address}</p>
          <p><strong>Email:</strong> {company.general_mail_id}</p>
        </div>
      )}

      {/* Agents Table */}
      <h2 className="text-center mb-4">Agents</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Designation</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {agents.map((agent) => (
            <tr key={agent.agent_id}>
              <td>{agent.name}</td>
              <td>{agent.mail_id}</td>
              <td>{agent.contactNumber}</td>
              <td>{agent.designation}</td>
              <td>{agent.isActive ? "Active" : "Inactive"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="text-center">
        <Button onClick={handleBackClick} variant="secondary">
          Back
        </Button>
      </div>
    </div>
  );
};

export default ViewAgents;
