import React, { useEffect, useState } from "react";
import { baseURL } from "../config";
import { Link, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";

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
  }, [company_id]);

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Drives for the Company</h2>
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
                <Link to={`/drives/${drive.drive_id}/jobs`} className="btn btn-primary">View Jobs</Link>
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


