    
// function StudentDashboard() {
//   const [student, setStudent] = useState(null);
//   const [profile, setProfile] = useState(null);
//   const [errors, setErrors] = useState({});
//   const [details, setDetails] = useState({
//     name: '',
//     phoneNumber: ''    
//   });

//   useEffect(() => {
//     const fetchStudentDetails = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}` // Include token in request headers
//         }
//       };

//       try {
//         const response = await axios.get(`${baseURL}/api/auth/student/getStudentDetails`, config);
//         setStudent(response.data);
//       } catch (error) {
//         console.error('Error fetching student details:', error);
//       }
//     };

//     fetchStudentDetails();
//   }, []);

//   useEffect(() => {
//     const fetchProfileDetails = async () => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}` // Include token in request headers
//         }
//       };

//       try {
//         const response = await axios.get(`${baseURL}/api/student/profile/getProfileDetails`, config);
//         setProfile(response.data);
//       } catch (error) {
//         console.error('Error fetching profile details:', error);
//       }
//     };

//     fetchProfileDetails();
//   }, []);

//   const validateField = (name, value) => {
//     let error = '';

//     if (name === 'name') {
//         if (!/^[a-zA-Z\s]+$/.test(value)) {
//             error = 'This field should contain only letters';
//         }
//     }

