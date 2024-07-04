const db = require('../models');

const Agent = db.Agent;
const Company = db.Company;
const Student = db.Student;

const saveAgent = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        console.log("student");
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const {name, company_id, contactNumber, designation, mail_id} = req.body;

        const existingAgent = await Agent.findOne({where: {mail_id}});

        if(!existingAgent){
            const newAgent = await Agent.create({
                name,
                company_id,
                contactNumber,
                designation,
                mail_id,
                isActive : true
            });
            return res.status(200).send({message : "Agent added successfully", newAgent})
        }

        else{
            return res.status(404).json({ error: 'Agent email-id already exists' });
        }   
    } catch(error) {
        return res.status(500).send({message : error.message});
    }
}

const updateAgent = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        console.log("student");
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const { mail_id, isActive } = req.body;

        const existingAgent = await Agent.findOne({where: {mail_id}});

        if(!existingAgent){
            return res.status(404).json({ error: 'Agent does not exist' });
        }
        else{
            // update the agent-status 
            existingAgent.isActive = isActive;

            await existingAgent.save(existingAgent)

            return res.status(200).send({message : "Agent updated succeccfully", agent : existingAgent});

        }
    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

const deleteAgent = async (req, res) => {
    try{

         // Fetch the user's role from the database using the user's ID
         const studentId = req.student_id; 
         const user = await Student.findByPk(studentId); // Fetch user from database
         const userRole = user.role; // Get the user's role
         console.log("role :"+userRole)
         // Check if the user role is either "ADMIN" or "SUPER ADMIN"
         if (userRole !== 'PLACEMENT OFFICER' && userRole !== 'SUPER ADMIN') {
             return res.status(403).json({ error: 'Access forbidden' });
         }

        const {agent_id} = req.body

        let agent = await Agent.findByPk(agent_id);

        if (!agent) {
            return res.status(404).json({ error: 'No Agent found' });
        }

        await agent.destroy(agent)

        return res.status(200).send({message : 'Agent Deleted Successfully!!!'});

    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

const getAllAgentDetails = async (req, res) => {
    try{
        const agents = await Agent.findAll();

        if (!agents) {
            return res.status(404).json({ error: 'No Agent found' });
        }

        return res.status(200).send({agents});
    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

const getAgentByCompanyId = async (req, res) => {
    try{
        const { company_id } = req.body;
    
        const agent = await Agent.findAll({where : { company_id }});
    
        if (!agent) {
            return res.status(404).json({ error: 'No Agent found' });
        }

        return res.status(200).send({agent});
    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

module.exports = {
    saveAgent,
    updateAgent,
    deleteAgent,
    getAllAgentDetails,
    getAgentByCompanyId,

}