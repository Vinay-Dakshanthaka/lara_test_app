import React, { useState, useEffect } from 'react';
import axios from 'axios';
import WebinarForm from './WebinarForm';
import { baseURL } from '../config';
import { ToastContainer, toast } from 'react-toastify';

const WebinarList = () => {
    const [webinars, setWebinars] = useState([]);
    const [editingWebinar, setEditingWebinar] = useState(null);
  
    useEffect(() => {
      fetchWebinars();
    }, []);
  
    const fetchWebinars = async () => {
      const token = localStorage.getItem('token'); // Assumes token is stored in local storage
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      try {
        const response = await axios.get(`${baseURL}/api/webinars/getAllWebinars`, config);
        setWebinars(response.data);
      } catch (error) {
        console.error(error);
      }
    };
  
    const handleDelete = async (id) => {
      const token = localStorage.getItem('token'); // Assumes token is stored in local storage
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      try {
        await axios.delete(`${baseURL}/api/webinars/delete-webinars`, { data: { id }, ...config });
        fetchWebinars();
        toast.success('Webinar/Training deleted Successfully!!')
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong!!')
      }
    };
  
    const handleEdit = (webinar) => {
      setEditingWebinar(webinar);
    };
  
    const handleUpdate = async (e) => {
      e.preventDefault();
      const token = localStorage.getItem('token'); // Assumes token is stored in local storage
      const config = { headers: { Authorization: `Bearer ${token}` } };
  
      try {
        await axios.put(`${baseURL}/api/webinars/update-webinars-Trainings`, { ...editingWebinar }, config);
        setEditingWebinar(null);
        fetchWebinars();
        toast.success('Updated Successfully!!')
      } catch (error) {
        console.error(error);
        toast.error('Something went wrong!!')
      }
    };
  
    const handleChange = (e) => {
      setEditingWebinar({ ...editingWebinar, [e.target.name]: e.target.value });
    };
  
    return (
      <div className="container">
        <h1 className="my-4">Webinars and Trainings</h1>
        <table className="table table-striped mt-4">
          <thead>
            <tr>
              <th>Title</th>
              <th>Description</th>
              <th>Date</th>
              <th>Time</th>
              <th>Duration</th>
              <th>Speaker</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {webinars.map((webinar) => (
              <tr key={webinar.id}>
                <td>{webinar.title}</td>
                <td>{webinar.description}</td>
                <td>{webinar.date}</td>
                <td>{webinar.time}</td>
                <td>{webinar.duration}</td>
                <td>{webinar.speaker}</td>
                <td><a href={webinar.link} target="_blank" rel="noopener noreferrer">Link</a></td>
                <td>
                  <button className="btn btn-warning btn-sm mr-2" onClick={() => handleEdit(webinar)}>Edit</button>
                  <button className="btn btn-danger btn-sm" onClick={() => handleDelete(webinar.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
  
        {editingWebinar && (
          <form onSubmit={handleUpdate}>
            <div className="form-group">
              <label>Title</label>
              <input type="text" className="form-control" name="title" value={editingWebinar.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Description</label>
              <textarea className="form-control" name="description" value={editingWebinar.description} onChange={handleChange} required></textarea>
            </div>
            <div className="form-group">
              <label>Date</label>
              <input type="date" className="form-control" name="date" value={editingWebinar.date} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Time</label>
              <input type="time" className="form-control" name="time" value={editingWebinar.time} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Duration</label>
              <input type="text" className="form-control" name="duration" value={editingWebinar.duration} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Speaker</label>
              <input type="text" className="form-control" name="speaker" value={editingWebinar.speaker} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Link</label>
              <input type="url" className="form-control" name="link" value={editingWebinar.link} onChange={handleChange} required />
            </div>
            <button type="submit" className="btn btn-primary">Update Webinar/Training</button>
            <button type="button" className="btn btn-secondary ml-2" onClick={() => setEditingWebinar(null)}>Cancel</button>
          </form>
        )}
        <ToastContainer />
      </div>
    );
};

export default WebinarList;
