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
import defaultLogo from './DefaultComapnyImage.jpg'


// const CompaniesList = () => {
//   const [companies, setCompanies] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [companyToDelete, setCompanyToDelete] = useState(null);
//   const navigate = useNavigate();
//   const [imageFile, setImageFile] = useState(null);
//   const [defaultLogo, setDefaultLogo] = useState(""); // State to store default logo URL
//   const [image, setImage] = useState(defaultCompanyLogo);
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token Provided");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       try {
//         const response = await axios.get(
//           `${baseURL}/api/company/getAllCompanyDetails`,
//           config
//         );
//         setCompanies(response.data);
//         // Assuming response.data includes the default logo URL for each company
//         setDefaultLogo(response.data.map(company => company.compnay_logo));
//       } catch (error) {
//         console.error("Error fetching companies:", error);
//       }
//     };

//     const fetchProfileImage = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.log("No token found");
//           return;
//         }
//         const response = await axios.get(`${baseURL}/api/auth/student/getProfileImage`, {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//           responseType: 'arraybuffer', // Receive the image as a buffer
//         });

//         // Convert the received image data to Base64
//         const base64Image = btoa(
//           new Uint8Array(response.data).reduce(
//             (data, byte) => data + String.fromCharCode(byte),
//             '',
//           ),
//         );

//         // Set the image data to state
//         setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
//       } catch (error) {
//         console.error('Error fetching profile image:', error);
//       }
//     };

//     fetchCompanies();
//     fetchProfileImage();
//   }, []);

//   const handleViewAgents = async (companyId) => {
//     console.log("Viewing agents for company with ID:", companyId);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.log("Token does not exist");
//       return;
//     }
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     try {
//       const response = await axios.post(
//         `${baseURL}/api/agent/getAgentByCompanyId`,
//         { companyId },
//         config
//       );
//       setAgents(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//       toast.error("Error fetching Agents");
//     }
//   };

//   const handleAddAgent = (companyId) => {
//     console.log("Adding agent for company with ID:", companyId);
//     navigate(`/add-company-agent`);
//   };

//   const handleUpdateCompany = (companyId) => {
//     console.log("Updating company with ID:", companyId);
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

//     console.log("Deleting company with ID:", companyToDelete);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.log("Token does not exist");
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
//     try {
//       await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
//       toast.success("Company deleted successfully");
//       setCompanies(
//         companies.filter((company) => company.company_id !== companyToDelete)
//       );
//       handleCloseDeleteModal();
//     } catch (error) {
//       console.error("Error deleting company:", error);
//       toast.error("Error deleting company");
//     }
//   };

//   const handleEditClick = () => {
//     fileInputRef.current.click();
//   }

//   const handleImageUpload = async (event, companyId) => {
//     const file = event.target.files[0];
//     setImageFile(file);
//     console.log(imageFile);

//     if(imageFile.size > 1024 * 1024 || !['image/jpeg', 'image/png'].includes(imageFile.type)){
//       toast.error("Please upload an image of size less than 1 MB");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", imageFile);

//     try {
//       const token = localStorage.getItem('token');
//       if(!token){
//         console.log("No token found");
//         return;
//       }
//       const config = {
//         headers : {
//           Authorization: `Bearer ${token}`
//         }
//       }
//       const response = await axios.post(`${baseURL}/api/company/uploadCompanyLogo?company_id=${companyId}`, formData, config);
//       setImage(response.data.imagePath);
//       window.location.reload();
//     } catch (error) {
//       console.error("Error uploading profile image:", error);
//     }
//   };

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
//           {companies.map((company, index) => (
//             <tr key={company.company_id}>
//               <td>
//                 <div className="edit-icon display-inline">
//                   <img
//                     src={image || image[index]} // Assuming defaultLogo is an array of URLs
//                     alt="Company Logo"
//                     style={{ width: "50px", height: "50px", marginRight: "10px" }}
//                   />
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
//                     onChange={(event) => handleImageUpload(event, company.company_id)}
//                   />
//                 </div>
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
//                     Manage &nbsp;<i className="fas fa-ellipsis-h"></i>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item
//                       onClick={() => handleViewAgents(company.company_id)}
//                     >
//                       View Agents
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handleAddAgent(company.company_id)}
//                     >
//                       Add Agent
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







