import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { Button, Form, Modal, Row, Col } from 'react-bootstrap';
import { toast, ToastContainer } from 'react-toastify';

const PlacementTest = () => {
    const [loading, setLoading] = useState(true);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [totalMarks, setTotalMarks] = useState(0);
    const [modalOpen, setModalOpen] = useState(true); // Open modal on component load
    const [testResults, setTestResults] = useState(null);
    const [showSummary, setShowSummary] = useState(false);
    const [obtainedMarks, setObtainedMarks] = useState(0);
    const [placementTestStudentId, setPlacementTestStudentId] = useState(null);
    const { test_id } = useParams();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone_number: ''
    });
    const [savingStudent, setSavingStudent] = useState(false);
    const [saveError, setSaveError] = useState(null);
    const [showResult, setShowResult] = useState(false); // Added state to manage show_result

    useEffect(() => {
        const fetchTestDetails = async () => {
            try {
                const response1 = await axios.post('http://localhost:5000/api/placement-test/fetchTestTopicIdsAndQnNums', {
                    test_id
                });

                const { topic_ids, number_of_questions, show_result } = response1.data;

                setShowResult(show_result); // Set the showResult state based on API response

                if (!show_result) {
                    // If show_result is false, load questions but do not show summary
                    setShowSummary(false); // Do not show detailed summary
                }

                const response2 = await axios.post('http://localhost:5000/api/test/cumulative-test/getQuestionsByTopicIds', {
                    topic_ids,
                    numberOfQuestions: number_of_questions
                });

                const questionsWithOptions = response2.data.map(question => ({
                    ...question,
                    options: [
                        question.option_1,
                        question.option_2,
                        question.option_3,
                        question.option_4,
                    ]
                }));

                setQuestions(questionsWithOptions);

                const totalMarks = questionsWithOptions.reduce((sum, question) => sum + question.no_of_marks_allocated, 0);
                setTotalMarks(totalMarks);

                setLoading(false);
            } catch (error) {
                console.error('Error fetching test details:', error);
                setLoading(false);
            }
        };

        fetchTestDetails();
    }, [test_id]);

    const handleAnswerChange = (questionId, selectedOption) => {
        setAnswers(prevAnswers => ({
            ...prevAnswers,
            [questionId]: selectedOption,
        }));
    };

    const handleSubmitTest = async () => {
        setLoading(true);

        try {
            const completedDateTime = new Date().toISOString();

            const obtainedMarks = questions.reduce((sum, question) => {
                const selectedOption = answers[question.cumulative_question_id];
                if (String(selectedOption) === String(question.correct_option)) {
                    return sum + question.no_of_marks_allocated;
                }
                return sum;
            }, 0);

            setObtainedMarks(obtainedMarks);

            const questionAnsData = {};
            questions.forEach(question => {
                const selectedOption = answers[question.cumulative_question_id] || null;
                questionAnsData[question.cumulative_question_id] = selectedOption;
            });

            const response = await axios.post('http://localhost:5000/api/placement-test/savePlacementTestResults', {
                placement_test_student_id: placementTestStudentId,
                placement_test_id: test_id,
                marks_obtained: obtainedMarks,
            });

            toast.success('Submitted successfully!')
            setTestResults({
                ...response.data,
                question_ans_data: questionAnsData,
            });

            setShowSummary(true);
        } catch (error) {
            if (error.response) {
                if (error.response.status === 400) {
                    alert('Cannot Submit Answers Again: You have already submitted your answers for this test')
                } else {
                    alert('Something went wrong')
                }
            }
            console.error('Error saving test results:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleSaveStudent = async (e) => {
        e.preventDefault();
        setSavingStudent(true);
        setSaveError(null);

        try {
            const response = await axios.post('http://localhost:5000/api/placement-test/save-placement-test-student', formData);

            if (response.status === 200) {
                if (response.data.existingStudent) {
                    toast.success('Student details already exist');
                    setPlacementTestStudentId(response.data.existingStudent.placement_test_student_id);
                } else {
                    toast.success('Details saved Successfully: Continue to attend the test');
                    setPlacementTestStudentId(response.data.newStudent.placement_test_student_id);
                }

                setFormData({
                    name: '',
                    email: '',
                    phone_number: ''
                });
                setModalOpen(false); // Close modal after saving student data
            } else {
                setSaveError('Failed to save student data. Please try again.');
            }
        } catch (error) {
            console.error('Error saving student data:', error);
            setSaveError('Failed to save student data. Please try again.');
        } finally {
            setSavingStudent(false);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({
            ...prevData,
            [name]: value
        }));
    };

    const getAnsweredQuestionsCount = () => {
        return questions.filter(question => answers[question.cumulative_question_id]).length;
    };

    const getUnansweredQuestionsCount = () => {
        return questions.filter(question => !answers[question.cumulative_question_id]).length;
    };

    const getWrongAnswersCount = () => {
        return questions.filter(question => {
            const selectedOption = answers[question.cumulative_question_id];
            return selectedOption && selectedOption !== question.correct_option;
        }).length;
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className="container mt-5">
            <h2>Placement Test</h2>
            {!showSummary && (
                <>
                    
                        <>
                            {questions.map((question, index) => (
                                <Form key={question.cumulative_question_id} className="mb-3">
                                    <Form.Group as={Row}>
                                        <Form.Label column sm="12" className="position-relative">
                                            <span>{index + 1}. {question.question_description}</span>
                                            <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                        </Form.Label>
                                        <Col sm="12">
                                            {question.options.map((option, idx) => (
                                                <Form.Check
                                                    key={idx}
                                                    type="radio"
                                                    label={option}
                                                    name={`question-${index}`}
                                                    value={option}
                                                    checked={answers[question.cumulative_question_id] === option}
                                                    onChange={(e) => handleAnswerChange(question.cumulative_question_id, e.target.value)}
                                                />
                                            ))}
                                        </Col>
                                    </Form.Group>
                                </Form>
                            ))}
                            <Button variant="primary" onClick={handleSubmitTest}>Submit</Button>
                        </>
                   
                </>
            )}
            {showSummary && showResult && (
                <div className="row">
                    <div className="col-lg" style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                        {questions.map((question, index) => {
                            const selectedOption = testResults?.question_ans_data[question.cumulative_question_id];
                            const isCorrect = selectedOption === question.correct_option;
                            return (
                                <div key={question.cumulative_question_id} className={`p-2 mb-2 border position-relative ${isCorrect ? 'border-success' : 'border-danger'}`}>
                                    <span className="position-absolute top-0 end-0">Marks: {question.no_of_marks_allocated}</span>
                                    <p>{index + 1}. {question.question_description}</p>
                                    <p className={`text-${isCorrect ? 'success' : 'danger'}`}>Your Answer: {selectedOption ? selectedOption : "Not Attempted"}</p>
                                    {!isCorrect && (
                                        <p className="text-success">Correct Answer: {question.correct_option}</p>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="col-lg-3 ml-lg-2" style={{ position: 'sticky', top: '10px' }}>
                        <h6>Results Summary</h6>
                        <table className="table">
                            <tbody>
                                <tr>
                                    <td className='bg-warning'>Total Marks:</td>
                                    <td className='bg-warning fw-bolder'>{totalMarks}</td>
                                </tr>
                                <tr>
                                    <td className='bg-warning'>Obtained Marks:</td>
                                    <td className='text-success bg-warning fw-bolder'>{obtainedMarks}</td>
                                </tr>
                                <tr>
                                    <td className='bg-warning'>Answered Questions:</td>
                                    <td className='text-dark bg-warning fw-bolder'>{getAnsweredQuestionsCount()}</td>
                                </tr>
                                <tr>
                                    <td className='bg-warning'>Unanswered Questions:</td>
                                    <td className='text-secondary bg-warning fw-bolder'>{getUnansweredQuestionsCount()}</td>
                                </tr>
                                <tr>
                                    <td className='bg-warning'>Wrong Answers:</td>
                                    <td className='text-danger bg-warning fw-bolder'>{getWrongAnswersCount()}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            <Modal show={modalOpen} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Save Student Data</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {saveError && <div className="alert alert-danger">{saveError}</div>}
                    <Form onSubmit={handleSaveStudent}>
                        <Form.Group className="mb-3">
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control
                                type="text"
                                name="phone_number"
                                value={formData.phone_number}
                                onChange={handleChange}
                                required
                            />
                        </Form.Group>
                        <Button variant="primary" type="submit" disabled={savingStudent}>
                            {savingStudent ? 'Saving...' : 'Save'}
                        </Button>
                    </Form>
                </Modal.Body>
            </Modal>
            <ToastContainer />
        </div>
    );
};

export default PlacementTest;

