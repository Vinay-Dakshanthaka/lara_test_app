// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { baseURL } from "../config";
// import "bootstrap/dist/css/bootstrap.min.css";
// import { Button } from "react-bootstrap";

// const ViewInteractions = () => {
//   const [interactions, setInteractions] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchInteractions = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) {
//           console.log("No token found");
//           return;
//         }

//         const config = {
//           headers: {
//             Authorization: `Bearer ${token}`,
//           },
//         };

//         const response = await axios.get(`${baseURL}/api/interaction/getInteractionsWithAgents`, config);
//         console.log(response);
//         setInteractions(response.data || []);
//         setLoading(false);
//       } catch (error) {
//         console.error("Error fetching interactions:", error);
//         setError("Error fetching interactions");
//         setLoading(false);
//       }
//     };

//     fetchInteractions();
//   }, []);

//   if (loading) {
//     return <div>Loading...</div>;
//   }

//   if (error || interactions.length === 0) {
//     return (
//       <div className="container mt-5">
//         <h2 className="text-center mb-4">Interactions</h2>
//         <p className="text-center">{error || "No interactions found"}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="container mt-5">
//       <h2 className="text-center mb-4">Interactions</h2>
//       <table className="table table-striped table-hover">
//         <thead className="thead-dark">
//           <tr>
//             <th>Company Name</th>
//             <th>Agent Name</th>
//             <th>Interaction Info</th>
//             <th>Date</th>
//             <th>Time</th>
//             <th>Next Interaction Date</th>
//           </tr>
//         </thead>
//         <tbody>
//           {interactions.map((interaction) => (
//             <tr key={interaction.interaction_id}>
//               <td>{interaction.company_name}</td>
//               <td>{interaction.agent_name}</td>
//               <td>{interaction.interaction_info}</td>
//               <td>{interaction.interaction_date}</td>
//               <td>{interaction.interaction_time}</td>
//               <td>{interaction.next_interaction_date}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default ViewInteractions;



{/*}

import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import { Button } from "react-bootstrap";
import moment from "moment"; // Import moment for date manipulation

const ViewInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/interaction/getInteractionsWithAgents`, config);
        console.log(response);
        setInteractions(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interactions:", error);
        setError("Error fetching interactions");
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  const isDateNear = (date) => {
    const now = moment();
    const interactionDate = moment(date);
    return interactionDate.diff(now, 'days') <= 3 && interactionDate.diff(now, 'days') >= 0;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || interactions.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Interactions</h2>
        <p className="text-center">{error || "No interactions found"}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Interactions</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Company Name</th>
            <th>Agent Name</th>
            <th>Interaction Info</th>
            <th>Date</th>
            <th>Time</th>
            <th>Next Interaction Date</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((interaction) => (
            <tr key={interaction.interaction_id} className={isDateNear(interaction.next_interaction_date) ? "table-warning" : ""}>
              <td>{interaction.company_name}</td>
              <td>{interaction.agent_name}</td>
              <td>{interaction.interaction_info}</td>
              <td>{interaction.interaction_date}</td>
              <td>{interaction.interaction_time}</td>
              <td>{interaction.next_interaction_date}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewInteractions;

*/}


import React, { useEffect, useState } from "react";
import axios from "axios";
import { baseURL } from "../config";
import "bootstrap/dist/css/bootstrap.min.css";
import 'bootstrap-icons/font/bootstrap-icons.css';
import moment from "moment";

const ViewInteractions = () => {
  const [interactions, setInteractions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchInteractions = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("No token found");
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        const response = await axios.get(`${baseURL}/api/interaction/getInteractionsWithAgents`, config);
        console.log(response);
        setInteractions(response.data || []);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching interactions:", error);
        setError("Error fetching interactions");
        setLoading(false);
      }
    };

    fetchInteractions();
  }, []);

  useEffect(() => {
    // Initialize Bootstrap tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-toggle="tooltip"]'));
    const tooltipList = tooltipTriggerList.map((tooltipTriggerEl) => new window.bootstrap.Tooltip(tooltipTriggerEl));
  }, [interactions]);

  const isDateNear = (date) => {
    const now = moment();
    const interactionDate = moment(date);
    return interactionDate.diff(now, 'days') < 3 && interactionDate.diff(now, 'days') >= 0;
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error || interactions.length === 0) {
    return (
      <div className="container mt-5">
        <h2 className="text-center mb-4">Interactions</h2>
        <p className="text-center">{error || "No interactions found"}</p>
      </div>
    );
  }

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Interactions</h2>
      <table className="table table-striped table-hover">
        <thead className="thead-dark">
          <tr>
            <th>Company Name</th>
            <th>Agent Name</th>
            <th>Interaction Info</th>
            <th>Date</th>
            <th>Time</th>
            <th>Next Interaction Date</th>
            <th>Notification</th>
          </tr>
        </thead>
        <tbody>
          {interactions.map((interaction) => (
            <tr key={interaction.interaction_id}>
              <td>{interaction.company_name}</td>
              <td>{interaction.agent_name}</td>
              <td>{interaction.interaction_info}</td>
              <td>{interaction.interaction_date}</td>
              <td>{interaction.interaction_time}</td>
              <td>{interaction.next_interaction_date}</td>
              <td>
                {isDateNear(interaction.next_interaction_date) && (
                  <i
                    className="bi bi-exclamation-circle-fill text-danger"
                    data-toggle="tooltip"
                    title="Upcoming interaction date"
                  ></i>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ViewInteractions;