//     if (name === 'mobile_number') {
//         if (!/^\d{10}$/.test(value)) {
//             error = 'Mobile number should contain exactly 10 digits';
//         }
//     }
//     setErrors(prevErrors => ({
//       ...prevErrors,
//       [name]: error,
//     }));
//   }

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setDetails(prevDetails => ({
//         ...prevDetails,
//         [name]: value,
//     }));
//     validateField(name, value);
//   };

//   useEffect(() => {
//     const updateNameAndPassword = async() => {
//       const token = localStorage.getItem("token");
//       if (!token) {
//         console.error("No token found");
//         return;
//       }

//       const config = {
//         headers: {
//           Authorization: `Bearer ${token}` // Include token in request headers
//         }
//       };

//       try{
//         await axios.put(`${baseURL}/api/auth/student/updateStudentNameAndPhoneNumber`, details, config);
//         toast.success("Student Name and PhoneNumber Updated Successfully")
//       }
//       catch(error){
//         toast.error("failed to update Name and PhoneNumber")
//       }
//     }
//     updateNameAndPassword();
//   }, [])

//   if (!student || !profile) {
//     return <div>Loading...</div>;
//   }

//   return (
//     <section style={{ backgroundColor: '#eee' }}>
//       <div className="container py-5">
//         <div className="row">
//           <div className="col-lg-4">
//             <div className="card mb-4">
//               <div className="card-body text-center">
//                 {/* <img 
//                   src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp" 
//                   alt="avatar" 
//                   className="rounded-circle img-fluid" 
//                   style={{ width: '150px' }} 
//                 /> */}
//                 <ProfileImage style={{width: '150px'}} className="rounded-circle img-fluid profile-image"/>
//                 <h5 className="my-3">{student.name}</h5>
//                 <p className="text-muted mb-1">{profile.specialization}</p>
//                 <p className="text-muted mb-4">{profile.address}</p>
//                 <div className="d-flex justify-content-center mb-2">
//                   <button type="button" className="btn btn-primary">Follow</button>
//                   <button type="button" className="btn btn-outline-primary ms-1">Message</button>
//                 </div>
//               </div>
//             </div>
//           </div>
//           <div className="col-lg-8">
//             <div className="card mb-4">
//               <div className="card-body">
//                 <div className="row">
//                   <div className="col-sm-3">
//                     <p className="mb-0">Full Name</p>
//                   </div>
//                   <div className="col-sm-9">
//                     <p className="text-muted mb-0">{student.name}</p>
//                   </div>
//                 </div>
//                 <hr />
//                 <div className="row">
//                   <div className="col-sm-3">
//                     <p className="mb-0">Email</p>
//                   </div>
//                   <div className="col-sm-9">
//                     <p className="text-muted mb-0">{student.email}</p>
//                   </div>
//                 </div>
//                 <hr />
//                 <div className="row">
//                   <div className="col-sm-3">
//                     <p className="mb-0">Mobile</p>
//                   </div>
//                   <div className="col-sm-9">
//                     <p className="text-muted mb-0">{profile.mobile_number}</p>
//                   </div>
//                 </div>
//                 <hr />
//                 <div className="row">
//                   <div className="col-sm-3">
//                     <p className="mb-0">Address</p>
//                   </div>
//                   <div className="col-sm-9">
//                     <p className="text-muted mb-0">{profile.address}</p>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }



import { useEffect, useState } from 'react';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ProfileImage from './ProfileImage';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Modal, Button, Form } from 'react-bootstrap';

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const [errors, setErrors] = useState({});
  const [details, setDetails] = useState({
    name: '',
    phoneNumber: ''
  });
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const fetchStudentDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Include token in request headers
        }
      };

      try {
        const response = await axios.get(`${baseURL}/api/auth/student/getStudentDetails`, config);
        setStudent(response.data);
        setDetails({
          name: response.data.name,
          phoneNumber: response.data.phoneNumber
        });
      } catch (error) {
        console.error('Error fetching student details:', error);
      }
    };

    fetchStudentDetails();
  }, []);

  useEffect(() => {
    const fetchProfileDetails = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        console.error("No token found");
        return;
      }

      const config = {
        headers: {
          Authorization: `Bearer ${token}` // Include token in request headers
        }
      };

      try {
        const response = await axios.get(`${baseURL}/api/student/profile/getProfileDetails`, config);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    fetchProfileDetails();
  }, []);

  const validateField = (name, value) => {
    let error = '';

    if (name === 'name') {
      if (!/^[a-zA-Z\s]+$/.test(value)) {
        error = 'This field should contain only letters';
      }
    }

    if (name === 'phoneNumber') {
      if (!/^\d{10}$/.test(value)) {
        error = 'Phone number should contain exactly 10 digits';
      }
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDetails(prevDetails => ({
      ...prevDetails,
      [name]: value,
    }));
    validateField(name, value);
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found");
      return;
    }

    const config = {
      headers: {
        Authorization: `Bearer ${token}` // Include token in request headers
      }
    };

    try {
      await axios.put(`${baseURL}/api/auth/student/updateStudentNameAndPhoneNumber`, details, config);
      toast.success("Student Name and PhoneNumber Updated Successfully");
      setShowModal(false);
      setStudent(prev => ({ ...prev, name: details.name, phoneNumber: details.phoneNumber }));
    } catch (error) {
      toast.error("Failed to update Name and PhoneNumber");
    }
  }

  const handleModalShow = () => setShowModal(true);
  const handleModalClose = () => setShowModal(false);

  if (!student || !profile) {
    return <div>Loading...</div>;
  }

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <ProfileImage style={{ width: '150px' }} className="rounded-circle img-fluid profile-image" />
                <h5 className="my-3">{student.name}</h5>
                <p className="text-muted mb-1">{profile.specialization}</p>
                <p className="text-muted mb-4">{profile.address}</p>
                <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary">Follow</button>
                  <button type="button" className="btn btn-outline-primary ms-1">Message</button>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-8">
            <div className="card mb-4">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Full Name</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{student.name}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Email</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{student.email}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Mobile</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{student.phoneNumber}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Address</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile.address}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <button className="btn btn-outline-primary" onClick={handleModalShow}>Update Details</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Update Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Full Name</Form.Label>
              <Form.Control
                type="text"
                name="name"
                value={details.name}
                onChange={handleChange}
                isInvalid={!!errors.name}
              />
              <Form.Control.Feedback type="invalid">
                {errors.name}
              </Form.Control.Feedback>
            </Form.Group>
            <Form.Group controlId="formPhoneNumber">
              <Form.Label>Phone Number</Form.Label>
              <Form.Control
                type="text"
                name="phoneNumber"
                value={details.phoneNumber}
                onChange={handleChange}
                isInvalid={!!errors.phoneNumber}
              />
              <Form.Control.Feedback type="invalid">
                {errors.phoneNumber}
              </Form.Control.Feedback>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleModalClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleUpdate}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
}

export default StudentDashboard;



