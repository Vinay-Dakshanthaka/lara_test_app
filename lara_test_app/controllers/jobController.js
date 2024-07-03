const db = require('../models');

const Job = db.Job;
const Company = db.Company;
const Drive = db.Drive;
const Skill = db.Skill;
const Job_Skill = db.Job_Skill;

const saveJob = async(req, res) => {
    try{
        const student_id = req.student_id;
        const student = await db.Student.findByPk(student_id);
        const role = student.role;
        
        if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            res.status(403).send({message : 'Access Forbidden'});

        const {drive_id, year_of_exp, job_title, description, no_of_openings, job_location, position, total_rounds} = req.body;

        const drive = await Drive.findByPk(drive_id);
        if(!drive)
            res.status(403).send({message : 'Drive not found'});

        const job = await Job.create({job_title, description, no_of_openings, year_of_exp, job_location, position, total_rounds, drive_id});
        res.status(200).send({message : 'successfully saved' , job});
        
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }
    
}

const updateJob = async(req, res) => {
    try{
        const student_id = req.student_id;
        const student = await db.Student.findByPk(student_id);
        const role = student.role;
        
        if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            res.status(403).send({message : 'Access Forbidden'});

        const {job_id, job_title, description, no_of_openings, job_location, position, total_rounds, year_of_exp} = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if(!job)
            res.status(403).send({message : 'Job not found'});

        await Job.update({job_title, description, no_of_openings, job_location, position, total_rounds, year_of_exp}, {where : {job_id}});
        job = await Job.findByPk(job_id);
        
        res.status(200).send({message : 'Job successfully updated' , job});
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }
    
}

const deleteJob = async(req, res) => {
    try{
        const student_id = req.student_id;
        const student = await db.Student.findByPk(student_id);
        const role = student.role;
        
        if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            res.status(403).send({message : 'Access Forbidden'});

        const {job_id} = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if(!job)
            res.status(403).send({message : 'Job not found'});

        await Job.destroy({where : {job_id}});

        res.status(200).send({message : 'Job successfully deleted'});
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }
    
}

const getJobByJobId = async(req, res) => {
    try{
        // const student_id = req.student_id;
        // const student = await db.Student.findByPk(student_id);
        // const role = student.role;
        
        // if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
        //     res.status(403).send({message : 'Access Forbidden'});

        const {job_id} = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if(!job)
            res.status(403).send({message : 'Job not found'});

        res.status(200).send({job});
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }
    
}

const getJobsByDriveId = async(req, res) => {
    try{
        // const student_id = req.student_id;
        // const student = await db.Student.findByPk(student_id);
        // const role = student.role;
        
        // if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
        //     res.status(403).send({message : 'Access Forbidden'});

        const {drive_id} = req.query;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findAll({where : {drive_id}});
        console.log(job);
        if(job.length === 0)
            res.status(404).send({message : 'Job not found'});

        res.status(200).send({job});
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }  
}

const addSkillsToJob = async (req, res) => {
    try {
        const { job_id, skill_ids } = req.body; 
  
        if (!job_id || !skill_ids) {
            return res.status(400).json({ error: 'Missing skillId or job_id in request body' });
        }
  
        const job = await Job.findByPk(job_id);
  
        // Ensure the job exists
        if (!job) {
            return res.status(404).json({ error: 'Job not found' });
        }
  
        // Fetch all skills from the database using the skillIds
        const skills = await Skill.findAll({ where: { skill_id : skill_ids } });
  
        // Ensure all skills exist
        if (skills.length !== skill_ids.length) {
            return res.status(404).json({ error: 'One or more skills not found' });
        }
  
        // Associate the job with the skill by creating records in the Job_Skill table
        await Promise.all(skill_ids.map(async skill_id => {
            await Job_Skill.create({
                skill_id: skill_id,
                job_id: job_id
            });
        }));
  
        res.status(200).json({ message: 'Skills added to job successfully.' });
    } catch (error) {
        console.error('Failed to add skills to job.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };

  const  removeSkillFromJob = async (req, res) => {
    try {
        const { job_id, skill_id } = req.body; 
  
        if (!job_id || !skill_id) {
            return res.status(400).json({ error: 'Missing jobId or skillId in request body' });
        }
  
        await Job_Skill.destroy({ where: { job_id, skill_id } });
  
        res.status(200).json({ message: 'Skill removed from job successfully.' });
    } catch (error) {
        console.error('Failed to remove skill from job.', error);
        res.status(500).json({ error: 'Internal server error' });
    }
  };


module.exports = {
    saveJob,
    updateJob,
    deleteJob,
    getJobByJobId,
    getJobsByDriveId,
    addSkillsToJob,
    removeSkillFromJob
}