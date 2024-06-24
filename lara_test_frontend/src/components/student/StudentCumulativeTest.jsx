import React, { useState, useEffect } from 'react';
import { Button, Card, Table, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { baseURL } from '../config';

//Previous 
// const StudentCumulativeTest = () => {
//     const [subjects, setSubjects] = useState([]);
//     const [topics, setTopics] = useState([]);
//     const [selectedSubject, setSelectedSubject] = useState('');
//     const [selectedTopics, setSelectedTopics] = useState([]);
//     const [numQuestions, setNumQuestions] = useState(20);
//     const [availableQuestions, setAvailableQuestions] = useState(0);
//     const [errorMessage, setErrorMessage] = useState('');
//     const [selectAllTopics, setSelectAllTopics] = useState(false);
//     const navigate = useNavigate();

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
//         setSelectedTopics([]);
//         setAvailableQuestions(0);
//         setErrorMessage('');

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

//     const handleTopicChange = (topicId) => {
//         setSelectedTopics((prevSelectedTopics) => {
//             const newSelectedTopics = prevSelectedTopics.includes(topicId)
//                 ? prevSelectedTopics.filter((id) => id !== topicId)
//                 : [...prevSelectedTopics, topicId];

//             updateAvailableQuestions(newSelectedTopics);
//             return newSelectedTopics;
//         });
//     };

//     const handleSelectAllTopics = () => {
//         setSelectAllTopics(!selectAllTopics);
//         if (!selectAllTopics) {
//             const allTopicIds = topics.map(topic => topic.topic_id);
//             setSelectedTopics(allTopicIds);
//             updateAvailableQuestions(allTopicIds);
//         } else {
//             setSelectedTopics([]);
//             setAvailableQuestions(0);
//         }
//     };

//     const updateAvailableQuestions = async (topicIds) => {
//         if (topicIds.length === 0) {
//             setAvailableQuestions(0);
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
//                 },
//             };

//             const response = await axios.post(`${baseURL}/api/test/cumulative-test/getQuestionCountsByTopicIds`, {
//                 topic_ids: topicIds
//             }, config);

//             const totalAvailableQuestions = response.data.reduce((sum, topic) => sum + topic.question_count, 0);
//             setAvailableQuestions(totalAvailableQuestions);
//         } catch (error) {
//             console.error('Error fetching available questions:', error);
//         }
//     };

//     const handleNumQuestionsChange = (e) => {
//         const value = e.target.value;
//         setNumQuestions(value);
//         if (value > availableQuestions) {
//             setErrorMessage(`Enter less than ${availableQuestions}`);
//         } else {
//             setErrorMessage('');
//         }
//     };

//     const handleStartTest = () => {
//         if (numQuestions <= availableQuestions) {
//             navigate('/start-test', { state: { selectedTopics, numQuestions } });
//         }
//     };

//     const selectedSubjectName = subjects.find(subject => subject.subject_id === selectedSubject)?.name || '';
//     const selectedTopicsNames = topics.filter(topic => selectedTopics.includes(topic.topic_id)).map(topic => topic.name);
//     const duration = numQuestions * 1; // 1 minute per question

//     return (
//         <div className="container mt-4">
//             <Button
//                 variant="secondary"
//                 onClick={() => navigate('/all-test-results')}
//                 style={{ marginTop: '20px' }}
//             >
//                 View All Test Results
//             </Button>

//             <Form.Group controlId="formSubject" className="mt-4" style={{ maxWidth: '300px' }}>
//                 <Form.Label>Select Subject</Form.Label>
//                 <Form.Control as="select" value={selectedSubject} onChange={handleSubjectChange} required>
//                     <option value="">-- Select Subject --</option>
//                     {subjects.map((subject) => (
//                         <option key={subject.subject_id} value={subject.subject_id}>
//                             {subject.name}
//                         </option>
//                     ))}
//                 </Form.Control>
//             </Form.Group>

//             <div className="mt-4">
//                 <h5>Select Topics</h5>
//                 <Form.Group>
//                     <Form.Check
//                         type="checkbox"
//                         label="Select All"
//                         checked={selectAllTopics}
//                         onChange={handleSelectAllTopics}
//                     />
//                     <div className="row mt-2">
//                         {topics.map((topic) => (
//                             <div className="col-3" key={topic.topic_id}>
//                                 <Form.Check
//                                     type="checkbox"
//                                     label={topic.name}
//                                     checked={selectedTopics.includes(topic.topic_id)}
//                                     onChange={() => handleTopicChange(topic.topic_id)}
//                                 />
//                             </div>
//                         ))}
//                     </div>
//                 </Form.Group>
//             </div>

//             <Form.Group controlId="formNumQuestions" className="mt-4" style={{ maxWidth: '300px' }}>
//                 <Form.Label>Number of Questions</Form.Label>
//                 <Form.Control
//                     type="number"
//                     value={numQuestions}
//                     onChange={handleNumQuestionsChange}
//                     required
//                     isInvalid={!!errorMessage}
//                 />
//                 <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
//             </Form.Group>

//             {selectedTopics.length > 0 && numQuestions > 0 && availableQuestions === 0 ? (
//                 <p className="text-danger mt-4">
//                     Currently no questions are available. Questions will be updated soon.
//                 </p>
//             ) : (
//                 <div className="d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '50vh' }}>
//                     {selectedSubject && selectedTopics.length > 0 && (
//                         <Card style={{ maxWidth: '500px', width: '100%' }}>
//                             <Card.Body>
//                                 <Card.Title>Test Summary</Card.Title>
//                                 <Table striped bordered>
//                                     <tbody>
//                                         <tr>
//                                             <td><strong>Subject:</strong></td>
//                                             <td>{selectedSubjectName}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Topics:</strong></td>
//                                             <td>{selectedTopicsNames.join(', ')}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Number of Questions:</strong></td>
//                                             <td>{numQuestions}</td>
//                                         </tr>
//                                         <tr>
//                                             <td><strong>Duration:</strong></td>
//                                             <td>{duration} {duration > 1 ? 'minutes' : 'minute'}</td>
//                                         </tr>
//                                     </tbody>
//                                 </Table>
//                                 <div className="alert alert-warning mt-4" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
//                                     Please avoid refreshing the page or opening a new tab to prevent loss of progress.
//                                 </div>
//                                 <div className="d-flex justify-content-center">
//                                     <Button
//                                         variant="primary"
//                                         onClick={handleStartTest}
//                                         disabled={numQuestions > availableQuestions}
//                                         className="mt-4"
//                                     >
//                                         Start
//                                     </Button>
//                                 </div>
//                             </Card.Body>
//                         </Card>
//                     )}
//                 </div>
//             )}
//         </div>
//     );
// };


const StudentCumulativeTest = () => {
    const [subjects, setSubjects] = useState([]);
    const [topics, setTopics] = useState([]);
    const [selectedSubject, setSelectedSubject] = useState('');
    const [selectedTopics, setSelectedTopics] = useState([]);
    const [numQuestions, setNumQuestions] = useState(20);
    const [availableQuestions, setAvailableQuestions] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');
    const [selectAllTopics, setSelectAllTopics] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubjects = async () => {
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

                const response = await axios.get(`${baseURL}/api/test/cumulative-test/getAllSubjects`, config);
                setSubjects(response.data);
            } catch (error) {
                console.error('Error fetching subjects:', error);
            }
        };

        fetchSubjects();
    }, []);

    const handleSubjectChange = async (e) => {
        const subjectId = e.target.value;
        setSelectedSubject(subjectId);
        setSelectedTopics([]);
        setAvailableQuestions(0);
        setErrorMessage('');

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

            const response = await axios.get(`${baseURL}/api/test/cumulative-test/getTopicsBySubjectId`, {
                params: { subject_id: subjectId },
                ...config,
            });

            const topics = response.data;

            // Fetch question counts for these topics
            const topicIds = topics.map(topic => topic.topic_id);
            const questionCountsResponse = await axios.post(`${baseURL}/api/test/cumulative-test/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const topicsWithCounts = topics.map(topic => {
                const countData = questionCountsResponse.data.find(item => item.topic_id === topic.topic_id);
                return {
                    ...topic,
                    question_count: countData ? countData.question_count : 0
                };
            });

            setTopics(topicsWithCounts);
        } catch (error) {
            console.error('Error fetching topics:', error);
        }
    };

    const handleTopicChange = (topicId) => {
        setSelectedTopics((prevSelectedTopics) => {
            const newSelectedTopics = prevSelectedTopics.includes(topicId)
                ? prevSelectedTopics.filter((id) => id !== topicId)
                : [...prevSelectedTopics, topicId];

            updateAvailableQuestions(newSelectedTopics);
            return newSelectedTopics;
        });
    };

    const handleSelectAllTopics = () => {
        setSelectAllTopics(!selectAllTopics);
        if (!selectAllTopics) {
            const allTopicIds = topics.map(topic => topic.topic_id);
            setSelectedTopics(allTopicIds);
            updateAvailableQuestions(allTopicIds);
        } else {
            setSelectedTopics([]);
            setAvailableQuestions(0);
        }
    };

    const updateAvailableQuestions = async (topicIds) => {
        if (topicIds.length === 0) {
            setAvailableQuestions(0);
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
                },
            };

            const response = await axios.post(`${baseURL}/api/test/cumulative-test/getQuestionCountsByTopicIds`, {
                topic_ids: topicIds
            }, config);

            const totalAvailableQuestions = response.data.reduce((sum, topic) => sum + topic.question_count, 0);
            setAvailableQuestions(totalAvailableQuestions);
        } catch (error) {
            console.error('Error fetching available questions:', error);
        }
    };

    const handleNumQuestionsChange = (e) => {
        const value = e.target.value;
        setNumQuestions(value);
        if (value > availableQuestions) {
            setErrorMessage(`Enter less than ${availableQuestions}`);
        } else {
            setErrorMessage('');
        }
    };

    const handleStartTest = () => {
        if (numQuestions <= availableQuestions) {
            navigate('/start-test', { state: { selectedTopics, numQuestions } });
        }
    };

    const selectedSubjectName = subjects.find(subject => subject.subject_id === selectedSubject)?.name || '';
    const selectedTopicsNames = topics.filter(topic => selectedTopics.includes(topic.topic_id)).map(topic => topic.name);
    const duration = numQuestions * 1; // 1 minute per question

    return (
        <div className="container mt-4">
            <Button
                variant="secondary"
                onClick={() => navigate('/all-test-results')}
                style={{ marginTop: '20px' }}
            >
                View All Test Results
            </Button>

            <Form.Group controlId="formSubject" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Select Subject</Form.Label>
                <Form.Control as="select" value={selectedSubject} onChange={handleSubjectChange} required>
                    <option value="">-- Select Subject --</option>
                    {subjects.map((subject) => (
                        <option key={subject.subject_id} value={subject.subject_id}>
                            {subject.name}
                        </option>
                    ))}
                </Form.Control>
            </Form.Group>

            <div className="mt-4">
                <h5>Select Topics</h5>
                <Form.Group>
                    <Form.Check
                        type="checkbox"
                        label="Select All"
                        checked={selectAllTopics}
                        onChange={handleSelectAllTopics}
                    />
                    <div className="row mt-2">
                        {topics.map((topic) => (
                            <div className="col-3" key={topic.topic_id}>
                                <Form.Check
                                    type="checkbox"
                                    label={`${topic.name} (${topic.question_count} questions)`}
                                    checked={selectedTopics.includes(topic.topic_id)}
                                    onChange={() => handleTopicChange(topic.topic_id)}
                                />
                            </div>
                        ))}
                    </div>
                </Form.Group>
            </div>

            <Form.Group controlId="formNumQuestions" className="mt-4" style={{ maxWidth: '300px' }}>
                <Form.Label>Number of Questions</Form.Label>
                <Form.Control
                    type="number"
                    value={numQuestions}
                    onChange={handleNumQuestionsChange}
                    required
                    isInvalid={!!errorMessage}
                />
                <Form.Control.Feedback type="invalid">{errorMessage}</Form.Control.Feedback>
            </Form.Group>

            {selectedTopics.length > 0 && numQuestions > 0 && availableQuestions === 0 ? (
                <p className="text-danger mt-4">
                    Currently no questions are available. Questions will be updated soon.
                </p>
            ) : (
                <div className="d-flex justify-content-center align-items-center mt-4" style={{ minHeight: '50vh' }}>
                    {selectedSubject && selectedTopics.length > 0 && (
                        <Card style={{ maxWidth: '500px', width: '100%' }}>
                            <Card.Body>
                                <Card.Title>Test Summary</Card.Title>
                                <Table striped bordered>
                                    <tbody>
                                        <tr>
                                            <td><strong>Subject:</strong></td>
                                            <td>{selectedSubjectName}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Topics:</strong></td>
                                            <td>{selectedTopicsNames.join(', ')}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Number of Questions:</strong></td>
                                            <td>{numQuestions}</td>
                                        </tr>
                                        <tr>
                                            <td><strong>Duration:</strong></td>
                                            <td>{duration} {duration > 1 ? 'minutes' : 'minute'}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <div className="alert alert-warning mt-4" style={{ fontSize: '1.2em', fontWeight: 'bold' }}>
                                    Please avoid refreshing the page or opening a new tab to prevent loss of progress.
                                </div>
                                <div className="d-flex justify-content-center">
                                    <Button
                                        variant="primary"
                                        onClick={handleStartTest}
                                        disabled={numQuestions > availableQuestions}
                                        className="mt-4"
                                    >
                                        Start
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    )}
                </div>
            )}
        </div>
    );
};

export default StudentCumulativeTest;




