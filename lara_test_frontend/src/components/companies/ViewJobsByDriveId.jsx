import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import AnyProfileImage from "../admin/AnyProfileImage";

const ViewJobsByDriveId = () => {
  const [jobs, setJobs] = useState([]);
  const [noJobs, setNoJobs] = useState(false);
  const [students, setStudents] = useState([]);
  const [profiles, setProfiles] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [selectedJobId, setSelectedJobId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [emailSubject, setEmailSubject] = useState("");
  const [emailBody, setEmailBody] = useState("");
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [searchFilters, setSearchFilters] = useState({
    name: true,
    email: true,
    specialization: true,
    highestEducation: true,
    yearOfPassout: true,
  });
  const [loading, setLoading] = useState(false);
  const { drive_id } = useParams();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        setLoading(true);
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
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [drive_id]);

  const fetchStudentsForJob = async (job_id) => {
    try {
      setLoading(true);
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
        setStudents(response.data.students);
        setProfiles(response.data.profiles);
        setSelectedJobId(job_id);
        toast.success("Students fetched successfully");
      }
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Failed to fetch students");
    } finally {
      setLoading(false);
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
        toast.success(response.data.message);
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

  const getProfileForStudent = (student_id) => {
    return profiles.find((profile) => profile.student_id === student_id) || {};
  };

  const filterStudents = () => {
    const filtered = students.filter((student) => {
      const {
        name = "",
        email = "",
        specialization = "",
        highest_education = "",
        year_of_passout = "",
      } = student;
      const lowerCaseSearch = searchTerm.toLowerCase();
  
      if (
        (searchFilters.name &&
          name.toLowerCase().includes(lowerCaseSearch)) ||
        (searchFilters.email &&
          email.toLowerCase().includes(lowerCaseSearch)) ||
        (searchFilters.specialization &&
          specialization.toLowerCase().includes(lowerCaseSearch)) ||
        (searchFilters.highestEducation &&
          highest_education.toLowerCase().includes(lowerCaseSearch)) ||
        (searchFilters.yearOfPassout &&
          year_of_passout.toString().includes(lowerCaseSearch))
      ) {
        return true;
      }
      return false;
    });
  
    setFilteredStudents(filtered);
  };

  useEffect(() => {
    filterStudents();
  }, [searchTerm, searchFilters, students]);

  const toggleSearchFilter = (filterKey) => {
    setSearchFilters({
      ...searchFilters,
      [filterKey]: !searchFilters[filterKey],
    });
  };

  const renderStudents = filteredStudents.length > 0 ? filteredStudents : students;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Jobs for the Drive</h2>
      {loading ? (
        <Spinner animation="border" role="status">
          <span className="sr-only">Loading...</span>
        </Spinner>
      ) : noJobs ? (
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
                      {job.skills &&
                        job.skills.map((skill, index) => (
                          <li key={index}>{skill}</li>
                        ))}
                    </ul>
                  </td>
                  <td>
                    <button
                      className="btn btn-primary"
                      onClick={() => fetchStudentsForJob(job.job_id)}
                    >
                      Find Students
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <h2 className="text-center mb-4">Matching Students</h2>
          {renderStudents.length === 0 ? (
            <div className="alert alert-info" role="alert">
              No matching students found.
            </div>
          ) : (
            <>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Search by name, email, specialization, education, year"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="ms-3 mb-3 row">
                <Form.Check
                  type="checkbox"
                  label="Name"
                  checked={searchFilters.name}
                  onChange={() => toggleSearchFilter("name")}
                  className="col-4"
                />
                <Form.Check
                  type="checkbox"
                  label="Email"
                  checked={searchFilters.email}
                  onChange={() => toggleSearchFilter("email")}
                  className="col-4"
                />
                <Form.Check
                  type="checkbox"
                  label="Specialization"
                  checked={searchFilters.specialization}
                  onChange={() => toggleSearchFilter("specialization")}
                  className="col-4"
                />
                <Form.Check
                  type="checkbox"
                  label="Highest Education"
                  checked={searchFilters.highestEducation}
                  onChange={() => toggleSearchFilter("highestEducation")}
                  className="col-4"
                />
                <Form.Check
                  type="checkbox"
                  label="Year of Passout"
                  checked={searchFilters.yearOfPassout}
                  onChange={() => toggleSearchFilter("yearOfPassout")}
                  className="col-4"
                />
              </div>
              <table className="table table-striped table-hover">
                <thead className="thead-dark">
                  <tr>
                    <th>
                      <input
                        type="checkbox"
                        checked={
                          selectedStudents.length === renderStudents.length
                        }
                        onChange={handleSelectAllStudents}
                      />
                    </th>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone Number</th>
                    <th>Role</th>
                    <th>Profile Details</th>
                  </tr>
                </thead>
                <tbody>
                  {renderStudents.map((student) => {
                    const profile = getProfileForStudent(
                      student.student_id
                    );
                    return (
                      <tr key={student.student_id}>
                        <td>
                          <input
                            type="checkbox"
                            checked={selectedStudents.includes(
                              student.student_id
                            )}
                            onChange={() =>
                              handleStudentSelect(student.student_id)
                            }
                          />
                        </td>
                        <td>
                          <AnyProfileImage
                            studentId={student.student_id}
                            style={{ width: "50px", height: "50px" }}
                          />
                        </td>
                        <td>{student.name}</td>
                        <td>{student.email}</td>
                        <td>{student.phoneNumber}</td>
                        <td>{student.role}</td>
                        <td>
                          {profile && (
                            <div>
                              <p>
                                Highest Education:{" "}
                                {profile.highest_education}
                              </p>
                              <p>
                                Year of Passout:{" "}
                                {profile.year_of_passout}
                              </p>
                              <p>
                                Specialization:{" "}
                                {profile.specialization}
                              </p>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button
                className="btn btn-success"
                onClick={() => setShowModal(true)}
                disabled={selectedStudents.length === 0}
              >
                Send Email
              </button>
            </>
          )}
          <Modal show={showModal} onHide={() => setShowModal(false)}>
            <Modal.Header closeButton>
              <Modal.Title>Send Email</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <Form>
                <Form.Group controlId="emailSubject">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter subject"
                    value={emailSubject}
                    onChange={(e) => setEmailSubject(e.target.value)}
                  />
                </Form.Group>
                <Form.Group controlId="emailBody">
                  <Form.Label>Body</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Enter email body"
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
                  <Spinner animation="border" size="sm" />
                ) : (
                  "Send Email"
                )}
              </Button>
            </Modal.Footer>
          </Modal>
        </>
      )}
      <ToastContainer />
    </div>
  );
};

export default ViewJobsByDriveId;
