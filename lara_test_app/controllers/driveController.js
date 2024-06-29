const db = require("../models");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Sequelize } = require("sequelize");
const xlsx = require("xlsx");

const Drive = db.Drive;
const Student = db.Student;

const saveDrive = async (req, res) => {
  try {
    const id = req.student_id;
    const user = await Student.findByPk(id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      res.status(403).send({ message: "Access Forbidden" });
    }

    const { company_id, job_id, drive_date, drive_location } = req.body;

    const newDrive = await Drive.create({
      company_id,
      job_id,
      drive_date,
      drive_location,
    });
    res
      .status(200)
      .send({ message: "Drive Created Successfully", newDrive: newDrive });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const updateDrive = async (req, res) => {
  try {
    const id = req.student_id;
    const user = await Student.findByPk(id);
    const userRole = user.role;
    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      res.status(403).send({ message: "Access Forbidden" });
    }
    const { drive_id, drive_date, drive_location } = req.body;
    const existingDrive = await Drive.findOne({ where: { drive_id:drive_id } });
    if (!existingDrive) {
      res.status(404).send({ message: "Drive Doesnot exist" });
    }
    existingDrive.drive_date = drive_date;
    existingDrive.drive_location = drive_location;
    return res.status(200).send({ message: "Drive Updated Successfully", drive: existingDrive });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const getAllDrives = async(req, res) => {
    try{
        const drives = await Drive.findAll();
        if(!drives){
            return res.status(404).send({message: 'No Drives Available'});
        }
        res.status(200).send({drives});
    }
    catch(error){
        console.log(error);
        res.status(500).send({message: "Error Fetching Drives"})
    }
}

const getDrivesByCompanyId = async (req, res) => {
    try {
      const { company_id } = req.query;
      const drives = await Drive.findAll({ where: { company_id } });
      if (!drives) {
        return res.status(404).send({ message: "No Drives Found for this Company" });
      }
      res.status(200).send({ drives });
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Error Fetching Drives" });
    }
  };
  
const getDrivesByJobId = async (req, res) => {
  try {
    const { job_id } = req.query;
    const drives = await Drive.findAll({ where: { job_id } });
    if (!drives) {
      return res.status(404).send({ message: "No Drives Found for this Job" });
    }
    res.status(200).send({ drives });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: "Error Fetching Drives" });
  }
};


module.exports = {
  saveDrive,
  updateDrive,
  getAllDrives,
  getDrivesByCompanyId,
  getDrivesByJobId,

};
