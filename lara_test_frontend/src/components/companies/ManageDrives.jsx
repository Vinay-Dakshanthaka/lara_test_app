import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { baseURL } from "../config";

function ManageDrives() {
  const [date, setDate] = useState("");
  const [year, setYear] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [month, setMonth] = useState("");
  const [drives, setDrives] = useState([]);
  const [criteria, setCriteria] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchAllDrives = async () => {
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
        const response = await axios.get(`${baseURL}/api/drive/fetchAll`, config)
        setDrives(response.data.allDriveInfo);
        setMessage("Drive Fetched Successfully" || " ");
      } catch (error) {
        console.log(error);
      }
    };
    fetchAllDrives();
  }, []);



  const fetchDrives = async () => {
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

      let response;
      switch (criteria) {
        case "date":
          response = await axios.post(
            `${baseURL}/api/drive/fetchDrivesByDate`,
            { drive_date: date },
            config
          );
          break;
        case "year":
          response = await axios.post(
            `${baseURL}/api/drive/fetchDrivesByYear`,
            { drive_year: year },
            config
          );
          break;
        case "month":
          response = await axios.post(
            `${baseURL}/api/drive/fetchDrivesByMonth`,
            { drive_month: month },
            config
          );
          break;
        case "between_dates":
          response = await axios.post(
            `${baseURL}/api/drive/fetchDrivesBetweenDates`,
            { startDate, endDate },
            config
          );
          break;
        case "all":
          response = await axios.get(`${baseURL}/api/drive/fetchAll`, config);
          console.log("response", response);
          break;
        default:
          response = await axios.get(`${baseURL}/api/drive/fetchAll`, config);
      }

      console.log(response.data.allDriveInfo);
      setDrives(response.data.allDriveInfo);
      setMessage("Drive Fetched Successfully" || " ");
    } catch (error) {
      console.log(error);
    }
  };


  const triggerFetchAll = () => {
    window.location.reload();
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Drive History</h2>
      <div className="form-group">
        <label htmlFor="criteria">Select Criteria:</label>
        <p>{message}</p>
        <select
          className="form-control"
          id="criteria"
          value={criteria}
          onChange={(e) => setCriteria(e.target.value)}
        >
          <option value="">-- Select Criteria --</option>
          <option value="date">By Date</option>
          <option value="year">By Year</option>
          <option value="month">By Month</option>
          <option value="between_dates">Between Dates</option>
          <option value="all" >
            All Drives
          </option>
        </select>
      </div>

      {criteria !== "all" && (
        <div className="form-group">
          {criteria === "between_dates" && (
            <div>
              <label htmlFor="startDate">Start Date:</label>
              <input
                type="date"
                className="form-control"
                id="startDate"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <label htmlFor="endDate" className="mt-2">
                End Date:
              </label>
              <input
                type="date"
                className="form-control"
                id="endDate"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          )}

          {criteria === "month" && (
            <div>
              <label htmlFor="month">Month:</label>
              <input
                type="month"
                className="form-control"
                id="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
              />
            </div>
          )}

          {criteria === "date" && (
            <div>
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                className="form-control"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
          )}

          {criteria === "year" && (
            <div>
              <label htmlFor="year">Year:</label>
              <input
                type="number"
                className="form-control"
                id="year"
                value={year}
                onChange={(e) => setYear(e.target.value)}
              />
            </div>
          )}

          <button className="btn btn-primary mt-3" onClick={fetchDrives}>
            Fetch Drives
          </button>
        </div>
      )}

      {criteria === 'all' && 
        <button className="btn btn-primary mt-3" onClick={fetchDrives}>
          Fetch All Drives
        </button>
      }

      <div className="mt-5">
        <h3>Drive Details</h3>
        {drives.length > 0 ? (
          <table className="table table-bordered">
            <thead>
              <tr>
                <th>Company Name</th>
                <th>Drive Date</th>
                <th>Drive Time</th>
                <th>Drive Location</th>
              </tr>
            </thead>
            <tbody>
              {drives.map((drive) => (
                <tr key={drive.drive_id}>
                  <td>{drive.company_name}</td>
                  <td>{drive.drive_date}</td>
                  <td>{drive.drive_time}</td>
                  <td>{drive.drive_location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No drives found.</p>
        )}
      </div>
    </div>
  );
}

export default ManageDrives;
