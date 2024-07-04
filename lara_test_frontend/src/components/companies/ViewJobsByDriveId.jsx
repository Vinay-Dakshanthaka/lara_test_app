import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Spinner } from "react-bootstrap";

function ViewJobsByDriveId() {
  const [jobs, setJobs] = useState([]);
  const [noJobs, setNoJobs] = useState(false);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const { drive_id } = useParams();
  console.log("drive_id", drive_id);

  useEffect(() => {
    const fetchJobs = async () => {
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

        const response = await axios.get(
          `${baseURL}/api/job/getJobDetailsByDriveId?drive_id=${drive_id}`,
          config
        );
        console.log('response ++ ', response);
        if (response.status === 200) {
          setJobs(response.data.jobs);
          setNoJobs(response.data.jobs.length === 0);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        if (error.response && error.response.status === 404) {
          setNoJobs(true);
        } else {
          toast.error("Failed to fetch jobs");
        }
      }
    };

    fetchJobs();
  }, [drive_id]);

  const fetchStudentsForJob = async (job_id) => {
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
        `${baseURL}/api/job/getStudentsForJobWithSkills`,
        { job_id },
        config
      );

      if (response.status === 200) {
        setStudents(response.data.student);
        setSelectedJobId(job_id); // Set the selected job ID
        toast.success("Students fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    }
  };

  const handleStudentSelect = (student_id) => {
    setSelectedStudents((prevSelected) =>
      prevSelected.includes(student_id)
        ? prevSelected.filter((id) => id !== student_id)
        : [...prevSelected, student_id]
    );
  };

  const handleSelectAllStudents = () => {
    if (selectedStudents.length === students.length) {
      setSelectedStudents([]);
    } else {
      setSelectedStudents(students.map((student) => student.student_id));
    }
  };

  const handleSendEmail = async () => {
    setIsSendingEmail(true);
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
        `${baseURL}/api/job/sendDriveToStudents`,
        {
          student_ids: selectedStudents,
          job_id: selectedJobId,
          subject: emailSubject,
          mail_body: emailBody,
        },
        config
      );

      if (response.status === 200) {
        toast.success("Email sent successfully");
        setShowModal(false);
        setEmailSubject("");
        setEmailBody("");
        setSelectedStudents([]);
      }
    } catch (error) {
      console.error("Error sending email:", error);
      toast.error("Failed to send email");
    } finally {
      setIsSendingEmail(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Jobs for the Drive</h2>
      {noJobs ? (
        <div className="alert alert-info" role="alert">
          No job added for the drive, please add a job.
        </div>
      ) : (
        <>
          <table className="table table-striped table-hover">
            <thead className="thead-dark">
              <tr>
                <th>Title</th>
                <th>No. of Openings</th>
                <th>Position</th>
                <th>Location</th>
                <th>Skills</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map((job) => (
                <tr key={job.job_id}>
                  <td>{job.job_title}</td>
                  <td>{job.no_of_openings}</td>
                  <td>{job.position}</td>
                  <td>{job.job_location}</td>
                  <td>
                    <ul>
                      {job.skills.map((skill, index) => (
                        <li key={index}>{skill}</li>
                      ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => fetchStudentsForJob(job.job_id)}
                    >
                      Fetch Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-center mb-4">Matching Students</h2>
          {students.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No matching students found.
            </div>
          ) : (
            <table className="table table-striped table-hover">
              <thead className="thead-dark">
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      checked={selectedStudents.length === students.length}
                      onChange={handleSelectAllStudents}
                    />
                  </th>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone Number</th>
                  <th>Image</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedStudents.includes(student.student_id)}
                        onChange={() => handleStudentSelect(student.student_id)}
                      />
                    </td>
                    <td>{student.name}</td>
                    <td>{student.email}</td>
                    <td>{student.phoneNumber}</td>
                    <td>
                      {student.imagePath ? (
                        <img
                          src={`${baseURL}/${student.imagePath}`}
                          alt="Student"
                          width="50"
                          height="50"
                        />
                      ) : (
                        "No Image"
                      )}
                    </td>
                    <td>{student.role}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
          <button
            className="btn btn-success"
            disabled={selectedStudents.length === 0}
            onClick={() => setShowModal(true)}
          >
            Send Email to Selected Students
          </button>
        </>
      )}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter subject"
                value={emailSubject}
                onChange={(e) => setEmailSubject(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formBody">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter message"
                value={emailBody}
                onChange={(e) => setEmailBody(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={handleSendEmail}
            disabled={isSendingEmail}
          >
            {isSendingEmail ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                />{" "}
                Sending Email...
              </>
            ) : (
              "Send Email"
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ViewJobsByDriveId;
