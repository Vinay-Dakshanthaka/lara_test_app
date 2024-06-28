import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Modal, Form } from "react-bootstrap";

const DriveList = ({ jobId }) => {
  const [drives, setDrives] = useState([]);
  const [showAddDriveModal, setShowAddDriveModal] = useState(false);
  const [newDrive, setNewDrive] = useState({ date: "", location: "" });
  const baseURL = "your_api_base_url"; // replace with your API base URL

  useEffect(() => {
    const fetchDrives = async () => {
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
          `${baseURL}/api/drive/getDrivesByJobId`,
          {
            params: { jobId },
            ...config,
          }
        );

        setDrives(response.data);
      } catch (error) {
        console.error("Error fetching drives:", error);
      }
    };

    fetchDrives();
  }, [jobId]);

  const handleAddDrive = async () => {
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

      const response = await axios.post(
        `${baseURL}/api/drive/addDrive`,
        { ...newDrive, jobId },
        config
      );

      setDrives([...drives, response.data]);
      setShowAddDriveModal(false);
      setNewDrive({ date: "", location: "" });
    } catch (error) {
      console.error("Error adding drive:", error);
    }
  };

  return (
    <div>
      <h3>Drives for Job ID: {jobId}</h3>
      <Button onClick={() => setShowAddDriveModal(true)}>Add Drive</Button>
      <ul>
        {drives.map((drive) => (
          <li key={drive.drive_id}>
            {drive.date} - {drive.location}
          </li>
        ))}
      </ul>

      <Modal show={showAddDriveModal} onHide={() => setShowAddDriveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Drive</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Drive Date</Form.Label>
              <Form.Control
                type="date"
                value={newDrive.date}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, date: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group>
              <Form.Label>Drive Location</Form.Label>
              <Form.Control
                type="text"
                value={newDrive.location}
                onChange={(e) =>
                  setNewDrive({ ...newDrive, location: e.target.value })
                }
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAddDriveModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleAddDrive}>
            Add Drive
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DriveList;
