import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/companieslist.css";
import { Dropdown, Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import defaultLogo from "./DefaultComapnyImage.jpg";
//import DriveList from "./DriveList";
import ViewJobs from "./ViewJobs";
import AnyCompanyLogo from "../admin/AnyCompanyLogo";


// const CompaniesList = ({ setSelectedCompanyId }) => {
//   const [companies, setCompanies] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [companyToDelete, setCompanyToDelete] = useState(null);
//   //const [jobsForCompany, setJobsForCompany] = useState([]); // State to hold jobs data for a company
//   const navigate = useNavigate();
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.log("No token provided");
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(
//           `${baseURL}/api/company/getAllCompanyDetails`,
//           config
//         );

//         const updatedCompanies = await Promise.all(
//           response.data.map(async (company) => {
//             if (company.company_id) {
//               const logoPath = await fetchCompanyLogo(company.company_id);
//               return { ...company, company_logo: logoPath };
//             }
//             return company;
//           })
//         );

//         setCompanies(updatedCompanies);
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     fetchCompanies();
//   }, []);

//   const fetchCompanyLogo = async (companyId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token found");
//         return defaultLogo;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: "arraybuffer",
//       };

//       const response = await axios.get(
//         `${baseURL}/api/company/getCompanyLogo`,
//         {
//           params: {
//             company_id: companyId,
//           },
//           ...config,
//         }
//       );

//       const base64Image = btoa(
//         new Uint8Array(response.data).reduce(
//           (data, byte) => data + String.fromCharCode(byte),
//           ""
//         )
//       );

//       return `data:${response.headers["content-type"]};base64,${base64Image}`;
//     } catch (error) {
//       // console.error("Error fetching company logo:", error); 
//       return defaultLogo;
//     }
//   };

//   const handleViewAgents = async (companyId) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.post(
//         `${baseURL}/api/agent/getAgentByCompanyId`,
//         { companyId },
//         config
//       );

//       setAgents(response.data);
//     } catch (error) {
//       console.error("Error fetching agents:", error);
//       toast.error("Error fetching agents");
//     }
//   };

//   // const handleAddJob = (companyId) => {
//   //   setSelectedCompanyId(companyId);
//   //   navigate("/add-job");
//   // };

//   const handeleAddDrive = (companyId) => {
//     setSelectedCompanyId(companyId);
//     navigate('/add-drive')
//   }

//   const handleUpdateCompany = (companyId) => {
//     navigate(`/update-company/${companyId}`);
//   };

//   const handleShowDeleteModal = (companyId) => {
//     setCompanyToDelete(companyId);
//     setShowDeleteModal(true);
//   };

//   const handleCloseDeleteModal = () => {
//     setShowDeleteModal(false);
//     setCompanyToDelete(null);
//   };

//   const handleDeleteCompany = async () => {
//     if (!companyToDelete) return;

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         data: {
//           company_id: companyToDelete,
//         },
//       };

//       await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
//       toast.success("Company deleted successfully");

//       setCompanies((prevCompanies) =>
//         prevCompanies.filter(
//           (company) => company.company_id !== companyToDelete
//         )
//       );

//       handleCloseDeleteModal();
//     } catch (error) {
//       console.error("Error deleting company:", error);
//       toast.error("Error deleting company");
//     }
//   };

//   const handleEditClick = () => {
//     fileInputRef.current.click();
//   };

//   const handleImageUpload = async (event, companyId) => {
//     const file = event.target.files[0];

//     if (!file) {
//       console.error("No file selected");
//       return;
//     }

//     if (
//       file.size > 1024 * 1024 ||
//       !["image/jpeg", "image/png"].includes(file.type)
//     ) {
//       toast.error(
//         "Please upload an image of size less than 1 MB and in JPEG or PNG format"
//       );
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       const response = await axios.post(
//         `${baseURL}/api/company/uploadCompanyLogo?company_id=${companyId}`,
//         formData,
//         config
//       );

//       toast.success("Company logo uploaded successfully");
//       window.location.reload();
//     } catch (error) {
//       console.error("Error uploading company logo:", error);
//       toast.error("Error uploading company logo");
//     }
//   };

//   // const handleSelectCompany = (companyId) => {
//   //   navigate(`/view-jobs/${companyId}`);
//   // };

//   const handleViewDrives = (companyId) => {
//     navigate(`/view-drives/${companyId}`)
//   }
//   // const handleSelectCompany = async (companyId) => {
//   //   try {
//   //     const token = localStorage.getItem('token');
//   //     if (!token) {
//   //       console.log('No token found');
//   //       return;
//   //     }

//   //     const config = {
//   //       headers: {
//   //         Authorization: `Bearer ${token}`,
//   //       },
//   //     };

//   //     // Fetch jobs associated with the selected company using req.body
//   //     console.log("CompanyId", companyId);
//   //     const response = await axios.get(
//   //       `${baseURL}/api/job/getJobsBycompanyId`,
//   //       {
//   //         params: { company_id: companyId }, // Pass companyId as query parameter
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       }
//   //     );
//   //     console.log(response);
//   //     // Set the jobs data for the selected company
//   //     setJobsForCompany([response.data.job]);

//   //     // Navigate to the ViewJobs component with jobs data
//   //     navigate(`view-jobs/${companyId}`);
//   //   } catch (error) {
//   //     console.error('Error fetching jobs:', error);
//   //     toast.error('Failed to fetch jobs');
//   //   }
//   // };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">List of Companies</h2>
//       <table className="table table-striped table-hover">
//         <thead className="thead-dark">
//           <tr>
//             <th>Logo</th>
//             <th>Name</th>
//             <th>Description</th>
//             <th>Type</th>
//             <th>Address</th>
//             <th>Phone</th>
//             <th>Email</th>
//             <th>Agents</th>
//             <th>Options</th>
//           </tr>
//         </thead>
//         <tbody>
//           {companies.map((company) => (
//             <tr key={company.company_id}>
//               <td>
//                 <div className="edit-icon display-inline">
//                   <FontAwesomeIcon
//                     icon={faEdit}
//                     size="sm"
//                     onClick={handleEditClick}
//                     style={{
//                       cursor: "pointer",
//                       width: "20px",
//                       height: "20px",
//                       marginTop: "10px",
//                     }}
//                   />
//                   <input
//                     id="fileInput"
//                     type="file"
//                     accept="image/jpeg, image/png"
//                     style={{ display: "none" }}
//                     ref={fileInputRef}
//                     onChange={(e) => handleImageUpload(e, company.company_id)}
//                   />
//                 </div>
//                 <img
//                   src={company.company_logo || defaultLogo}
//                   alt="Company Logo"
//                   className="company-logo"
//                 />
//               </td>
//               <td>{company.name}</td>
//               <td>{company.description}</td>
//               <td>{company.type}</td>
//               <td>{company.address}</td>
//               <td>{company.phoneNumber}</td>
//               <td>{company.general_mail_id}</td>
//               <td>
//                 <ul>
//                   {agents
//                     .filter((agent) => agent.company_id === company.company_id)
//                     .map((agent) => (
//                       <li key={agent.agent_id}>
//                         {agent.name} - {agent.email} - {agent.contactNumber}
//                       </li>
//                     ))}
//                 </ul>
//               </td>
//               <td>
//                 <Dropdown>
//                   <Dropdown.Toggle variant="secondary" id="dropdown-basic">
//                     Manage &nbsp;
//                     <i className="fas fa-ellipsis-h"></i>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item
//                       onClick={() => handleViewAgents(company.company_id)}
//                     >
//                       View Agents
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handeleAddDrive(company.company_id)}
//                     >
//                       Add Drive
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handleUpdateCompany(company.company_id)}
//                     >
//                       Update Company
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handleShowDeleteModal(company.company_id)}
//                     >
//                       Delete Company
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handleViewDrives(company.company_id)}
//                     >
//                       View Drives
//                     </Dropdown.Item>
//                   </Dropdown.Menu>
//                 </Dropdown>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
//         <Modal.Header closeButton>
//           <Modal.Title>Confirm Delete</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>Are you sure you want to delete this company?</Modal.Body>
//         <Modal.Footer>
//           <Button variant="secondary" onClick={handleCloseDeleteModal}>
//             Cancel
//           </Button>
//           <Button variant="danger" onClick={handleDeleteCompany}>
//             Delete
//           </Button>
//         </Modal.Footer>
//       </Modal>
//     </div>
//   );
// };


