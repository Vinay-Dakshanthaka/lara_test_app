const db = require('../models')

const Student = db.Student;

const updateRole = async (req,res)=>{
    try {
        const student_id = req.student_id;
        const userData = await Student.findOne({
            where:{student_id}
        })

        const userRole = userData.role;

        if(userRole !== 'SUPER ADMIN'){
            res.status(403).send({message:'Access Forbidden'});
        }

        const {id, role} = req.body;

        await Student.update({role},{where:{student_id:id}})

        res.status(200).send({message:'Role updated successfully'})

    } catch (error) {
        res.status(500).send({message:error.message})
    }
}

const getAllStudentDetails = async (req, res)=>{
    try{
        console.log("1");
        const student_id = req.student_id;

        const studentData = await Student.findByPk(student_id);
        const role = studentData.role;

        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const allStudents = await Student.findAll({ attributes: { exclude: ['password'] } });

        return res.json({ allStudents })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}



module.exports = {
    updateRole,
    getAllStudentDetails,
}