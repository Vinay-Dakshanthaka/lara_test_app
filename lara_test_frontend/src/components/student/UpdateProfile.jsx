import { useState, useEffect } from 'react';
import { baseURL } from '../config';
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import './styles/updateprofile.css';
import ProfileImage from './ProfileImage';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { Toast, Modal, Button } from 'react-bootstrap';
import { toast } from 'react-toastify';

const UpdateProfile = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [imageFile, setImageFile] = useState(null);
    const [errors, setErrors] = useState({});
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showWarningToast, setShowWarningToast] = useState(false);
    const [image, setImage] = useState("");
    const [profile, setProfile] = useState({
        name: '',
        gender: '',
        highest_education: '',
        year_of_passout: '',
        specialization: '',
        highest_education_percent: '',
        tenth_percentage: '',
        twelth_percentage: '',
        mobile_number: '',
        father_name: '',
        father_mobile_number: '',
        father_occupation: '',
        mother_name: '',
        adhaar_number: '',
        address: '',
        pincode: '',
        city: '',
        district: '',
        state: '',
        country: '',
    });

    useEffect(() => {
        const fetchProfileDetails = async () => {
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

        if (['name', 'gender', 'father_name', 'mother_name', 'specialization', 'father_occupation', 'city', 'district', 'state', 'country'].includes(name)) {
            if (!/^[a-zA-Z\s]+$/.test(value)) {
                error = 'This field should contain only letters';
            }
        }

        if (name === 'mobile_number' || name === 'father_mobile_number') {
            if (!/^\d{10}$/.test(value)) {
                error = 'Mobile number should contain exactly 10 digits';
            }
        }

        if (name === 'year_of_passout') {
            const currentYear = new Date().getFullYear();
            if (value < 2010 || value > currentYear + 2) {
                error = 'Year of passout should be between 2010 and ' + (currentYear + 2);
            }
        }

        if (name === 'adhaar_number') {
            if (!/^\d{12}$/.test(value)) {
                error = 'Aadhaar number should be exactly 12 digits';
            }
        }

        if (name === 'pincode') {
            if (!/^\d{6}$/.test(value)) {
                error = 'Pincode should be exactly 6 digits';
            }
        }

        setErrors(prevErrors => ({
            ...prevErrors,
            [name]: error,
        }));
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfile(prevProfile => ({
            ...prevProfile,
            [name]: value,
        }));
        validateField(name, value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }

        const isValid = Object.values(errors).every(error => !error);
        if (!isValid) {
            alert('Please fix the errors in the form');
            return;
        }

        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
        };

        try {
            await axios.post(`${baseURL}/api/student/profile/saveOrUpdateProfile`, profile, config);
            toast.success("Profile Details Upadated Successfully")
        } catch (error) {
            console.error('Error updating profile:', error);
            // alert('Failed to update profile');
            toast.error('Something Went wrong!!')
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        setImageFile(file);
        setShowConfirmModal(true);
    };

    const confirmImageUpload = async () => {
        console.log("Imageee",imageFile);
        if (imageFile.size > 1024 * 1024 || !['image/jpeg', 'image/png'].includes(imageFile.type)) {
            setShowConfirmModal(false);
            setShowWarningToast(true);
            return;
        }

        const formData = new FormData();
        formData.append("image", imageFile);

        try {
            const token = localStorage.getItem("token");
            if (!token) {
                console.error('No token found');
                return;
            }
            const config = {
                headers: {
                    Authorization: `Bearer ${token}`,
                    "Content-Type": "multipart/form-data",
                },
            };
            const response = await axios.post(
                `${baseURL}/api/auth/student/uploadProfileImage`,
                formData, config);

            const data = response.data;
            setShowConfirmModal(false);
            setShowSuccessToast(true);
            setImage(data.imagePath);
            window.location.reload();
        } catch (error) {
            console.error("Error uploading profile image:", error);
        }
    };

    // useEffect(() => {
    //     const fetchProfileImage = async () => {
    //       try {
    //         const token = localStorage.getItem('token');
    //         if(!token){
    //             return;
    //         }
    //         const response = await axios.get(`${baseURL}/api/auth/student/getProfileImage`, {
    //           headers: {
    //             Authorization: `Bearer ${token}`,
    //           },
    //           responseType: 'arraybuffer', // Receive the image as a buffer
    //         });
    
    //         // Convert the received image data to Base64
    //         const base64Image = btoa(
    //           new Uint8Array(response.data).reduce(
    //             (data, byte) => data + String.fromCharCode(byte),
    //             '',
    //           ),
    //         );
    
    //         // Set the image data to state
    //         setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
    //         // console.log("image "+image)
    //       } catch (error) {
    //         // console.error('Error fetching profile image:', error);
    //       }
    //     };
    
    //     fetchProfileImage();
    //   }, []);

    return (
        <div className="container rounded bg-white mt-5 mb-5 background">
            <div className="row">
                <div className="col-md-3 border-right">
                    <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                        <ProfileImage className="rounded-circle mt-5" style={{ width: '150px',height:'150px' }} />
                        <div className="edit-icon">
                            <FontAwesomeIcon icon={faEdit} size="sm" onClick={() => document.getElementById('fileInput').click()} style={{cursor:'pointer', width:'20px', height:'20px', marginTop:'10px'}}/>
                            <input
                                id="fileInput"
                                type="file"
                                accept="image/jpeg, image/png"
                                style={{ display: 'none' }}
                                onChange={handleImageUpload}
                            />
                        </div>
                        <span className="font-weight-bolder fs-3 mt-2">{profile.name}</span>
                    </div>
                </div>
                <div className="col-md-5 border-right">
                    <div className="p-3 py-5">
                        <div className="d-flex justify-content-between align-items-center mb-3">
                            <h4 className="text-right">Profile Settings</h4>
                        </div>
                        <form onSubmit={handleSubmit}>
                            <div className="row mt-2">
                                <div className="col-md-6">
                                    <label className="labels">Name</label>
                                    <input type="text" className="form-control" placeholder="Name" name="name" value={profile.name} onChange={handleChange} />
                                    {errors.name && <div className="text-danger">{errors.name}</div>}
                                </div>
                                <div className="col-md-6">
                                    <label className="labels">Gender</label>
                                    <input type="text" className="form-control" placeholder="Gender" name="gender" value={profile.gender} onChange={handleChange} />
                                    {errors.gender && <div className="text-danger">{errors.gender}</div>}
                                </div>
                            </div>
                            <div className="row mt-3">
                                <div className="col-md-12 my-2">
                                    <label className="labels">Mobile Number</label>
                                    <input type="text" className="form-control" placeholder="Mobile Number" name="mobile_number" value={profile.mobile_number} onChange={handleChange} />
                                    {errors.mobile_number && <div className="text-danger">{errors.mobile_number}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Highest Education</label>
                                    <input type="text" className="form-control" placeholder="Highest Education" name="highest_education" value={profile.highest_education} onChange={handleChange} />
                                    {errors.highest_education && <div className="text-danger">{errors.highest_education}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Year of Passout</label>
                                    <input type="number" className="form-control" placeholder="Year of Passout" name="year_of_passout" value={profile.year_of_passout} onChange={handleChange} />
                                    {errors.year_of_passout && <div className="text-danger">{errors.year_of_passout}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Specialization</label>
                                    <input type="text" className="form-control" placeholder="Specialization" name="specialization" value={profile.specialization} onChange={handleChange} />
                                    {errors.specialization && <div className="text-danger">{errors.specialization}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Highest Education Percent</label>
                                    <input type="number" className="form-control" placeholder="Highest Education Percent" name="highest_education_percent" value={profile.highest_education_percent} onChange={handleChange} />
                                    {errors.highest_education_percent && <div className="text-danger">{errors.highest_education_percent}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Tenth Percentage</label>
                                    <input type="number" className="form-control" placeholder="Tenth Percentage" name="tenth_percentage" value={profile.tenth_percentage} onChange={handleChange} />
                                    {errors.tenth_percentage && <div className="text-danger">{errors.tenth_percentage}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Twelth Percentage</label>
                                    <input type="number" className="form-control" placeholder="Twelth Percentage" name="twelth_percentage" value={profile.twelth_percentage} onChange={handleChange} />
                                    {errors.twelth_percentage && <div className="text-danger">{errors.twelth_percentage}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Father's Name</label>
                                    <input type="text" className="form-control" placeholder="Father's Name" name="father_name" value={profile.father_name} onChange={handleChange} />
                                    {errors.father_name && <div className="text-danger">{errors.father_name}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Father's Mobile Number</label>
                                    <input type="text" className="form-control" placeholder="Father's Mobile Number" name="father_mobile_number" value={profile.father_mobile_number} onChange={handleChange} />
                                    {errors.father_mobile_number && <div className="text-danger">{errors.father_mobile_number}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Father's Occupation</label>
                                    <input type="text" className="form-control" placeholder="Father's Occupation" name="father_occupation" value={profile.father_occupation} onChange={handleChange} />
                                    {errors.father_occupation && <div className="text-danger">{errors.father_occupation}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Mother's Name</label>
                                    <input type="text" className="form-control" placeholder="Mother's Name" name="mother_name" value={profile.mother_name} onChange={handleChange} />
                                    {errors.mother_name && <div className="text-danger">{errors.mother_name}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Aadhaar Number</label>
                                    <input type="text" className="form-control" placeholder="Aadhaar Number" name="adhaar_number" value={profile.adhaar_number} onChange={handleChange} />
                                    {errors.adhaar_number && <div className="text-danger">{errors.adhaar_number}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Address</label>
                                    <input type="text" className="form-control" placeholder="Address" name="address" value={profile.address} onChange={handleChange} />
                                    {errors.address && <div className="text-danger">{errors.address}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Pincode</label>
                                    <input type="text" className="form-control" placeholder="Pincode" name="pincode" value={profile.pincode} onChange={handleChange} />
                                    {errors.pincode && <div className="text-danger">{errors.pincode}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">City</label>
                                    <input type="text" className="form-control" placeholder="City" name="city" value={profile.city} onChange={handleChange} />
                                    {errors.city && <div className="text-danger">{errors.city}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">District</label>
                                    <input type="text" className="form-control" placeholder="District" name="district" value={profile.district} onChange={handleChange} />
                                    {errors.district && <div className="text-danger">{errors.district}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">State</label>
                                    <input type="text" className="form-control" placeholder="State" name="state" value={profile.state} onChange={handleChange} />
                                    {errors.state && <div className="text-danger">{errors.state}</div>}
                                </div>
                                <div className="col-md-12 my-2">
                                    <label className="labels">Country</label>
                                    <input type="text" className="form-control" placeholder="Country" name="country" value={profile.country} onChange={handleChange} />
                                    {errors.country && <div className="text-danger">{errors.country}</div>}
                                </div>
                            </div>
                            <div className="mt-5 text-center">
                                <button className="btn btn-primary profile-button" type="submit">Save Profile</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

            <Toast show={showSuccessToast} onClose={() => setShowSuccessToast(false)} delay={3000} autohide>
                <Toast.Body>Image uploaded successfully!</Toast.Body>
            </Toast>
            <Toast show={showWarningToast} onClose={() => setShowWarningToast(false)} delay={3000} autohide>
                <Toast.Body>File size should be less than 1MB and in JPEG or PNG format!</Toast.Body>
            </Toast>
            <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Image Upload</Modal.Title>
                </Modal.Header>
                <Modal.Body>Are you sure you want to upload this image?</Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>Cancel</Button>
                    <Button variant="primary" onClick={confirmImageUpload}>Upload</Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default UpdateProfile;
