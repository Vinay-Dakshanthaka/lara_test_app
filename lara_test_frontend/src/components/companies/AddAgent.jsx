import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { toast } from "react-toastify";
import "./styles/uploadcompanies.css";

function AddAgent() {
  const { companyId } = useParams();
  // console.log('company id : ', companyId);
  const [agentInfo, setAgentInfo] = useState({
    name: "",
    contactNumber: "",
    designation: "",
    mail_id: "",
  });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAgentInfo({
      ...agentInfo,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!agentInfo.name) tempErrors.name = "Name is required.";
    if (!agentInfo.contactNumber)
      tempErrors.contactNumber = "Contact Number is required.";
    if (!agentInfo.designation)
      tempErrors.designation = "Designation is required.";
    if (!agentInfo.mail_id) {
      tempErrors.mail_id = "Mail ID is required.";
    } else if (!/\S+@\S+\.\S+/.test(agentInfo.mail_id)) {
      tempErrors.mail_id = "Mail ID is invalid.";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
          `${baseURL}/api/agent/saveAgent`,
          {
            company_id: companyId,
            ...agentInfo,
          },
          config
        );

        toast.success("Agent added successfully");
        navigate(`/view-agents/${companyId}`);
      } catch (error) {
        if(error.response.status === 400){
          toast.error('Email Id Exists')
        }
        console.error("Error adding agent:", error);
        // toast.error("Error adding agent");
      }
    }
  };

  return (
    <>
      <div className="container rounded bg-white mt-5 mb-5">
        <div className="row">
          <div className="col-md-5 border-right">
            <div className="p-3 py-5">
              <div className="d-flex justify-content-between align-items-center mb-3">
                <h4 className="text-right">Agent Information</h4>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="row mt-2">
                  <div className="col-md-12">
                    <label className="labels">Name</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Agent Name"
                      name="name"
                      value={agentInfo.name}
                      onChange={handleChange}
                    />
                    {errors.name && (
                      <div className="text-danger">{errors.name}</div>
                    )}
                  </div>
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">General Mail ID</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Mail ID"
                    name="mail_id"
                    value={agentInfo.mail_id}
                    onChange={handleChange}
                  />
                  {errors.mail_id && (
                    <div className="text-danger">{errors.mail_id}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">Designation</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Designation"
                    name="designation"
                    value={agentInfo.designation}
                    onChange={handleChange}
                  />
                  {errors.designation && (
                    <div className="text-danger">{errors.designation}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone Number"
                    name="contactNumber"
                    value={agentInfo.contactNumber}
                    onChange={handleChange}
                  />
                  {errors.contactNumber && (
                    <div className="text-danger">{errors.contactNumber}</div>
                  )}
                </div>
                <div className="mt-5 text-center">
                  <button
                    className="btn btn-primary profile-button"
                    type="submit"
                  >
                    Save Agent Info
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AddAgent;
