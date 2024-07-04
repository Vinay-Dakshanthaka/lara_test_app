import React, { useEffect, useState } from 'react'
import { baseURL } from '../config';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import AddCompanyType from './AddCompanyType';
import { useParams } from 'react-router-dom';

function UpdateCompanies() {
    const [companies, setCompanies] = useState([]);
    const [errors, setErrors] = useState({});
    const [companyTypes, setCompanyTypes] = useState([]);
    const {company_id} = useParams();

    console.log("company_id", company_id);
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
    


      useEffect(() => {
        const fetchCompanies = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    console.log("No token provided");
                    return;
                }
    
                const config = {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    params: {
                        company_id: company_id,
                    }
                };
    
                const response = await axios.get(
                    `${baseURL}/api/company/getCompanyByCompanyId`,
                    config
                );
                setCompanies(response.data.company);
            } catch (error) {
                console.error("Error fetching companies:", error);
            }
        };
    
        fetchCompanies();
    }, [company_id]);
    


      const handleChange = (e) => {
        const { name, value } = e.target;
        setCompanies({
          ...companies,
          [name]: value,
        });
      };

      const validate = () => {
        let tempErrors = {};
        if (!companies.name) tempErrors.name = "Name is required.";
        if (!companies.address) tempErrors.address = "Address is required.";
        if (!companies.companyType_id) tempErrors.companyType_id = "Type is required.";
        if (!companies.url) {
          tempErrors.url = "URL is required.";
        }
        if (!companies.general_mail_id) {
          tempErrors.general_mail_id = "Mail ID is required.";
        } else if (!/\S+@\S+\.\S+/.test(companies.general_mail_id)) {
          tempErrors.general_mail_id = "Mail ID is invalid.";
        }
        if (!companies.phoneNumber)
          tempErrors.phoneNumber = "Phone Number is required.";
        if (!companies.description)
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
            await axios.put(
              `${baseURL}/api/company/updateCompany`,
              {company_id: company_id, ...companies},
              config
            );
            toast.success("Company Updated Successfully");
          } catch (error) {
            // console.log("Entered Catch block");
            console.error(error);
            toast.error("Failed to Add Company");
          }
        }
      };

      return (
        <div className="container rounded bg-white mt-5 mb-5 background">
          <div className="row">
            <div className="col-md-6">
              <div className="p-3 py-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h4 className="text-right">Update Company Information</h4>
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
                        value={companies.name}
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
                        value={companies.address}
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
                        value={companies.companyType_id}
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
                        value={companies.url}
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
                        value={companies.general_mail_id}
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
                        value={companies.phoneNumber}
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
                        value={companies.description}
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
}

export default UpdateCompanies
