const db = require('../models');

const Skill = db.Skill;
const Company = db.Company;
const Student = db.Student;

const saveSkill = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        console.log("student");
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const {name} = req.body;

        const existingSkill = await Skill.findOne({where: {name}});

        if(!existingSkill){
            const newSkill = await Skill.create({ name });
            return res.status(200).send({message : "Skill added successfully", newSkill})
        }

        else{
            return res.status(404).json({ error: 'Skill already exists' });
        }   
    } catch(error) {
        return res.status(500).send({message : error.message});
    }
}

const updateSkill = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        console.log("student");
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const { skill_id, name } = req.body;

        const existingSkill = await Skill.findByPk(skill_id);

        if(!existingSkill){
            return res.status(404).json({ error: 'Skill does not exist' });
        }
        existingSkill.name = name;
        await existingSkill.save(existingSkill)
        return res.status(200).send({message : "Skill updated succeccfully", skill : existingSkill});

    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

const deleteSkill = async (req, res) => {
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

        const {skill_id} = req.body
        let skill = await Skill.findByPk(skill_id);

        if (!skill) {
            return res.status(404).json({ error: 'No Skill found' });
        }
        await skill.destroy(skill)
        return res.status(200).send({message : 'Skill Deleted Successfully!!!'});

    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

const getAllSkills = async (req, res) => {
    try{
        const skills = await Skill.findAll();

        if (!skills) {
            return res.status(404).json({ error: 'No Skill found' });
        }

        return res.status(200).send({skills});
    }catch(error){
        console.log(error);
        return res.status(500).send({ message: error.message });
    }
}

// const getAgentByCompanyId = async (req, res) => {
//     try{
//         const { company_id } = req.body;
    
//         const agent = await Agent.findAll({where : { company_id }});
    
//         if (!agent) {
//             return res.status(404).json({ error: 'No Agent found' });
//         }

//         return res.status(200).send({agent});
//     }catch(error){
//         console.log(error);
//         res.status(500).send({ message: error.message });
//     }
// }

module.exports = {
    saveSkill,
    updateSkill,
    deleteSkill,
    getAllSkills,
    //getAgentByCompanyId,

}