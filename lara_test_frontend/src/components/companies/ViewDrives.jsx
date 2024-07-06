import React, { useEffect, useState } from "react";
import { baseURL } from "../config";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import AnyCompanyLogo from "../admin/AnyCompanyLogo";
import CompanyDetails from "./CompanyDetails";

// function ViewDrives() {
//   const [drives, setDrives] = useState([]);
//   const {company_id} = useParams();
  
//   useEffect(() => {
//     const fetchJobs = async () => {
//       try {
//         const token = localStorage.getItem('token');
//         if (!token) {
//           console.log('No token found');
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(
//           `${baseURL}/api/drive/getDrivesByCompanyId`,
//           {
//             params: { company_id },
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         console.log(response.data.drives);
//         setDrives(response.data.drives);
//       } catch (error) {
//         console.error('Error fetching jobs:', error);
//         toast.error('Failed to fetch jobs');
//       }
//     };

//     fetchJobs();
//   }, [company_id]);
  
//     return (
//     <>
//         <div className="container mt-5">
//       <h2 className="text-center mb-4">Jobs for the Company</h2>
//       <table className="table table-striped table-hover">
//         <thead className="thead-dark">
//           <tr>
//             <th>Location</th>
//             <th>Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {drives.map((drive) => (
//             <tr key={drive.drive_id}>
//               <td>{drive.drive_location}</td>
//               <td>{drive.drive_date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
  
//     </>
//     );
// }

function ViewDrives() {
  const [drives, setDrives] = useState([]);
  const { company_id } = useParams();
  // const [company, setCompany] = useState(null);

  useEffect(() => {
    const fetchDrives = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token found');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/drive/getDrivesByCompanyId`,
          {
            params: { company_id },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setDrives(response.data.drives);
      } catch (error) {
        console.error('Error fetching drives:', error);
        toast.error('Failed to fetch drives');
      }
    };

    fetchDrives();
    // fetchCompanyDetails();
  }, [company_id]);

//   const fetchCompanyDetails = async () => {
//     try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//             console.log("No token found");
//             return;
//         }

//         const config = {
//             headers: {
//                 Authorization: `Bearer ${token}`,
//             },
//         };

//         const companyResponse = await axios.get(
//             `${baseURL}/api/company/company/${company_id}`,
//             config
//         );

//         setCompany(companyResponse.data);
//     } catch (error) {
//         console.error("Error fetching company details:", error);
//     }
// };
  return (
    <div className="container mt-5">
      <CompanyDetails   companyId={company_id}/>
        {/* {company && (
        <div className="mb-4">
          <h2 className="text-center mb-4">
             Drives of {company.name} 
          </h2>
          <div className="row">
          <div className="col-lg-12 col-sm-12">
          <p>
             <AnyCompanyLogo companyId={company.company_id} style={{ width: '50px', height: '50px', borderRadius:'5%', margin:'10px'}} /> 
              {company.name} 
          </p>
          </div>
          <div className="col-lg-6 col-sm-12">
          <p><strong>Address:</strong> {company.address}</p>
          </div>
          <div className="col-lg-6 col-sm-12">
          <p><strong>Email:</strong> {company.general_mail_id}</p>
          </div>

          </div>
          
        </div>
      )} */}
      {/* <h2 className="text-center mb-4">Drives for the Company</h2> */}
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Location</th>
            <th>Date</th>
            <th>Time</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {drives.map((drive) => (
            <tr key={drive.drive_id}>
              <td>{drive.drive_location}</td>
              <td>{drive.drive_date}</td>
              <td>{drive.drive_time}</td>
              <td>
                <Link to={`/drives/${drive.drive_id}/jobs`} className="btn btn-primary me-3">View Jobs</Link>
                <Link to={`/drives/${drive.drive_id}/add-job`} className="btn btn-secondary ml-2">Add Job</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ViewDrives;