// const CompaniesList = () => {
//   const [companies, setCompanies] = useState([]);
//   const [agents, setAgents] = useState([]);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
//   const [companyToDelete, setCompanyToDelete] = useState(null);
//   const navigate = useNavigate();
//   const [imageFile, setImageFile] = useState(null);
//   const [defaultLogo, setDefaultLogo] = useState(""); // State for default logo path
//   const fileInputRef = useRef(null);

//   useEffect(() => {
//     const fetchCompanies = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.log("No token Provided");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       try {
//         const response = await axios.get(
//           `${baseURL}/api/company/getAllCompanyDetails`,
//           config
//         );
//         setCompanies(response.data);

//         // Fetch default logo path from local system or use a placeholder
//         // Replace this with your actual logic to fetch or set default logo path
//         // const defaultLogoPath = defaultLogo // Example placeholder
//         setDefaultLogo(defaultLogo);

//         // Fetch logos for each company
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
//         console.log("Token does not exist");
//         return defaultLogo; // Fallback to default logo path if token is not present
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         responseType: 'arraybuffer', // Receive the image as a buffer
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

//       // Convert the received image data to Base64
//       const base64Image = btoa(
//         new Uint8Array(response.data).reduce(
//           (data, byte) => data + String.fromCharCode(byte),
//           '',
//         ),
//       );

//       return `data:${response.headers['content-type']};base64,${base64Image}`;
//     } catch (error) {
//       console.error("Error fetching company logo:", error);
//       toast.error("Error fetching company logo");
//       return defaultLogo; // Fallback to default logo path on error
//     }
//   };

//   const handleViewAgents = async (companyId) => {
//     console.log("Viewing agents for company with ID:", companyId);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.log("Token does not exist");
//       return;
//     }
//     const config = {
//       headers: {
//         Authorization: `Bearer ${token}`,
//       },
//     };
//     try {
//       const response = await axios.post(
//         `${baseURL}/api/agent/getAgentByCompanyId`,
//         { companyId },
//         config
//       );
//       setAgents(response.data);
//       console.log(response.data);
//     } catch (error) {
//       console.log(error);
//       toast.error("Error fetching Agents");
//     }
//   };

//   const handleAddAgent = (companyId) => {
//     console.log("Adding agent for company with ID:", companyId);
//     navigate(`/add-company-agent`);
//   };

//   const handleUpdateCompany = (companyId) => {
//     console.log("Updating company with ID:", companyId);
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

//     console.log("Deleting company with ID:", companyToDelete);
//     const token = localStorage.getItem("token");
//     if (!token) {
//       console.log("Token does not exist");
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
//     try {
//       await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
//       toast.success("Company deleted successfully");
//       setCompanies(
//         companies.filter((company) => company.company_id !== companyToDelete)
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
//     setImageFile(file);

//     if (imageFile.size > 1024 * 1024 || !["image/jpeg", "image/png"].includes(imageFile.type)) {
//       toast.error("Please upload an image of size less than 1 MB");
//       return;
//     }

//     const formData = new FormData();
//     formData.append("image", imageFile);

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
//       window.location.reload(); // Refresh page to reflect changes
//     } catch (error) {
//       console.error("Error uploading company logo:", error);
//       toast.error("Error uploading company logo");
//     }
//   };

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
//                   src={company.company_logo ? company.company_logo : defaultLogo}
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
//                     Manage &nbsp;<i className="fas fa-ellipsis-h"></i>
//                   </Dropdown.Toggle>
//                   <Dropdown.Menu>
//                     <Dropdown.Item
//                       onClick={() => handleViewAgents(company.company_id)}
//                     >
//                       View Agents
//                     </Dropdown.Item>
//                     <Dropdown.Item
//                       onClick={() => handleAddAgent(company.company_id)}
//                     >
//                       Add Agent
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


