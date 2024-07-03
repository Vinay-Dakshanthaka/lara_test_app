import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { baseURL } from '../config';
import axios from 'axios';
import { useParams } from 'react-router-dom';

// const AddJobs = ({ selectedCompanyId }) => {
//   console.log("CompanyId", selectedCompanyId);
//     const [jobData, setJobData] = useState({
//         company_id: selectedCompanyId,
//         job_title: '',
//         position: '',
//         job_description: '',
//         job_location: '',
//         no_of_openings: '',
//         drive_date: '',
//         drive_location:''
//     });

//     const handleChange = (e) => {
//         setJobData({ ...jobData, [e.target.name]: e.target.value });
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
//         try {
//             const token = localStorage.getItem('token');
//             if (!token) {
//                 console.log('No token found');
//                 return;
//             }

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };

//             const response = await axios.post(
//                 `${baseURL}/api/drive/saveDrive`,
//                 jobData,
//                 config
//             );
//             toast.success('Job added successfully');
//         } catch (error) {
//             console.error('Error adding job:', error);
//             toast.error('Failed to add job');
//         }
//     };

//     return (
//         <div className="container mt-5">
//             <h2 className="text-center mb-4">Add Job</h2>
//             <form onSubmit={handleSubmit}>
//                 <div className="form-group">
//                     <label>Job Title</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="job_title"
//                         value={jobData.job_title}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Position</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="position"
//                         value={jobData.position}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Openings</label>
//                     <input
//                         type="number"
//                         className="form-control"
//                         name="no_of_openings"
//                         value={jobData.no_of_openings}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Job Description</label>
//                     <textarea
//                         className="form-control"
//                         name="job_description"
//                         value={jobData.job_description}
//                         onChange={handleChange}
//                         rows="3"
//                         required
//                     ></textarea>
//                 </div>
//                 <div className="form-group">
//                     <label>Job Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="job_location"
//                         value={jobData.job_location}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Drive Date</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="drive_date"
//                         value={jobData.drive_date}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <div className="form-group">
//                     <label>Drive Location</label>
//                     <input
//                         type="text"
//                         className="form-control"
//                         name="drive_location"
//                         value={jobData.drive_location}
//                         onChange={handleChange}
//                         required
//                     />
//                 </div>
//                 <button type="submit" className="btn btn-primary">
//                     Add Job
//                 </button>
//             </form>
//         </div>
//     );
// };

// export default AddJobs;

// function AddJob() {
//   const { job_id } = useParams();
//   const [job, setJob] = useState({
//     job_title: "",
//     description: "",
//     job_location: "",
//     no_of_openings: "",
//     year_of_exp: "",
//     position: "",
//     total_rounds: ""
//   });
//   const [skills, setSkills] = useState([]);
//   const [availableSkills, setAvailableSkills] = useState([]);
//   const [selectedSkill, setSelectedSkill] = useState("");

//   useEffect(() => {
//     // Fetch job details
//     const fetchJobDetails = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(`${baseURL}/api/jobs/${job_id}`, config);
//         setJob(response.data.job);
//       } catch (error) {
//         console.error("Error fetching job details:", error);
//         toast.error("Failed to fetch job details");
//       }
//     };

//     // Fetch available skills
//     const fetchAvailableSkills = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(`${baseURL}/api/skills`, config);
//         setAvailableSkills(response.data.skills);
//       } catch (error) {
//         console.error("Error fetching available skills:", error);
//         toast.error("Failed to fetch available skills");
//       }
//     };

//     fetchJobDetails();
//     fetchAvailableSkills();
//   }, [job_id]);

//   useEffect(() => {
//     // Fetch skills associated with the job
//     const fetchJobSkills = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.error("No token found");
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(`${baseURL}/api/jobs/${job_id}/skills`, config);
//         setSkills(response.data.skills);
//       } catch (error) {
//         console.error("Error fetching job skills:", error);
//         toast.error("Failed to fetch job skills");
//       }
//     };

//     fetchJobSkills();
//   }, [job_id]);

//   const handleAddSkillToJob = async () => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       };

//       await axios.post(
//         `${baseURL}/api/jobs/${job_id}/addSkill`,
//         { skill_id: selectedSkill },
//         config
//       );

//       toast.success("Skill added to job successfully");
//       setSelectedSkill("");
//       // Refresh skills associated with the job
//       const response = await axios.get(`${baseURL}/api/jobs/${job_id}/skills`, config);
//       setSkills(response.data.skills);
//     } catch (error) {
//       console.error("Error adding skill to job:", error);
//       toast.error("Failed to add skill to job");
//     }
//   };

//   const handleRemoveSkillFromJob = async (skill_id) => {
//     try {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//         data: { skill_id },
//       };

//       await axios.delete(`${baseURL}/api/jobs/${job_id}/removeSkill`, config);

