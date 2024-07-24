import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { baseURL } from '../config';
import axios from 'axios';
import { Table, ToastContainer } from 'react-bootstrap';
import { BsCopy } from 'react-icons/bs';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'quill/dist/quill.snow.css';
import ReactQuill from 'react-quill';
import AnyProfileImage from '../admin/AnyProfileImage';

const SendTestLink = () => {
  const { placement_test_id } = useParams();
  const [placementTest, setPlacementTest] = useState(null);
  const [error, setError] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedEmails, setSelectedEmails] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const quillRef = useRef(null);

  useEffect(() => {
    const fetchPlacementTest = async () => {
      try {
        const response = await axios.post(`${baseURL}/api/placement-test/get-placementtest-details`, { placement_test_id });
        setPlacementTest(response.data.placementTest);
      } catch (error) {
        setError('No data Available');
        console.error('Error fetching placement test details', error);
      }
    };
    fetchPlacementTest();
  }, [placement_test_id]);

  useEffect(() => {
    fetchStudentDetails();
  }, []);

  const fetchStudentDetails = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      console.error('No token found');
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await axios.get(`${baseURL}/api/admin/activites/all-student-details`, config);
      setStudents(response.data.allStudents);
    } catch (error) {
      console.error('Error fetching student details:', error);
    }
  };

  const copyTestLinkToClipboard = (testLink) => {
    navigator.clipboard.writeText(testLink)
      .then(() => {
        toast.info('Test link copied to clipboard');
      })
      .catch((error) => {
        console.error('Error copying to clipboard:', error);
      });
  };

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedEmails([]);
    } else {
      setSelectedEmails(students.map(student => student.email));
    }
    setSelectAll(!selectAll);
  };

  const handleEmailCheckboxChange = (email) => {
    if (selectedEmails.includes(email)) {
      setSelectedEmails(selectedEmails.filter(selectedEmail => selectedEmail !== email));
    } else {
      setSelectedEmails([...selectedEmails, email]);
    }
  };

  const handleSendTestLink = async () => {
    setLoading(true);
    const selectedStudentIds = students
      .filter(student => selectedEmails.includes(student.email))
      .map(student => student.student_id);

    const data = {
      student_ids: selectedStudentIds,
      subject,
      body
    };

    try {
      await axios.post(`${baseURL}/api/placement-test/send-test-link`, data);
      toast.success('Test link sent successfully!');
      setLoading(false);
    } catch (error) {
      console.error('Error sending test link:', error);
      toast.error('Failed to send test link.');
      setLoading(false);
    }
  };

  const filteredStudents = students.filter(student =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.phoneNumber.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (error) {
    return <div className="container mt-5"><div className="error">{error}</div></div>;
  }

  if (!placementTest) {
    return <div className="container mt-5">Loading...</div>;
  }

  return (
    <div className="container mt-5">
      <ToastContainer position="top-right" />
      <Table>
        <tbody>
          <tr>
            <td>Link:
              {placementTest.test_link}
              <button
                className="btn btn-link"
                onClick={() => copyTestLinkToClipboard(placementTest.test_link)}
                style={{ marginLeft: '10px' }}
              >
                <BsCopy />
              </button>
            </td>
            <td>Number of Questions: {placementTest.number_of_questions}</td>
          </tr>
        </tbody>
      </Table>
      <div className="mt-4">
        <input 
          type="checkbox" 
          checked={selectAll} 
          onChange={handleSelectAll} 
        /> Select All
      </div>
      <div className="mt-3">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name, email, or phone"
          className="form-control"
        />
      </div>
      <div style={{ maxHeight: '300px', overflowY: 'scroll', marginTop: '10px', border: '1px solid #ccc', padding: '10px' }}>
        {filteredStudents.map(student => (
          <div key={student.email}>
            <input 
              type="checkbox" 
              checked={selectedEmails.includes(student.email)} 
              onChange={() => handleEmailCheckboxChange(student.email)} 
              style={{width:'25px', height:'25x'}}
            />
              <AnyProfileImage studentId={student.student_id} style={{ width: '30px', height: '30px', marginRight:'8px' }} />
             {student.email}
          </div>
        ))}
      </div>
      <div className="mt-4">
        <input 
          type="text" 
          value={subject} 
          onChange={(e) => setSubject(e.target.value)} 
          placeholder="Email Subject" 
          className="form-control mb-3"
        />
        <ReactQuill style={{height:'300px'}}
          ref={quillRef}
          value={body}
          onChange={setBody}
          theme="snow"
          modules={{
            toolbar: [
              [{ 'header': '1'}, {'header': '2'}, { 'font': [] }],
              [{size: []}],
              ['bold', 'italic', 'underline', 'strike', 'blockquote'],
              [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
              ['link', 'image', 'video'],
              ['clean']
            ],
          }}
          formats={[
            'header', 'font', 'size',
            'bold', 'italic', 'underline', 'strike', 'blockquote',
            'list', 'bullet', 'indent',
            'link', 'image', 'video'
          ]}
        />
      </div>
      <button 
        className="btn btn-primary mt-5 mb-5"
        onClick={handleSendTestLink}
        disabled={selectedEmails.length === 0 || loading}
      >
        {loading ? 'Sending...' : 'Send Test Link'}
      </button>
    </div>
  );
};

export default SendTestLink;
