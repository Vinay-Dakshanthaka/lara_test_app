const db = require('../models');
const nodemailer = require('nodemailer'); 

const Student = db.Student;
const Job = db.Job;
const Company = db.Company;
const Agent = db.Agent;
const Drive = db.Drive;
const Skill = db.Skill;
const Job_Skill = db.Job_Skill;
const Student_Skill = db.Student_Skill;


const saveJob = async(req, res) => {
    try{
        const student_id = req.student_id;
        const student = await Student.findByPk(student_id);
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
        const student = await Student.findByPk(student_id);
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
        const student = await Student.findByPk(student_id);
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

        const {drive_id} = req.body;

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

const getStudentsForJobWithSkills = async(req, res) => {
    try{
        const { job_id } = req.body;
        const jobSkill = await Job_Skill.findAll({ where : { job_id }, attributes: ['skill_id'] });

        if(jobSkill.length === 0)
            res.status(404).send({message : "Skills not added for this job"});

        const skillIds = jobSkill.map(jobSkill => jobSkill.skill_id);

        const studentSkill = await db.Student_Skill.findAll({ where : {skill_id : skillIds }, attributes: ['student_id'] });
        if(!studentSkill)
            res.status(404).send({ message : "Students not found for the matched skills" })

        const studentIdsSet = new Set(studentSkill.map(studentSkill => studentSkill.student_id));
        const studentIds = Array.from(studentIdsSet);

        const student = await Student.findAll({ where : { student_id : studentIds, isActive : true}, attributes : { exclude : ['password'] }});
        res.status(200).send({ student });
    }
    catch(error){
        res.status(500).json({ error: 'Internal server error' });
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lara.placementcell@gmail.com', //  email address
        pass: 'kphhcgeglahzzixb' // app password
    }
});

const sendDriveToStudents = async(req, res) => {
    try{
        const {student_ids, job_id} = req.body;
        if (!job_id || !student_ids) {
            return res.status(400).json({ error: 'Missing jobId or studentIds in request body' });
        }

        const job = await Job.findOne({ where : { job_id }});
        if(!job)
            return res.status(404).json({ error: 'Job not found' });

        const drive = await Drive.findByPk(job.drive_id);
        if(!drive)
            return res.status(404).json({ error: 'Drive not found' });

        const company = await Company.findByPk(drive.company_id);
        if(!company)
            return res.status(404).json({ error: 'company not found' });

        const agent = (await Agent.findOne({where : {company_id : company.company_id, isActive : true}}));
        if(!agent)
            return res.status(404).json({ error: 'Active agent not found' });
        
        const skill_ids = (await Job_Skill.findAll({where : {job_id}, attributes : ['skill_id']})).map(job_skill => job_skill.skill_id);
        
        const skills = await Skill.findAll({where : {skill_id : skill_ids}, attributes : ['name']});
        if(skills.length === 0)
            return res.status(404).json({ error: 'Skills not added to the job.' });

        const studentEmails = (await Student.findAll({ where : {student_id : student_ids }})).map(student => student.email);
        const emailErrors = [];
        for (const email of studentEmails) {
            const skillsList = skills.map(val => `<li>${val.name}</li>`).join('');
            console.log(skillsList);
            const mailOptions = {
                from: 'lara.placementcell@gmail.com',
                to: email,
                subject: 'Invitation to Participate in the Upcoming Recruitment Drive!',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                        <p>Dear Student,</p>
                        <br/>
                        <p>I hope this email finds you well. We are excited to announce an upcoming recruitment drive that offers fantastic job opportunities for our talented students. Below are the details of the event:</p>
                        <br/>
                        <pre><b>Date:</b>${drive.drive_date}</pre>
                        <pre><b>Date:</b>${drive.drive_time}</pre>
                        <pre><b>Date:</b>${drive.drive_location}</pre>
                        <br/>
                        <pre><b>About Company and Job:</b></pre>
                        <br/>
                        <pre>Company Name: ${company.name}</pre>
                        <pre>Job: ${job.job_title}</pre>
                        <pre>JD: ${job.description}</pre>
                        <pre>Designation: ${job.position}</pre>
                        <pre>Location: ${job.job_location}</pre>
                        <pre>Total rounds: ${job.total_rounds}</pre>
                        <br/>
                        <pre><b>Skills needed for this job:</b></pre>
                        <br/>
                        <ul>
                            ${skillsList}
                        </ul>
                        <br/>
                        <pre><b>Documents to Bring:</b></pre>
                        <br/>
                        <ul>
                            <li>Updated Resume</li>
                            <li>Academic Transcripts</li>
                        </ul>
                        <br/>
                        <pre>We highly encourage all eligible students to participate in this drive and make the most of this opportunity.</pre>
                        </br>
                        <pre>For any queries or further information, please feel free to contact ${agent.name} on ${agent.contactNumber} at </pre>
                        
                        <br/>
                        <pre>We look forward to your active participation.</pre>
                        <br/>
                        <pre>Thank You,</pre>
                        <pre>TOTFD Team</pre>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                emailErrors.push({ email: email, error: error.message });
            }
        }

        if (emailErrors.length > 0) {
            return res.status(200).send({
                message: 'Drive details to the students sent successfully with some unsent emails ',
                students: emailErrors,
            });
        } else {
            return res.status(200).send({
                message: 'Drive details to the students sent successfully',
                students: studentEmails
            });
        }


    } catch (error) {
        console.error('Error during sending the drive detail to the students', error);
        return res.status(500).send({ message: 'An error occurred during sending the drive detail to the students' });
    }
}


module.exports = {
    saveJob,
    updateJob,
    deleteJob,
    getJobByJobId,
    getJobsByDriveId,
    addSkillsToJob,
    removeSkillFromJob,
    getStudentsForJobWithSkills,
    sendDriveToStudents
}