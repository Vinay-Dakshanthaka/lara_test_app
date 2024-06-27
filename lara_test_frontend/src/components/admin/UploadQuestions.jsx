import React, { useState, useEffect } from "react";
import axios from "axios";
import { baseURL } from "../config";
import "react-toastify/dist/ReactToastify.css";
import {
  Form,
  Button,
  Container,
  Row,
  Col,
  Modal,
  Table,
} from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import image from "./excel-sheet-example.png";
import image2 from "./excel-sheet-example2.png";

//Previous One
// const UploadQuestions = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [topics, setTopics] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [selectedTopic, setSelectedTopic] = useState('');
//     const [file, setFile] = useState(null);
//     const [showModal, setShowModal] = useState(false);
//     //const [subjects, setSubjects] = useState([]);

//     useEffect(() => {
//         const fetchSubjectsAndTopics = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     throw new Error("No token provided.");
//                 }

//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 };

//                 const response = await axios.get(`${baseURL}/api/test/cumulative-test/getAllSubjectsAndTopics`, config);
//                 setSubjects(response.data);
//             } catch (error) {
//                 console.error('Error fetching subjects and topics:', error);
//             }
//         };

//         fetchSubjectsAndTopics();
//     }, []);

//     useEffect(() => {
//         const fetchSubjects = async () => {
//             try {
//                 const token = localStorage.getItem("token");
//                 if (!token) {
//                     throw new Error("No token provided.");
//                 }

//                 const config = {
//                     headers: {
//                         Authorization: `Bearer ${token}`,
//                     },
//                 };

//                 const response = await axios.get(`${baseURL}/api/test/cumulative-test/getAllSubjects`, config);
//                 setSubjects(response.data);
//             } catch (error) {
//                 console.error('Error fetching subjects:', error);
//             }
//         };

//         fetchSubjects();
//     }, []);

//     const handleSubjectChange = async (e) => {
//         const subjectId = e.target.value;
//         setSelectedSubject(subjectId);
//         setSelectedTopic(''); // Reset selected topic

//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("No token provided.");
//             }

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                 },
//             };

//             const response = await axios.get(`${baseURL}/api/test/cumulative-test/getTopicsBySubjectId`, {
//                 params: { subject_id: subjectId },
//                 ...config,
//             });

//             setTopics(response.data);
//         } catch (error) {
//             console.error('Error fetching topics:', error);
//         }
//     };

//     const handleTopicChange = (e) => {
//         setSelectedTopic(e.target.value);
//     };

//     const handleFileChange = (e) => {
//         const selectedFile = e.target.files[0];
//         const allowedExtensions = ['xlsx', 'xls'];

//         if (selectedFile) {
//             const fileExtension = selectedFile.name.split('.').pop().toLowerCase();
//             if (!allowedExtensions.includes(fileExtension)) {
//                 toast.error("Invalid file type. Please upload an .xlsx or .xls file.");
//                 setFile(null);
//                 return;
//             }
//             setFile(selectedFile);
//         }
//     };

//     const handleUpload = async (e) => {
//         e.preventDefault();
//         if (!file) {
//             toast.error("Please select a valid file to upload.");
//             return;
//         }

//         try {
//             const token = localStorage.getItem("token");
//             if (!token) {
//                 throw new Error("No token provided.");
//             }

//             const config = {
//                 headers: {
//                     Authorization: `Bearer ${token}`,
//                     'Content-Type': 'multipart/form-data'
//                 },
//             };

//             const formData = new FormData();
//             formData.append('file', file);

//             await axios.post(`${baseURL}/api/test/cumulative-test/upload-questions`, formData, {
//                 params: { topic_id: selectedTopic },
//                 ...config,
//             });

//             toast.success("Questions uploaded successfully!");
//         } catch (error) {
//             console.error('Error uploading questions:', error);
//             toast.error("Something went wrong while uploading the questions.");
//         }
//     };

//     const handleShowModal = () => setShowModal(true);
//     const handleCloseModal = () => setShowModal(false);

