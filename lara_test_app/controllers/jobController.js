const db = require('../models');

const Job = db.Job;
const Company = db.Company;

const saveJob = async(req, res) => {
    try{
        const student_id = req.student_id;
        const student = await db.Student.findByPk(student_id);
        const role = student.role;
        
        if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
            res.status(403).send({message : 'Access Forbidden'});

        const {name, description, no_of_openings, job_location, company_id, position} = req.body;

        const company = await Company.findByPk(company_id);
        if(!company)
            res.status(403).send({message : 'Company not found'});

        let job = await Job.findOne({where : {name : name, company_id : company.company_id}});
        if(!job)
            job = await Job.create({name, description, no_of_openings, job_location, company_id, position});

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

        const {job_id, name, description, no_of_openings, job_location, position} = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findByPk(job_id);
        if(!job)
            res.status(403).send({message : 'Job not found'});

        await Job.update({name, description, no_of_openings, job_location, position}, {where : {job_id}});
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

const getJobsBycompanyId = async(req, res) => {
    try{
        // const student_id = req.student_id;
        // const student = await db.Student.findByPk(student_id);
        // const role = student.role;
        
        // if(role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN')
        //     res.status(403).send({message : 'Access Forbidden'});

        const {company_id} = req.body;

        // const company = await Company.findByPk(company_id);
        // if(!company)
        //     res.status(403).send({message : 'Company not found'});

        let job = await Job.findOne({where : {company_id}});
        if(!job)
            res.status(403).send({message : 'Job not found'});

        res.status(200).send({job});
    } catch(error){
        console.log(error);
        res.status(500).send({message : error.message});
    }
    
}


module.exports = {
    saveJob,
    updateJob,
    deleteJob,
    getJobByJobId,
    getJobsBycompanyId,
}