//       toast.success("Skill removed from job successfully");
//       // Refresh skills associated with the job
//       const response = await axios.get(`${baseURL}/api/jobs/${job_id}/skills`, config);
//       setSkills(response.data.skills);
//     } catch (error) {
//       console.error("Error removing skill from job:", error);
//       toast.error("Failed to remove skill from job");
//     }
//   };

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Manage Job Skills</h2>
//       <div className="row">
//         <div className="col-md-6">
//           <h4>Job Details</h4>
//           <ul>
//             <li>Job Title: {job.job_title}</li>
//             <li>Description: {job.description}</li>
//             <li>Location: {job.job_location}</li>
//             <li>No. of Openings: {job.no_of_openings}</li>
//             <li>Years of Experience: {job.year_of_exp}</li>
//             <li>Position: {job.position}</li>
//             <li>Total Rounds: {job.total_rounds}</li>
//           </ul>
//         </div>
//         <div className="col-md-6">
//           <h4>Add Skills to Job</h4>
//           <div className="input-group mb-3">
//             <select
//               className="custom-select"
//               value={selectedSkill}
//               onChange={(e) => setSelectedSkill(e.target.value)}
//             >
//               <option value="">Select Skill</option>
//               {availableSkills.map((skill) => (
//                 <option key={skill.id} value={skill.id}>
//                   {skill.name}
//                 </option>
//               ))}
//             </select>
//             <div className="input-group-append">
//               <button
//                 className="btn btn-primary"
//                 type="button"
//                 onClick={handleAddSkillToJob}
//               >
//                 Add Skill
//               </button>
//             </div>
//           </div>
//           <h4>Skills Associated with Job</h4>
//           <ul className="list-group">
//             {skills.map((skill) => (
//               <li
//                 key={skill.id}
//                 className="list-group-item d-flex justify-content-between align-items-center"
//               >
//                 {skill.name}
//                 <button
//                   className="btn btn-danger btn-sm"
//                   onClick={() => handleRemoveSkillFromJob(skill.id)}
//                 >
//                   Remove
//                 </button>
//               </li>
//             ))}
//           </ul>
//         </div>
//       </div>
//     </div>
//   );
// }


import ManageSkills from "./ManageSkills";

const AddJobs = () => {
  const { drive_id } = useParams();
  console.log("drive_id", drive_id);
  const [job, setJob] = useState({
    job_title: "",
    description: "",
    job_location: "",
    no_of_openings: "",
    year_of_exp: "",
    position: "",
    total_rounds: "",
  });

  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);

  useEffect(() => {
    const fetchSkills = async () => {
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

        const response = await axios.get(`${baseURL}/api/skill/getAllSkills`, config);
        setSkills(response.data.skills);
      } catch (error) {
        console.error("Failed to fetch skills", error);
      }
    };

    fetchSkills();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setJob({
      ...job,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
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

      // Submit job details to create the job
      const response = await axios.post(
        `${baseURL}/api/job/saveJob`,
        { drive_id, ...job },
        config
      );
      const { data } = response;
      console.log("Job added successfully:", data);

      // Associate selected skills with the job using Job_Skill table
      console.log("skill_ids", selectedSkills);
      console.log("job_id", data.job.job_id);
      await axios.post(
        `${baseURL}/api/job/addSkillsToJob`,
        { job_id: data.job.job_id, skill_ids: selectedSkills },
        config
      );

      // Clear form state or navigate to job list page
      setJob({
        job_title: "",
        description: "",
        job_location: "",
        no_of_openings: "",
        year_of_exp: "",
        position: "",
        total_rounds: "",
      });
      setSelectedSkills([]);
    } catch (error) {
      console.error("Failed to add job or skills", error);
    }
  };

  const handleSkillChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setSelectedSkills([...selectedSkills, Number(value)]);
    } else {
      setSelectedSkills(selectedSkills.filter((skillId) => skillId !== Number(value)));
    }
  };

  const handleGlobalSkillSelect = (skillId) => {
    setSelectedSkills([...selectedSkills, skillId]);
  };

  return (
    <div className="container">
  <div className="row">
    <div className="col-md-8 offset-md-2">
      <h2>Add Job</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="job_title" className="form-label">Job Title</label>
          <input
            type="text"
            id="job_title"
            name="job_title"
            value={job.job_title}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="description" className="form-label">Description</label>
          <textarea
            id="description"
            name="description"
            value={job.description}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="job_location" className="form-label">Job Location</label>
          <input
            type="text"
            id="job_location"
            name="job_location"
            value={job.job_location}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="no_of_openings" className="form-label">Number of Openings</label>
          <input
            type="number"
            id="no_of_openings"
            name="no_of_openings"
            value={job.no_of_openings}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="year_of_exp" className="form-label">Years of Experience Required</label>
          <input
            type="text"
            id="year_of_exp"
            name="year_of_exp"
            value={job.year_of_exp}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="position" className="form-label">Position</label>
          <input
            type="text"
            id="position"
            name="position"
            value={job.position}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="total_rounds" className="form-label">Total Rounds</label>
          <input
            type="number"
            id="total_rounds"
            name="total_rounds"
            value={job.total_rounds}
            onChange={handleChange}
            className="form-control"
          />
        </div>

        <div className="mb-3">
          <h3>Skills</h3>
          {skills.map((skill) => (
            <div className="form-check" key={skill.skill_id}>
              <input
                type="checkbox"
                id={`skill_${skill.skill_id}`}
                name={`skills`}
                value={skill.skill_id}
                checked={selectedSkills.includes(skill.skill_id)}
                onChange={handleSkillChange}
                className="form-check-input"
              />
              <label htmlFor={`skill_${skill.skill_id}`} className="form-check-label">{skill.name}</label>
            </div>
          ))}
        </div>

        <div className="mb-3">
          <ManageSkills onSelectSkill={handleGlobalSkillSelect} />
        </div>

        <button type="submit" className="btn btn-primary">Save Job</button>
      </form>
    </div>
  </div>
</div>

  );
};

export default AddJobs;