const CompaniesList = ({ setSelectedCompanyId }) => {
  const [companies, setCompanies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const navigate = useNavigate();

  // Ref object to hold file input refs for each company
  const fileInputRefs = useRef({});

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
        };

        const response = await axios.get(
          `${baseURL}/api/company/getAllCompanyDetails`,
          config
        );

        const updatedCompanies = await Promise.all(
          response.data.map(async (company) => {
            if (company.company_id) {
              const logoPath = await fetchCompanyLogo(company.company_id);
              return { ...company, company_logo: logoPath };
            }
            return company;
          })
        );

        setCompanies(updatedCompanies);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  const fetchCompanyLogo = async (companyId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        console.log("No token found");
        return defaultLogo;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: "arraybuffer",
      };

      const response = await axios.get(
        `${baseURL}/api/company/getCompanyLogo`,
        {
          params: {
            company_id: companyId,
          },
          ...config,
        }
      );

      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          ""
        )
      );

      return `data:${response.headers["content-type"]};base64,${base64Image}`;
    } catch (error) {
      console.error("Error fetching company logo:", error);
      return defaultLogo;
    }
  };

  // const handleViewAgents = async (companyId) => {
  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No token found");
  //       return;
  //     }

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //     };

  //     const response = await axios.post(
  //       `${baseURL}/api/agent/getAgentByCompanyId`,
  //       { companyId },
  //       config
  //     );

  //     setAgents(response.data);
  //   } catch (error) {
  //     console.error("Error fetching agents:", error);
  //     toast.error("Error fetching agents");
  //   }
  // };

  const handleViewAgents = async (companyId) => {
    navigate(`/view-agents/${companyId}`)
  }

  const handeleAddDrive = (companyId) => {
    setSelectedCompanyId(companyId);
    navigate('/add-drive');
  };

  const handleUpdateCompany = (companyId) => {
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

  // const handleDeleteCompany = async () => {
  //   if (!companyToDelete) return;

  //   try {
  //     const token = localStorage.getItem("token");
  //     if (!token) {
  //       console.log("No token found");
  //       return;
  //     }

  //     const config = {
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //       },
  //       data: {
  //         company_id: companyToDelete,
  //       },
  //     };

  //     await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
  //     toast.success("Company deleted successfully");

  //     setCompanies((prevCompanies) =>
  //       prevCompanies.filter(
  //         (company) => company.company_id !== companyToDelete
  //       )
  //     );

  //     handleCloseDeleteModal();
  //   } catch (error) {
  //     console.error("Error deleting company:", error);
  //     toast.error("Error deleting company");
  //   }
  // };

  const handleEditClick = (companyId) => {
    if (fileInputRefs.current[companyId]) {
      fileInputRefs.current[companyId].click();
    } else {
      console.error(`File input ref not found for company ID ${companyId}`);
    }
  };

  const handleImageUpload = async (event, companyId) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    if (
      file.size > 1024 * 1024 ||
      !["image/jpeg", "image/png"].includes(file.type)
    ) {
      toast.error(
        "Please upload an image of size less than 1 MB and in JPEG or PNG format"
      );
      return;
    }

    const formData = new FormData();
    formData.append("image", file);

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
        `${baseURL}/api/company/uploadCompanyLogo?company_id=${companyId}`,
        formData,
        config
      );

      toast.success("Company logo uploaded successfully");

      // Update the company list with the new logo
      const updatedCompanies = await Promise.all(
        companies.map(async (company) => {
          if (company.company_id === companyId) {
            const logoPath = await fetchCompanyLogo(companyId);
            return { ...company, company_logo: logoPath };
          }
          return company;
        })
      );

      setCompanies(updatedCompanies);
    } catch (error) {
      console.error("Error uploading company logo:", error);
      toast.error("Error uploading company logo");
    }
  };

  const handleViewDrives = (companyId) => {
    navigate(`/view-drives/${companyId}`)
  }
  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">List of Companies</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Logo</th>
            <th>Name</th>
            <th>Description</th>
            {/* <th>Type</th> */}
            <th>Address</th>
            <th>Phone</th>
            <th>Email</th>
            {/* <th>Agents</th> */}
            <th>Options</th>
          </tr>
        </thead>
        <tbody>
          {companies.map((company) => (
            <tr key={company.company_id}>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src={company.company_logo || defaultLogo}
                    alt="Company Logo"
                    className="img-thumbnail"
                    style={{
                      width: '50px',
                      height: '50px',
                      borderRadius: '5%',
                      cursor: 'pointer',
                      marginRight: '10px'
                    }}
                    onClick={() => fileInputRefs.current[company.company_id].click()}
                  />
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="sm"
                    onClick={() => handleEditClick(company.company_id)}
                    className="text-primary"
                    style={{
                      cursor: 'pointer',
                      width: '15px',
                      height: '15px',
                      marginTop: '20%'
                    }}
                  />
                  <input
                    id={`fileInput-${company.company_id}`}
                    type="file"
                    accept="image/jpeg, image/png"
                    style={{ display: 'none' }}
                    ref={(el) => (fileInputRefs.current[company.company_id] = el)}
                    onChange={(e) => handleImageUpload(e, company.company_id)}
                  />
                </div>
              </td>
              <td>{company.name}</td>
              <td>{company.description}</td>
              {/* <td>{company.type}</td> */}
              <td>{company.address}</td>
              <td>{company.phoneNumber}</td>
              <td>{company.general_mail_id}</td>
              {/* <td>
                <ul>
                  {agents
                    .filter((agent) => agent.company_id === company.company_id)
                    .map((agent) => (
                      <li key={agent.agent_id}>
                        {agent.name} - {agent.email} - {agent.contactNumber}
                      </li>
                    ))}
                </ul>
              </td> */}
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Manage &nbsp;
                    <i className="fas fa-ellipsis-h"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleViewAgents(company.company_id)}
                    >
                      View Agents
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handeleAddDrive(company.company_id)}
                    >
                      Add Drive
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleUpdateCompany(company.company_id)}
                    >
                      Update Company
                    </Dropdown.Item>
                    {/* <Dropdown.Item
                      onClick={() => handleShowDeleteModal(company.company_id)}
                    >
                      Delete Company
                    </Dropdown.Item> */}
                    <Dropdown.Item
                      onClick={() => handleViewDrives(company.company_id)}
                    >
                      View Drives
                    </Dropdown.Item>
                  </Dropdown.Menu>
                </Dropdown>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* <Modal show={showDeleteModal} onHide={handleCloseDeleteModal}>
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
      </Modal> */}
    </div>
  );
};

export default CompaniesList;




