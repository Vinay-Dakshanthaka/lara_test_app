import React, { useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';

const WebinarForm = ({ webinar, onSuccess }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        date: '',
        time: '',
        duration: '',
        speaker: '',
        link: '',
      });
    
      const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
      };
    
      const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token'); // Assumes token is stored in local storage
        const config = { headers: { Authorization: `Bearer ${token}` } };
    
        try {
          await axios.post(`${baseURL}/api/webinars/add-webinars-trainings`, formData, config);
        //   onSuccess();
        //   setFormData({
        //     title: '',
        //     description: '',
        //     date: '',
        //     time: '',
        //     duration: '',
        //     speaker: '',
        //     link: '',
        //   });
        toast.success('Webinar/Training Added Successfully!!!!')
        } catch (error) {
          console.error(error);
          toast.error('Something Went wrong!!!')
        }
      };
    
      return (
        <>
          <div className="container mt-5">
          <form onSubmit={handleSubmit}>
          <div className="form-group">
            <h2 className='text-center'>Add Webinar</h2>
            <label>Title</label>
            <input type="text" className="form-control" name="title" value={formData.title} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Description</label>
            <textarea className="form-control" name="description" value={formData.description} onChange={handleChange} required></textarea>
          </div>
          <div className="form-group">
            <label>Date</label>
            <input type="date" className="form-control" name="date" value={formData.date} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Time</label>
            <input type="time" className="form-control" name="time" value={formData.time} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Duration</label>
            <input type="text" className="form-control" name="duration" value={formData.duration} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Speaker</label>
            <input type="text" className="form-control" name="speaker" value={formData.speaker} onChange={handleChange} required />
          </div>
          <div className="form-group">
            <label>Link</label>
            <input type="url" className="form-control" name="link" value={formData.link} onChange={handleChange} required />
          </div>
          <button type="submit" className="btn btn-primary">Add Webinar/Training</button>
        </form>
        <ToastContainer/>
          </div>
        </>
      );    
};

export default WebinarForm;
