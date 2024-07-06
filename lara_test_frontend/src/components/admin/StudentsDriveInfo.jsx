import React, { useEffect, useState } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { baseURL } from '../config';
import { Modal, Button, Form, Spinner } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';
import AnyProfileImage from './AnyProfileImage';
import AnyCompanyLogo from './AnyCompanyLogo';

const StudentsDriveInfo = () => {
  const [data, setData] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [formData, setFormData] = useState({ result: '', subject: '', mail_body: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
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
        const response = await axios.get(`${baseURL}/api/job/getAllDrivesAssignedToStudents`, config);
        setData(response.data.job_details);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const handleShowModal = (student,job) => {
    setSelectedStudent(student,job);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
    setFormData({ result: '', subject: '', mail_body: '' });
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const { result, subject, mail_body } = formData;
    const { student_id, job_id } = selectedStudent;
    console.log( student_id , "----", job_id)

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

      await axios.post(`${baseURL}/api/job/submitStudentResult`, {
        result,
        subject,
        mail_body,
        student_id,
        job_id,
      }, config);
      console.log('job id ', job_id)
      handleCloseModal();
      toast.success("Status updated mail sent successfully ")
    } catch (error) {
      console.error('Error submitting result:', error);
      toast.error("Something went wrong !!")
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Students Drive Information</h2>
      <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead>
            <tr>
                <th>Student Image</th>
              <th>Student Name</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Company Name</th>
              <th>Job</th>
              {/* <th>job id </th> */}
              <th>Total Rounds</th>
              <th>Result</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>
              <AnyProfileImage studentId={item.student_details.student_id} style={{ width: '50px', height: '50px' }} />
                </td>
                <td>
                    {item.student_details.name}</td>
                <td>{item.student_details.phoneNumber}</td>
                <td>{item.student_details.email}</td>
                <td>
                <AnyCompanyLogo companyId={item.company.company_id} style={{ width: '50px', height: '50px', borderRadius: '5%', margin: '10px' }} />
                   <p className='text-center'>
                   {item.company.name}
                   </p>
                   </td>
                <td>{item.job_details.Job}</td>
                {/* <td>{item.job_details.Job_id}</td> */}
                <td>{item.job_details.Total_Rounds}</td>
                <td>{item.rounds.result}</td>
                <td>
                  <Button variant="primary"
                  data-toggle="tooltip"
                  title="Update status of drive and send email "
                   onClick={() => handleShowModal({
                    student_id: item.student_details.student_id,
                    job_id: item.job_details.Job_id,
                  })}>
                    
                    Update Status
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Drive Status and Send Email</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="formResult">
              <Form.Label>Result</Form.Label>
              <Form.Control as="select" name="result" value={formData.result} onChange={handleChange} required>
                <option value="">Select</option>
                <option value="SELECTED">SELECTED</option>
                <option value="REJECTED">REJECTED</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formSubject">
              <Form.Label>Subject</Form.Label>
              <Form.Control
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </Form.Group>
            <Form.Group controlId="formMailBody">
              <Form.Label>Message</Form.Label>
              <Form.Control
                as="textarea"
                name="mail_body"
                value={formData.mail_body}
                onChange={handleChange}
                rows={3}
                required
              />
            </Form.Group>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? <Spinner animation="border" size="sm" /> : 'Send Email'}
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
      <ToastContainer />
    </div>
  );
};

export default StudentsDriveInfo;