//     return (
//         <Container>
//             <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
//             <Row>
//                 <Col md={6}>
//                     <Form onSubmit={handleUpload}>
//                         <Form.Group controlId="subjectSelect">
//                             <Form.Label>Select Subject</Form.Label>
//                             <Form.Control as="select" value={selectedSubject} onChange={handleSubjectChange} required>
//                                 <option value="">-- Select Subject --</option>
//                                 {subjects.map((subject) => (
//                                     <option key={subject.subject_id} value={subject.subject_id}>
//                                         {subject.name}
//                                     </option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>

//                         <Form.Group controlId="topicSelect">
//                             <Form.Label>Select Topic</Form.Label>
//                             <Form.Control as="select" value={selectedTopic} onChange={handleTopicChange} required disabled={!selectedSubject}>
//                                 <option value="">-- Select Topic --</option>
//                                 {topics.map((topic) => (
//                                     <option key={topic.topic_id} value={topic.topic_id}>
//                                         {topic.name}
//                                     </option>
//                                 ))}
//                             </Form.Control>
//                         </Form.Group>
//                         <Button variant="info" className="mt-3" onClick={handleShowModal}>
//                             Example Excel Sheet Format to Upload
//                         </Button>
//                         <Form.Group controlId="fileUpload">
//                             <Form.Label>Upload Questions</Form.Label>
//                             <Form.Control type="file" onChange={handleFileChange} required />
//                         </Form.Group>

//                         <Button type="submit" className="mt-3" disabled={!selectedTopic}>
//                             Upload
//                         </Button>
//                     </Form>
//                 </Col>

//             </Row>

//             <Modal show={showModal} onHide={handleCloseModal} fullscreen>
//                 <Modal.Header closeButton>
//                     <Modal.Title>Example Excel Sheet</Modal.Title>
//                 </Modal.Header>
//                 <Modal.Body>
//                     <img src={image} alt="Example Excel Sheet" className="img-fluid" />
//                 </Modal.Body>
//                 <Modal.Footer>
//                     <Button variant="secondary" onClick={handleCloseModal}>
//                         Close
//                     </Button>
//                 </Modal.Footer>
//             </Modal>
//         </Container>
//     );
// };

