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



module.exports = {
    updateRole,
}