const CompaniesList = () => {
  const [companies, setCompanies] = useState([]);
  const [agents, setAgents] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

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
        
        // Fetch default logo path or use placeholder
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
        return defaultLogo; // Fallback to default logo path if token is not present
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'arraybuffer', // Receive the image as a buffer
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

      // Convert the received image data to Base64
      const base64Image = btoa(
        new Uint8Array(response.data).reduce(
          (data, byte) => data + String.fromCharCode(byte),
          '',
        ),
      );

      return `data:${response.headers['content-type']};base64,${base64Image}`;
    } catch (error) {
      console.error("Error fetching company logo:", error);
      toast.error("Error fetching company logo");
      return defaultLogo; // Fallback to default logo path on error
    }
  };

  const handleViewAgents = async (companyId) => {
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
        { companyId },
        config
      );

      setAgents(response.data);
    } catch (error) {
      console.error("Error fetching agents:", error);
      toast.error("Error fetching agents");
    }
  };

  const handleAddAgent = (companyId) => {
    navigate(`/add-company-agent`);
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

  const handleDeleteCompany = async () => {
    if (!companyToDelete) return;

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
        data: {
          company_id: companyToDelete,
        },
      };

      await axios.delete(`${baseURL}/api/company/deleteCompany`, config);
      toast.success("Company deleted successfully");

      setCompanies((prevCompanies) =>
        prevCompanies.filter((company) => company.company_id !== companyToDelete)
      );

      handleCloseDeleteModal();
    } catch (error) {
      console.error("Error deleting company:", error);
      toast.error("Error deleting company");
    }
  };

  const handleEditClick = () => {
    fileInputRef.current.click();
  };

  const handleImageUpload = async (event, companyId) => {
    const file = event.target.files[0];

    if (!file) {
      console.error("No file selected");
      return;
    }

    if (file.size > 1024 * 1024 || !["image/jpeg", "image/png"].includes(file.type)) {
      toast.error("Please upload an image of size less than 1 MB and in JPEG or PNG format");
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
      window.location.reload(); // Refresh page to reflect changes
    } catch (error) {
      console.error("Error uploading company logo:", error);
      toast.error("Error uploading company logo");
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
                <div className="edit-icon display-inline">
                  <FontAwesomeIcon
                    icon={faEdit}
                    size="sm"
                    onClick={handleEditClick}
                    style={{
                      cursor: "pointer",
                      width: "20px",
                      height: "20px",
                      marginTop: "10px",
                    }}
                  />
                  <input
                    id="fileInput"
                    type="file"
                    accept="image/jpeg, image/png"
                    style={{ display: "none" }}
                    ref={fileInputRef}
                    onChange={(e) => handleImageUpload(e, company.company_id)}
                  />
                </div>
                <img
                  src={company.company_logo || defaultLogo}
                  alt="Company Logo"
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
                      <li key={agent.agent_id}>
                        {agent.name} - {agent.email} - {agent.contactNumber}
                      </li>
                    ))}
                </ul>
              </td>
              <td>
                <Dropdown>
                  <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                    Manage &nbsp;<i className="fas fa-ellipsis-h"></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item
                      onClick={() => handleViewAgents(company.company_id)}
                    >
                      View Agents
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleAddAgent(company.company_id)}
                    >
                      Add Agent
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleUpdateCompany(company.company_id)}
                    >
                      Update Company
                    </Dropdown.Item>
                    <Dropdown.Item
                      onClick={() => handleShowDeleteModal(company.company_id)}
                    >
                      Delete Company
                    </Dropdown.Item>
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

