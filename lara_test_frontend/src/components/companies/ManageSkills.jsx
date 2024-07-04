import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../config";

const ManageSkills = ({ onSelectSkill }) => {
  const [skills, setSkills] = useState([]);
  const [newSkillName, setNewSkillName] = useState("");

  useEffect(() => {
    fetchSkills();
  }, []);

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

  const handleAddSkill = async () => {
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

      const response = await axios.post(
        `${baseURL}/api/skill/saveSkill`,
        { name: newSkillName },
        config
      );

      const newSkill = response.data.skill;
      setSkills([...skills, newSkill]);
      setNewSkillName("");
      // onSelectSkill(newSkill.skill_id); // Optional: Select the newly added skill
    } catch (error) {
      console.error("Failed to add skill", error);
    }
  };

  const handleRemoveSkill = async (skillId) => {
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
        data: { skill_id: skillId },
      };

      await axios.delete(`${baseURL}/api/skill/removeSkill`, config);

      setSkills(skills.filter((skill) => skill.skill_id !== skillId));
    } catch (error) {
      console.error("Failed to remove skill", error);
    }
  };

  return (
    <div className="container">
  <div className="row">
    <div className="col-md-6 offset-md-3">
      <div className="card mt-4">
        <h3 className="card-header">Manage Skills</h3>
        <div className="card-body">
          <div className="mb-3">
            <input
              type="text"
              value={newSkillName}
              onChange={(e) => setNewSkillName(e.target.value)}
              placeholder="Enter new skill name"
              className="form-control"
            />
          </div>
          <button onClick={handleAddSkill} className="btn btn-primary mb-3">Add Skill</button>
          <ul className="list-group">
            {skills.map((skill) => (
              <li key={skill.skill_id} className="list-group-item d-flex justify-content-between align-items-center">
                {skill.name}
                <button onClick={() => handleRemoveSkill(skill.skill_id)} className="btn btn-danger">Remove</button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
</div>

  );
};

export default ManageSkills;
