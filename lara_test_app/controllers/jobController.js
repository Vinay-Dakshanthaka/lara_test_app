const { where } = require('sequelize');
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
const Profile = db.Profile;
const Student_Job = db.Student_Job;


const saveJob = async (req, res) => {
    try {
        const student_id = req.student_id;
        const student = await Student.findByPk(student_id);
        const role = student.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            return res.status(403).send({ message: 'Access Forbidden' });

        const { drive_id, year_of_exp, job_title, description, no_of_openings, job_location, position, total_rounds } = req.body;

        const drive = await Drive.findByPk(drive_id);
        if (!drive)
            return res.status(403).send({ message: 'Drive not found' });

        const job = await Job.create({ job_title, description, no_of_openings, year_of_exp, job_location, position, total_rounds, drive_id });
        return res.status(200).send({ message: 'successfully saved', job });

    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }

}

const updateJob = async (req, res) => {
    try {
        const student_id = req.student_id;
        const student = await Student.findByPk(student_id);
        const role = student.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            return res.status(403).send({ message: 'Access Forbidden' });

        const { job_id, job_title, description, no_of_openings, job_location, position, total_rounds, year_of_exp } = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if (!job)
            return res.status(403).send({ message: 'Job not found' });

        await Job.update({ job_title, description, no_of_openings, job_location, position, total_rounds, year_of_exp }, { where: { job_id } });
        job = await Job.findByPk(job_id);

        return res.status(200).send({ message: 'Job successfully updated', job });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }

}

const deleteJob = async (req, res) => {
    try {
        const student_id = req.student_id;
        const student = await Student.findByPk(student_id);
        const role = student.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            return res.status(403).send({ message: 'Access Forbidden' });

        const { job_id } = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if (!job)
            return res.status(403).send({ message: 'Job not found' });

        await Job.destroy({ where: { job_id } });

        return res.status(200).send({ message: 'Job successfully deleted' });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }

}

const getJobByJobId = async (req, res) => {
    try {
        // const student_id = req.student_id;
        // const student = await db.Student.findByPk(student_id);
        // const role = student.role;

        // if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
        //     res.status(403).send({message : 'Access Forbidden'});

        const { job_id } = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if (!job)
            return res.status(403).send({ message: 'Job not found' });

        return res.status(200).send({ job });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }

}

