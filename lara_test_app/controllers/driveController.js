const db = require("../models");

const Drive = db.Drive;
const Student = db.Student;
const Company = db.Company;

const saveDrive = async (req, res) => {
  try {
    const id = req.student_id;
    const user = await Student.findByPk(id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      res.status(403).send({ message: "Access Forbidden" });
    }

    const { job_title, job_description, company_id, no_of_openings, position, job_location, drive_date, drive_location } = req.body;
    
    const company = await Company.findByPk(company_id);
    if(!company)
      res.status(403).send({message : 'Company not found'});

    let drive = await Drive.findOne({where : {job_title : job_title, company_id : company_id}});
    if(!drive){
      const newDrive = await Drive.create({
        job_title,
        job_description,
        company_id,
        no_of_openings,
        position,
        job_location,
        drive_date,
        drive_location,
      });
      res.status(200).send({ message: "Drive Created Successfully", newDrive: newDrive });
    }
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
    const { drive_id, job_title, job_description, no_of_openings, position, job_location, drive_date, drive_location } = req.body;
    const existingDrive = await Drive.findByPk(drive_id);
    if (!existingDrive) {
      res.status(404).send({ message: "Drive Doesnot exist" });
    }
    existingDrive.job_title = job_title;
    existingDrive.job_description = job_description;
    existingDrive.no_of_openings = no_of_openings;
    existingDrive.position = position;
    existingDrive.job_location = job_location;
    existingDrive.drive_date = drive_date;
    existingDrive.drive_location = drive_location;

    await existingDrive.save();
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
