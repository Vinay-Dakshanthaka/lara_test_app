const db = require("../models");

const Drive = db.Drive;
const Student = db.Student;
const Company = db.Company;
const Skill = db.Skill;
const Drive_Skill = db.Drive_Skill;
const Student_Skill = db.Student_Skill;

const saveDrive = async (req, res) => {
  try {
    const id = req.student_id;
    const user = await Student.findByPk(id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }

    const { company_id, drive_date,drive_time, drive_location } = req.body;
    console.log('compnay id--------------------------- :'  , company_id)
    // console.log(company_id);
    const company = await Company.findByPk(company_id);
    if(!company)
      return res.status(404).send({message : 'Company not found'});
    
    const newDrive = await Drive.create({
      company_id,
      drive_date,
      drive_location,
      drive_time
    });
    return res.status(200).send({ message: "Drive Created Successfully", newDrive: newDrive });

  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};

const updateDrive = async (req, res) => {
  try {
    const id = req.student_id;
    const user = await Student.findByPk(id);
    const userRole = user.role;
    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const { drive_id, drive_date, drive_time, drive_location } = req.body;
    const existingDrive = await Drive.findByPk(drive_id);
    if (!existingDrive) {
      return res.status(404).send({ message: "Drive doesn't exist" });
    }
    existingDrive.drive_date = drive_date;
    existingDrive.drive_location = drive_location;
    existingDrive.drive_time = drive_time;


    await existingDrive.save();
    return res.status(200).send({ message: "Drive Updated Successfully", drive: existingDrive });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message });
  }
};


const getAllDrives = async (req, res) => {
    try {
        const drives = await Drive.findAll();
        
        if (!drives || drives.length === 0) {
            return res.status(404).send({ message: 'No Drives Available' });
        }

        // Fetch company details for each drive
        const driveDetails = await Promise.all(drives.map(async (drive) => {
            const company = await Company.findByPk(drive.company_id);
            return {
                drive,
                company
            };
        }));

        return res.status(200).send({ drives: driveDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: "Error Fetching Drives" });
    }
}

module.exports = { getAllDrives };


const getDrivesByCompanyId = async (req, res) => {
    try {
      const { company_id } = req.query;
      const drives = await Drive.findAll({ where: { company_id } });
      if (!drives) {
        return res.status(404).send({ message: "No Drives Found for this Company" });
      }
      return res.status(200).send({ drives });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: "Error Fetching Drives" });
    }
};
  
// const getDrivesByJobId = async (req, res) => {
//   try {
//     const { job_id } = req.query;
//     const drives = await Drive.findAll({ where: { job_id } });
//     if (!drives) {
//       return res.status(404).send({ message: "No Drives Found for this Job" });
//     }
//     res.status(200).send({ drives });
//   } catch (error) {
//     console.log(error);
//     res.status(500).send({ message: "Error Fetching Drives" });
//   }
// };

// const addSkillsToDrive = async (req, res) => {
//   try {
//       const { drive_id, skill_ids } = req.body; 

//       if (!drive_id || !skill_ids) {
//           return res.status(400).json({ error: 'Missing skillId or driveId in request body' });
//       }

//       // Fetch the drive from the database using the driveId
//       const drive = await Drive.findByPk(drive_id);

//       // Ensure the drive exists
//       if (!drive) {
//           return res.status(404).json({ error: 'Drive not found' });
//       }

//       // Fetch all skills from the database using the skillIds
//       const skills = await Skill.findAll({ where: { skill_ids } });

//       // Ensure all skills exist
//       if (skills.length !== skill_ids.length) {
//           return res.status(404).json({ error: 'One or more skills not found' });
//       }

//       // Associate the drive with the skill by creating records in the DriveSkill table
//       await Promise.all(skill_ids.map(async skill_id => {
//           await Drive_Skill.create({
//               skill_id: skill_id,
//               drive_id: drive_id
//           });
//       }));

//       res.status(200).json({ message: 'Skills added to drive successfully.' });
//   } catch (error) {
//       console.error('Failed to add skills to drive.', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const removeSkillFromDrive = async (req, res) => {
//   try {
//       const { drive_id, skill_id } = req.body; 

//       if (!drive_id || !skill_id) {
//           return res.status(400).json({ error: 'Missing driveId or skillId in request body' });
//       }

//       await Drive_Skill.destroy({ where: { drive_id, skill_id } });

//       res.status(200).json({ message: 'Skill removed from drive successfully.' });
//   } catch (error) {
//       console.error('Failed to remove skill from drive.', error);
//       res.status(500).json({ error: 'Internal server error' });
//   }
// };

// const getStudentsByDriveId = async(req, res) => {
//   try{
//     const {drive_id} = req.body;
//     const skills = await Drive_Skill.findAll({ where : { drive_id }});
//     const skillIds = skills.map(skill => skill.dataValues.skill_id);
//     console.log("Skills",skills);
//     console.log("Skills",skillIds);
//     const student = await Student_Skill.findAll({ where : { skill_id: skillIds}});
//     console.log(student.student_id, "studentsssssssssssssssssssssssssssssssssssssssssssssssssssssss");
//   }
//   catch(error){
//     return res.status(500).send(error);
//   }
// }

module.exports = {
  saveDrive,
  updateDrive,
  getAllDrives,
  getDrivesByCompanyId,
  //getDrivesByJobId,
  // addSkillsToDrive,
  // removeSkillFromDrive,
  // getStudentsByDriveId,
};