const getJobsByDriveId = async (req, res) => {
    try {
        const { drive_id } = req.query;
        let job = await Job.findAll({ where: { drive_id } });
        if (job.length === 0) {
            return res.status(404).send({ message: 'Job not found' });
        }

        return res.status(200).send({ job });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
};


const getJobDetailsByDriveId = async (req, res) => {
    try {
        const { drive_id } = req.query;
        console.log('id :=========', drive_id);

        // Fetch all jobs for the given drive_id
        let jobs = await Job.findAll({ where: { drive_id } });
        if (jobs.length === 0) {
            return res.status(404).send({ message: 'Job not found' });
        }

        // Iterate over each job to fetch the associated skills
        const jobDetails = await Promise.all(
            jobs.map(async (job) => {
                // Fetch job skills
                const jobSkills = await Job_Skill.findAll({ where: { job_id: job.job_id } });

                // Get skill IDs
                const skillIds = jobSkills.map((jobSkill) => jobSkill.skill_id);

                // Fetch skills using the skill IDs
                const skills = await Skill.findAll({ where: { skill_id: skillIds } });

                // Map skills to their names
                const skillNames = skills.map((skill) => skill.name);

                // Return job details along with skill names
                return {
                    ...job.dataValues,
                    skills: skillNames,
                };
            })
        );

        res.status(200).send({ jobs: jobDetails });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
};





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
        const skills = await Skill.findAll({ where: { skill_id: skill_ids } });

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

        return res.status(200).json({ message: 'Skills added to job successfully.' });
    } catch (error) {
        console.error('Failed to add skills to job.', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const removeSkillFromJob = async (req, res) => {
    try {
        const { job_id, skill_id } = req.body;

        if (!job_id || !skill_id) {
            return res.status(400).json({ error: 'Missing jobId or skillId in request body' });
        }

        await Job_Skill.destroy({ where: { job_id, skill_id } });

        return res.status(200).json({ message: 'Skill removed from job successfully.' });
    } catch (error) {
        console.error('Failed to remove skill from job.', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const getStudentsForJobWithSkills = async (req, res) => {
    try {
        const { job_id } = req.body;

        const jobSkill = await Job_Skill.findAll({ where: { job_id }, attributes: ['skill_id'] });

        if (jobSkill.length === 0) {
            return res.status(404).send({ message: "Skills not added for this job" });
        }

        const skillIds = jobSkill.map(jobSkill => jobSkill.skill_id);

        const studentSkill = await db.Student_Skill.findAll({ where: { skill_id: skillIds }, attributes: ['student_id'] });
        if (studentSkill.length === 0) {
            return res.status(404).send({ message: "Students not found for the matched skills" });
        }

        const studentIdsSet = new Set(studentSkill.map(studentSkill => studentSkill.student_id));
        const studentIds = Array.from(studentIdsSet);

        const students = await Student.findAll({
            where: { student_id: studentIds, isActive: true },
            attributes: { exclude: ['password'] }
        });

        const profiles = await Profile.findAll({
            where: { student_id: studentIds }
        });

        return res.status(200).send({
            students: students,
            profiles: profiles
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lara.placementcell@gmail.com', //  email address
        pass: 'kphhcgeglahzzixb' // app password
    }
});

const sendDriveToStudents = async (req, res) => {
    try {
        const { student_ids, job_id, subject, mail_body } = req.body;
        if (!job_id || !student_ids) {
            return res.status(400).json({ error: 'Missing jobId or studentIds in request body' });
        }

        const job = await Job.findOne({ where: { job_id } });
        if (!job)
            return res.status(404).json({ error: 'Job not found' });

        // const drive = await Drive.findByPk(job.drive_id);
        // if(!drive)
        //     return res.status(404).json({ error: 'Drive not found' });

        // const company = await Company.findByPk(drive.company_id);
        // if(!company)
        //     return res.status(404).json({ error: 'company not found' });

        // const agent = (await Agent.findOne({where : {company_id : company.company_id, isActive : true}}));
        // if(!agent)
        //     return res.status(404).json({ error: 'Active agent not found' });

        // const skill_ids = (await Job_Skill.findAll({where : {job_id}, attributes : ['skill_id']})).map(job_skill => job_skill.skill_id);

        // const skills = await Skill.findAll({where : {skill_id : skill_ids}, attributes : ['name']});
        // if(skills.length === 0)
        //     return res.status(404).json({ error: 'Skills not added to the job.' });

        const studentEmails = (await Student.findAll({ where: { student_id: student_ids } })).map(student => student.email);
        const emailErrors = [];
        for (const email of studentEmails) {
            // const skillsList = skills.map(val => `<li>${val.name}</li>`).join('');
            const mailOptions = {
                from: 'lara.placementcell@gmail.com',
                to: email,
                subject: subject,
                text: mail_body
                // html: `
                //     <div style="font-family: Arial, sans-serif; padding: 20px;">
                //         <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                //         <p>Dear Student,</p>
                //         <br/>
                //         <p>I hope this email finds you well. We are excited to announce an upcoming recruitment drive that offers fantastic job opportunities for our talented students. Below are the details of the event:</p>
                //         <br/>
                //         <pre><b>Date:</b>${drive.drive_date}</pre>
                //         <pre><b>Date:</b>${drive.drive_time}</pre>
                //         <pre><b>Date:</b>${drive.drive_location}</pre>
                //         <br/>
                //         <pre><b>About Company and Job:</b></pre>
                //         <br/>
                //         <pre>Company Name: ${company.name}</pre>
                //         <pre>Job: ${job.job_title}</pre>
                //         <pre>JD: ${job.description}</pre>
                //         <pre>Designation: ${job.position}</pre>
                //         <pre>Location: ${job.job_location}</pre>
                //         <pre>Total rounds: ${job.total_rounds}</pre>
                //         <br/>
                //         <pre><b>Skills needed for this job:</b></pre>
                //         <br/>
                //         <ul>
                //             ${skillsList}
                //         </ul>
                //         <br/>
                //         <pre><b>Documents to Bring:</b></pre>
                //         <br/>
                //         <ul>
                //             <li>Updated Resume</li>
                //             <li>Academic Transcripts</li>
                //         </ul>
                //         <br/>
                //         <pre>We highly encourage all eligible students to participate in this drive and make the most of this opportunity.</pre>
                //         </br>
                //         <pre>For any queries or further information, please feel free to contact ${agent.name} on ${agent.contactNumber} at </pre>

                //         <br/>
                //         <pre>We look forward to your active participation.</pre>
                //         <br/>
                //         <pre>Thank You,</pre>
                //         <pre>TOTFD Team</pre>
                //     </div>
                // `
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
            await Promise.all(student_ids.map(async student_id => {
                const studentDetail = await Student_Job.findAll({ where: { student_id, job_id } });
                if (!studentDetail) {
                    await Student_Job.create({
                        student_id: student_id,
                        job_id: job_id
                    });
                }
            }));
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


const getSkillsByJobId = async (req, res) => {
    try {
        const { job_id } = req.body;
        const skill_ids = (await Job_Skill.findAll({ where: { job_id } })).map(job_skill => job_skill.skill_id);

        const skills = (await Skill.findAll({ where: { skill_id: skill_ids } })).map(skill => skill.name);
        if (skills.length === 0)
            return res.status(400).send({ message: "Skills not found for the job" });

        return res.status(200).send(skills);
    }
    catch (error) {
        return res.status(500).send({ message: 'Internal server error' });
    }
}

const submitStudentResult = async (req, res) => {
    try {
        const studentId = req.student_id;
        const studentData = await Student.findByPk(studentId);
        const role = studentData.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            return res.status(403).send({ message: 'Access Forbidden' });

        const { student_id, job_id, result, subject, mail_body } = req.body;
        if (!student_id || !result || !subject || !mail_body)
            return res.status(400).json({ error: 'Input is missing in request body' });
        console.log(req.body)
        console.log(job_id)
        const student_job = await Student_Job.findOne({ where: { student_id, job_id } });
        console.log('student job ', student_job)
        if (!student_job)
            return res.status(404).json({ error: 'Student not found for the job' });

        const student = await Student.findOne({ where: { student_id } });

        const round_cleared = student_job.rounds_cleared;
        if (result === "SELECTED") {
            const rounds_cleared = round_cleared + 1;
            await Student_Job.update({ rounds_cleared, result }, { where: { student_id, job_id } });


            const mailOptions = {
                from: 'deebaishya555@gmail.com',
                to: student.email,
                subject: subject,
                text: mail_body
                // html: `
                //     <div style="font-family: Arial, sans-serif; padding: 20px;">
                //         <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                //         <h2>Welcome to Lara Technologies!</h2>
                //         <p>Dear Student,</p>
                //         <p>Your account has been successfully created. Here are your login details:</p>
                //         <p><strong>Email:</strong> ${newStudent.email}</p>
                //         <p><strong>Password:</strong> password@123</p>
                //         <p> Click the below link to Signin to your Account</p>
                //         <a href="${baseURL}/signin" target="_blank">${baseURL}/signin</a>
                //         <p>We recommend that you change your password after logging in for the first time.</p>
                //         <p>Until Your password is updated you won't be able to complete the further step.</p>
                //         <p>Thank You,</p>
                //         <p>Lara Technologies Team</p>
                //     </div>
                // `
            };

            try {
                await transporter.sendMail(mailOptions);
                return res.status(200).send({ message: 'Email Sent after selection', student: student });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                return res.status(200).send({
                    message: 'Student got selected, but there was an error sending the selection email',
                    student: student,
                    emailError: emailError.message
                });
            }
        }
        else if (result === "REJECTED") {
            await Student_Job.update({ result }, { where: { student_id, job_id } });

            const mailOptions = {
                from: 'deebaishya555@gmail.com',
                to: student.email,
                subject: subject,
                text: mail_body
            };

            try {
                await transporter.sendMail(mailOptions);
                return res.status(200).send({ message: 'Email Sent after rejection', student: student });
            } catch (emailError) {
                console.error('Error sending email:', emailError);
                return res.status(200).send({
                    message: 'Student got rejected, but there was an error sending the rejection email',
                    student: student,
                    emailError: emailError.message
                });
            }
        } else {
            return res.status(400).send({ message: "Invalid selection" })
        }
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}

const roundsClearedByStudent = async (req, res) => {
    try {
        const { student_id, job_id } = req.body;

        if (!student_id || !job_id)
            return res.status(400).send({ message: "studentId or jobId is missing in request body" });

        const student_job = await Student_Job.findOne({ where: { student_id, job_id } });
        if (!student_job)
            return res.status(404).send({ message: "drive details not found for the student" });

        const student = await Student.findByPk(student_id);
        const job = await Job.findByPk(job_id);

        return res.status(200).send({ student: student.name, job, rounds_cleared: student_job.rounds_cleared });
    }
    catch (error) {
        return res.status(500).send({ message: error });
    }
}

const getAllJobDetailsByStudent = async (req, res) => {
    try {
        const student_id = req.student_id;

        // Find all job_ids associated with the student
        const studentJobs = await Student_Job.findAll({
            where: { student_id }
        });
        console.log("studentJobs", studentJobs);
        

        // Extract job_ids from studentJobs
        const jobIds = studentJobs.map(studentJob => studentJob.job_id);

        // Handle case where no job_ids are found for the student
        if (jobIds.length === 0)
            return res.status(404).send({ message: "Drive details not found for the student" });

        // Find all jobs details based on job_ids
        const jobs = await Job.findAll({
            where: { job_id: jobIds },
            attributes: ['job_id', 'job_title', 'description', 'total_rounds', 'drive_id']
        });

        // Handle case where no jobs are found based on job_ids
        if (jobs.length === 0)
            return res.status(404).send({ message: "Job details not available" });

        // Extract drive_ids from jobs to find associated company_ids
        const driveIds = jobs.map(job => job.drive_id);

        // Find all drives details based on drive_ids
        const drives = await Drive.findAll({
            where: { drive_id: driveIds },
            attributes: ['drive_id', 'company_id']
        });
        // Extract company_ids from drives
        const companyIds = drives.map(drive => drive.company_id);

        // Find all company details based on company_ids
        const companies = await Company.findAll({
            where: { company_id: companyIds }
        });

        // Map job details, associated company details, and rounds cleared
        const response = jobs.map(job => {
            const drive = drives.find(drive => drive.drive_id === job.drive_id);
            const company = companies.find(company => company.company_id === drive.company_id);
            const rounds = studentJobs.find(rc => rc.job_id === job.job_id);
            return {
                job_details: {
                    Job: job.job_title,
                    JD: job.description,
                    Total_Rounds: job.total_rounds,
                    Drive_id: job.drive_id
                },
                company,
                rounds: rounds ? rounds.rounds_cleared : null
            };
        });

        return res.status(200).send({ job_details: response });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


const getAllDrivesAssignedToStudents = async (req, res) => {
    try {
        const studentId = req.student_id;
        const studentData = await Student.findByPk(studentId);
        const role = studentData.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            return res.status(403).send({ message: 'Access Forbidden' });
        // Fetch all records from the Student_Job table
        const studentJobs = await Student_Job.findAll();

        // Extract job_ids and student_ids from studentJobs
        const jobIds = studentJobs.map(studentJob => studentJob.job_id);
        const studentIds = studentJobs.map(studentJob => studentJob.student_id);

        // Handle case where no job_ids are found
        if (jobIds.length === 0)
            return res.status(404).send({ message: "Drive details not found for the student" });

        // Find all job details based on job_ids
        const jobs = await Job.findAll({
            where: { job_id: jobIds },
            attributes: ['job_id', 'job_title', 'description', 'total_rounds', 'drive_id']
        });

        // Handle case where no jobs are found based on job_ids
        if (jobs.length === 0)
            return res.status(404).send({ message: "Job details not available" });

        // Extract drive_ids from jobs to find associated company_ids
        const driveIds = jobs.map(job => job.drive_id);

        // Find all drive details based on drive_ids
        const drives = await Drive.findAll({
            where: { drive_id: driveIds },
            attributes: ['drive_id', 'company_id']
        });

        // Extract company_ids from drives
        const companyIds = drives.map(drive => drive.company_id);

        // Find all company details based on company_ids
        const companies = await Company.findAll({
            where: { company_id: companyIds }
        });

        // Fetch all student details based on student_ids
        const students = await Student.findAll({
            where: { student_id: studentIds }
        });

        // Map job details, associated company details, and rounds cleared
        const response = studentJobs.map(studentJob => {
            const job = jobs.find(job => job.job_id === studentJob.job_id);
            const drive = drives.find(drive => drive.drive_id === job.drive_id);
            const company = companies.find(company => company.company_id === drive.company_id);
            const student = students.find(student => student.student_id === studentJob.student_id);

            return {
                student_details: student,
                job_details: {
                    Job_id:job.job_id,
                    Job: job.job_title,
                    JD: job.description,
                    Total_Rounds: job.total_rounds,
                    Drive_id: job.drive_id
                },
                company,
                rounds: studentJob
            };
        });

        return res.status(200).send({ 
            job_details: response 
        });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}



const jobsAttendedByStudents = async (req, res) => {
    try {
        const { student_ids, job_id } = req.body;

        if (!student_ids || !job_id) {
            return res.status(400).send({ message: "studentIds or jobId is missing in request body" });
        }

        if (!Array.isArray(student_ids) || student_ids.length === 0) {
            return res.status(400).send({ message: "studentIds should be a non-empty array" });
        }

        const results = await Promise.all(student_ids.map(async (student_id) => {
            const student = await Student.findByPk(student_id);
            if (!student) {
                return { student_id, message: "student not found" };
            }

            // Check if the student_job entry exists
            let student_job = await Student_Job.findOne({ where: { student_id, job_id } });
            if (!student_job) {
                // Create a new entry if it doesn't exist
                student_job = await Student_Job.create({ student_id, job_id, rounds_cleared: 0 });
            }

            return { student: student.name, rounds_cleared: student_job.rounds_cleared };
        }));

        return res.status(200).send({ students: results });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


module.exports = {
    saveJob,
    updateJob,
    deleteJob,
    getJobByJobId,
    getJobsByDriveId,
    getJobDetailsByDriveId,
    addSkillsToJob,
    removeSkillFromJob,
    getStudentsForJobWithSkills,
    sendDriveToStudents,
    getSkillsByJobId,
    submitStudentResult,
    roundsClearedByStudent,
    getAllJobDetailsByStudent,
    jobsAttendedByStudents,
    getAllDrivesAssignedToStudents
}



