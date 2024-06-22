import { useEffect, useState } from 'react';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import ProfileImage from './ProfileImage';
import { useNavigate } from 'react-router-dom';

function StudentDashboard() {
  const [student, setStudent] = useState(null);
  const [profile, setProfile] = useState(null);
  const navigate = useNavigate();

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
        console.log("student ", response.data);
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
        console.log("response of profile ", response);
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile details:', error);
      }
    };

    fetchProfileDetails();
  }, []);

  if (!student) {
    return <div>Loading...</div>;
  }

  return (
    <section style={{ backgroundColor: '#eee' }}>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-4">
            <div className="card mb-4">
              <div className="card-body text-center">
                <ProfileImage style={{ width: '150px' , height:'150px'}} className="rounded-circle img-fluid profile-image" />
                <h5 className="my-3">{student.name}</h5>
                <p className="text-muted mb-1">{profile?.specialization || 'N/A'}</p>
                <p className="text-muted mb-4">{profile?.address || 'N/A'}</p>
                
                <div className="d-flex justify-content-center mb-2">
                  <button type="button" className="btn btn-primary" onClick={()=>{navigate('/update-profile')}}>Update Profile</button>
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
                    <p className="text-muted mb-0">{profile?.mobile_number || 'N/A'}</p>
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <p className="mb-0">Address</p>
                  </div>
                  <div className="col-sm-9">
                    <p className="text-muted mb-0">{profile?.address || 'N/A'}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default StudentDashboard;
