import React, { useEffect, useState } from 'react';
import { ToastContainer } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { baseURL } from '../config';
import axios from 'axios';
import { useParams } from 'react-router-dom';

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
      toast.success('Job added successfuly!')

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
      toast.error('Something went wrong!!')
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
    <div className="container mt-5">
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
  <ToastContainer />
</div>

  );
};

export default AddJobs;