import React, { useEffect, useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { baseURL } from '../config';

function ProfileImage({style}) {
    
    const [image, setImage] = useState("");
    useEffect(() => {
        const fetchProfileImage = async () => {
          try {
            const token = localStorage.getItem('token');
            if(!token){
                return;
            }
            const response = await axios.get(`${baseURL}/api/auth/student/getProfileImage`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
              responseType: 'arraybuffer', // Receive the image as a buffer
            });
    
            // Convert the received image data to Base64
            const base64Image = btoa(
              new Uint8Array(response.data).reduce(
                (data, byte) => data + String.fromCharCode(byte),
                '',
              ),
            );
    
            // Set the image data to state
            setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
            // console.log("image "+image)
          } catch (error) {
            // console.error('Error fetching profile image:', error);
          }
        };
    
        fetchProfileImage();
      }, []);
    return  (


        <img 
          src={image || "https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-chat/ava3.webp"} 
          alt="avatar" 
          className="rounded-circle img-fluid" 
          style={style || {width: '100px'}} 
        />
      );
}

export default ProfileImage
