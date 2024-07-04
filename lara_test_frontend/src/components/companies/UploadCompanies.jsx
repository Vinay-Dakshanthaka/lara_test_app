import React, { useState, useEffect } from "react";
import "./styles/uploadcompanies.css";
import axios from "axios";
import { baseURL } from "../config";
import { ToastContainer, toast } from "react-toastify";
import AddCompanyType from "./AddCompanyType";

const UploadCompanies = () => {
  const [companyInfo, setCompanyInfo] = useState({
    name: "",
    address: "",
    companyType_id: "",
    url: "",
    general_mail_id: "",
    phoneNumber: "",
    description: "",
  });

  const [companyTypes, setCompanyTypes] = useState([]);
  const [errors, setErrors] = useState({});

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
        // console.log('response type ', response.data);
        setCompanyTypes(response.data.companyTypes); // Access the array within the nested object
      } catch (error) {
        console.error("Failed to fetch company types", error);
      }
    };

    fetchCompanyTypes();
  }, []); // Adding an empty dependency array to run the effect only once on mount

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCompanyInfo({
      ...companyInfo,
      [name]: value,
    });
  };

  const validate = () => {
    let tempErrors = {};
    if (!companyInfo.name) tempErrors.name = "Name is required.";
    if (!companyInfo.address) tempErrors.address = "Address is required.";
    if (!companyInfo.companyType_id) tempErrors.companyType_id = "Type is required.";
    if (!companyInfo.url) {
      tempErrors.url = "URL is required.";
    }
    if (!companyInfo.general_mail_id) {
      tempErrors.general_mail_id = "Mail ID is required.";
    } else if (!/\S+@\S+\.\S+/.test(companyInfo.general_mail_id)) {
      tempErrors.general_mail_id = "Mail ID is invalid.";
    }
    if (!companyInfo.phoneNumber)
      tempErrors.phoneNumber = "Phone Number is required.";
    if (!companyInfo.description)
      tempErrors.description = "Description is required.";

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
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
      try {
        await axios.post(
          `${baseURL}/api/company/saveCompany`,
          companyInfo,
          config
        );
        toast.success("Company Added Successfully");
      } catch (error) {
        console.log("Entered Catch block");
        if(error.response.status === 400){
          toast.error('Company mail id already exist ')
        }else{
          toast.error("Failed to Add Company");
        }
        console.error(error);
      }
    }
  };

  return (
    <div className="container rounded bg-white mt-5 mb-5 background">
      <div className="row">
        <div className="col-md-6">
          <div className="p-3 py-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h4 className="text-right">Add Company Information</h4>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mt-2">
                <div className="col-md-12">
                  <label className="labels">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Company Name"
                    name="name"
                    value={companyInfo.name}
                    onChange={handleChange}
                  />
                  {errors.name && (
                    <div className="text-danger">{errors.name}</div>
                  )}
                </div>
              </div>
              <div className="row mt-3">
                <div className="col-md-12 my-2">
                  <label className="labels">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Address"
                    name="address"
                    value={companyInfo.address}
                    onChange={handleChange}
                  />
                  {errors.address && (
                    <div className="text-danger">{errors.address}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">Select Company Category</label>
                  <select
                    className="form-control"
                    name="companyType_id"
                    value={companyInfo.companyType_id}
                    onChange={handleChange}
                  >
                    <option value="">Select Category</option>
                    {companyTypes.map((type) => (
                      <option key={type.companyType_id} value={type.companyType_id}>
                        {type.type}
                      </option>
                    ))}
                  </select>
                  {errors.companyType_id && (
                    <div className="text-danger">{errors.companyType_id}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">URL</label>
                  <input
                    type="url"
                    className="form-control"
                    placeholder="Company URL"
                    name="url"
                    value={companyInfo.url}
                    onChange={handleChange}
                  />
                  {errors.url && (
                    <div className="text-danger">{errors.url}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">General Mail ID</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Mail ID"
                    name="general_mail_id"
                    value={companyInfo.general_mail_id}
                    onChange={handleChange}
                  />
                  {errors.general_mail_id && (
                    <div className="text-danger">{errors.general_mail_id}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">Phone Number</label>
                  <input
                    type="tel"
                    className="form-control"
                    placeholder="Phone Number"
                    name="phoneNumber"
                    value={companyInfo.phoneNumber}
                    onChange={handleChange}
                  />
                  {errors.phoneNumber && (
                    <div className="text-danger">{errors.phoneNumber}</div>
                  )}
                </div>
                <div className="col-md-12 my-2">
                  <label className="labels">Description</label>
                  <textarea
                    className="form-control"
                    placeholder="Company Description"
                    name="description"
                    value={companyInfo.description}
                    onChange={handleChange}
                    rows={5}
                  />
                  {errors.description && (
                    <div className="text-danger">{errors.description}</div>
                  )}
                </div>
              </div>
              <div className="mt-5 text-center">
                <button
                  className="btn btn-primary"
                  type="submit"
                >
                  Save Company Info
                </button>
              </div>
            </form>
          </div>
        </div>
        <div className="col-md-6">
          <AddCompanyType />
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UploadCompanies;
