import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';

const SelectSkills = () => {
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [studentSkills, setStudentSkills] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const token = localStorage.getItem('token');
  if (!token) {
    console.error('No token found');
    return null;
  }

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // Function to fetch all skills
  const fetchSkills = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/skill/getAllSkills`, config);
      setSkills(response.data.skills); // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Handle error state or toast notification here
    }
  };

  // Function to fetch skills for the student
  const fetchStudentSkills = async () => {
    try {
      const response = await axios.get(`${baseURL}/api/skill/getAllSkillsForStudent`, config);
      setStudentSkills(response.data.skills); // Adjust according to your API response structure
    } catch (error) {
      console.error('Error fetching student skills:', error);
      // Handle error state or toast notification here
    }
  };

  useEffect(() => {
    fetchSkills();
    fetchStudentSkills();
  }, []); // Fetch skills on component mount

  // Function to handle checkbox selection
  const handleSkillToggle = (skillId) => {
    if (selectedSkills.includes(skillId)) {
      setSelectedSkills(selectedSkills.filter(id => id !== skillId));
    } else {
      setSelectedSkills([...selectedSkills, skillId]);
    }
  };

  // Function to submit selected skills
  const addSkillsToStudent = async () => {
    try {
      const response = await axios.post(`${baseURL}/api/auth/student/addSkillsToStudent`, {
        skill_ids: selectedSkills
      }, config);
      console.log('Skills added successfully:', response.data);
      // Display success toast notification or update UI as needed
      fetchStudentSkills(); // Refresh student skills after adding
      setShowModal(false); // Close the modal after adding skills
    } catch (error) {
      console.error('Error adding skills:', error);
      // Handle error state or toast notification here
    }
  };

  // Filter skills to exclude those already added to the student
  const availableSkills = skills.filter(skill =>
    !studentSkills.some(studentSkill => studentSkill.skill_id === skill.skill_id)
  );

  return (
    <div className="container mt-5">
      <h2>Select and add Skills</h2>
      <p>Based on your skills you will get drive info </p>
      <Button variant="primary" className='my-3' onClick={() => setShowModal(true)}>Select Skills</Button>
      {studentSkills.length === 0 ? (
        <p>You can select and add skills</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Skill Name</th>
            </tr>
          </thead>
          <tbody>
            {studentSkills.map(skill => (
              <tr key={skill.skill_id}>
                <td>{skill.name}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}


      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Select Skills</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {availableSkills.length === 0 ? (
            <p>No new skills available to add.</p>
          ) : (
            <form>
              <div className="row">
                {availableSkills.map(skill => (
                  <div key={skill.skill_id} className="col-lg-6 form-check">
                    <label className="form-check-label">
                      <input
                        type="checkbox"
                        className="form-check-input"
                        value={skill.skill_id}
                        checked={selectedSkills.includes(skill.skill_id)}
                        onChange={() => handleSkillToggle(skill.skill_id)}
                      />
                      {skill.name}
                    </label>
                  </div>
                ))}
              </div>
            </form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
          <Button variant="primary" onClick={addSkillsToStudent} disabled={availableSkills.length === 0}>Add Skills</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SelectSkills;
