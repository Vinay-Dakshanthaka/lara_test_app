import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { baseURL } from '../config';
import AnyCompanyLogo from '../admin/AnyCompanyLogo';

const CompanyDetails = ({ companyId }) => {
  const [company, setCompany] = useState(null);
    // console.log('company id ', companyId)
  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          console.log('No token provided');
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(
          `${baseURL}/api/company/company/${companyId}`,
          config
        );
        // console.log('response ', response)
        const fetchedCompany = response.data;
        if (fetchedCompany) {
          setCompany(fetchedCompany);
        } else {
          console.log('Company not found');
        }
      } catch (error) {
        console.error('Error fetching company details:', error);
      }
    };

    fetchCompanyDetails();
  }, [companyId]);

  return (
    <>
      {company && (
        <div className="mb-4">
          <h2 className="text-center mb-4">
            {company.name}
          </h2>
          <div className="row">
            <div className="col-lg-12 col-sm-12">
              <p>
                <AnyCompanyLogo companyId={company.company_id} style={{ width: '50px', height: '50px', borderRadius: '5%', margin: '10px' }} />
                {company.name}
              </p>
            </div>
            <div className="col-lg-6 col-sm-12">
              <p><strong>Address:</strong> {company.address}</p>
            </div>
            <div className="col-lg-6 col-sm-12">
              <p><strong>Email:</strong> {company.general_mail_id}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default CompanyDetails;