const UploadQuestions = () => {
  const [subjects, setSubjects] = useState([]);
  const [topics, setTopics] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [file, setFile] = useState(null);
  const [file2, setFile2] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showModal2, setShowModal2] = useState(false);

  useEffect(() => {
    const fetchSubjectsAndTopics = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          throw new Error("No token provided.");
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/test/cumulative-test/getAllSubjectsAndTopics`,
          config
        );
        setSubjects(response.data);
      } catch (error) {
        console.error("Error fetching subjects and topics:", error);
      }
    };

    fetchSubjectsAndTopics();
  }, []);

  const handleSubjectChange = async (e) => {
    const subjectId = e.target.value;
    setSelectedSubject(subjectId);
    setSelectedTopic(""); // Reset selected topic

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token provided.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await axios.get(
        `${baseURL}/api/test/cumulative-test/getTopicsBySubjectId`,
        {
          params: { subject_id: subjectId },
          ...config,
        }
      );

      setTopics(response.data);
    } catch (error) {
      console.error("Error fetching topics:", error);
    }
  };

  const handleTopicChange = (e) => {
    setSelectedTopic(e.target.value);
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = ["xlsx", "xls"];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error("Invalid file type. Please upload an .xlsx or .xls file.");
        setFile(null);
        return;
      }
      setFile(selectedFile);
    }
  };
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      toast.error("Please select a valid file to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token provided.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("file", file);

      await axios.post(
        `${baseURL}/api/test/cumulative-test/upload-questions`,
        formData,
        {
          params: { topic_id: selectedTopic },
          ...config,
        }
      );

      toast.success("Questions uploaded successfully!");
    } catch (error) {
      console.error("Error uploading questions:", error);
      toast.error("Something went wrong while uploading the questions.");
    }
  };


  //Uplading Questions TopicID wise
  const handleFileChangeByTopic = (e) => {
    const selectedFile = e.target.files[0];
    const allowedExtensions = ["xlsx", "xls"];

    if (selectedFile) {
      const fileExtension = selectedFile.name.split(".").pop().toLowerCase();
      if (!allowedExtensions.includes(fileExtension)) {
        toast.error("Invalid file type. Please upload an .xlsx or .xls file.");
        setFile2(null);
        return;
      }
      setFile2(selectedFile);
    }
  };
  const handleUploadQuestionsByTopicId = async (e) => {
    e.preventDefault();
    if (!file2) {
      toast.error("Please select a valid file to upload.");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token provided.");
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      };

      const formData = new FormData();
      formData.append("file", file2);

      await axios.post(
        `${baseURL}/api/test/cumulative-test/uploadQuestionsByTopicId`,
        formData, config);
      toast.success("Questions uploaded successfully!");
    } catch (error) {
      console.error("Error uploading questions:", error);
      toast.error("Something went wrong while uploading the questions.");
    }
  };

  const handleShowModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);
  const handleShowModal2 = () => setShowModal2(true);
  const handleCloseModal2 = () => setShowModal2(false);

  return (
    <Container>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <Row>
        <Col md={6}>
          <Form onSubmit={handleUpload}>
            <Form.Group controlId="subjectSelect">
              <Form.Label>Select Subject</Form.Label>
              <Form.Control
                as="select"
                value={selectedSubject}
                onChange={handleSubjectChange}
                required
              >
                <option value="">-- Select Subject --</option>
                {subjects.map((subject) => (
                  <option key={subject.subject_id} value={subject.subject_id}>
                    {subject.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group controlId="topicSelect">
              <Form.Label>Select Topic</Form.Label>
              <Form.Control
                as="select"
                value={selectedTopic}
                onChange={handleTopicChange}
                required
                disabled={!selectedSubject}
              >
                <option value="">-- Select Topic --</option>
                {topics.map((topic) => (
                  <option key={topic.topic_id} value={topic.topic_id}>
                    {topic.name}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>
            <Button variant="info" className="mt-3" onClick={handleShowModal}>
              Example Excel Sheet Format to Upload
            </Button>
            <Form.Group controlId="fileUpload">
              <Form.Label>Upload Questions</Form.Label>
              <Form.Control type="file" onChange={handleFileChange} required />
            </Form.Group>

            <Button type="submit" className="mt-3" disabled={!selectedTopic}>
              Upload
            </Button>
          </Form>
        </Col>
        <Col md={6}>
        <Form onSubmit={handleUploadQuestionsByTopicId}>
          <h3>Subjects and Topics</h3>
          {subjects.length > 0 ? (
            subjects.map((subject) => (
              <React.Fragment key={subject.subject_id}>
                <h4>{subject.name}</h4>
                {subject.topics && subject.topics.length > 0 ? (
                  <Table striped bordered hover>
                    <thead>
                      <tr>
                        <th>Topic ID</th>
                        <th>Topic Name</th>
                      </tr>
                    </thead>
                    <tbody>
                      {subject.topics.map((topic) => (
                        <tr key={topic.topic_id}>
                          <td>{topic.topic_id}</td>
                          <td>{topic.name}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <p>No topics available for this subject.</p>
                )}
              </React.Fragment>
            ))
          ) : (
            <p>No subjects available.</p>
          )}
        <Button variant="info" className="mt-3" onClick={handleShowModal2}>
          Example Excel Sheet Format to Upload
        </Button>
        <Form.Group controlId="fileUpload">
          <Form.Label>Upload Questions</Form.Label>
          <Form.Control type="file" onChange={handleFileChangeByTopic} required />
        </Form.Group>

        <Button type="submit" className="mt-3">
          Upload
        </Button>
        
        
    </Form>
    </Col> 
      </Row>
      
        
        {/* For Uploading Questions Topic wise */}
      
      <Modal show={showModal} onHide={handleCloseModal} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Example Excel Sheet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={image} alt="Example Excel Sheet" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>


      {/* For Uploading Questions Topic id wise */}
      
      <Modal show={showModal2} onHide={handleCloseModal2} fullscreen>
        <Modal.Header closeButton>
          <Modal.Title>Example Excel Sheet for Uploading Question Topic id</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={image2} alt="Example Excel Sheet" className="img-fluid" />
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal2}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default UploadQuestions;