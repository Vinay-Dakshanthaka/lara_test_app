import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import Skeleton from 'react-loading-skeleton'; // Import skeleton loading library

function AnyCompanyLogo({ companyId, style }) {
  const [image, setImage] = useState("");
  const [isLoading, setIsLoading] = useState(true); // State to track loading state

  useEffect(() => {
    const fetchCompanyLogo = async () => {
      try {
        const response = await axios.post(
          `${baseURL}/api/company/getAnyImageLogo`,
          {
            company_id: companyId
          },
          {
            responseType: 'arraybuffer', // Receive the image as a buffer
          }
        );

        // Convert the received image data to Base64
        const base64Image = btoa(
          new Uint8Array(response.data).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            '',
          ),
        );

        // Set the image data to state and indicate loading complete
        setImage(`data:${response.headers['content-type']};base64,${base64Image}`);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching company logo:', error);
        setIsLoading(false); // Handle error by setting loading to false
      }
    };

    fetchCompanyLogo();
  }, [companyId]);

  return (
    <div style={{ ...style, position: 'relative' }}>
      {isLoading ? (
        // Skeleton loading animation while image is loading
        <Skeleton width={'100%'} height={'100%'} />
      ) : (
        // Render actual image once loaded
        <img 
          src={image || "https://via.placeholder.com/150"}  // Placeholder URL or default image
          alt="company logo" 
          className="img-fluid"
          style={{ display: isLoading ? 'none' : 'block', ...style }}
        />
      )}
    </div>
  );
}

export default AnyCompanyLogo;
