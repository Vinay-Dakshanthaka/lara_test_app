const db = require('../models')
const nodemailer = require('nodemailer'); 
const { Op } = require('sequelize');

const Student = db.Student;

const updateRole = async (req,res)=>{
    try {
        const student_id = req.student_id;
        const userData = await Student.findOne({
            where:{student_id}
        })

        const userRole = userData.role;

        if(userRole !== 'SUPER ADMIN'){
            return res.status(403).send({message:'Access Forbidden'});
        }

        const {id, role} = req.body;

        await Student.update({role},{where:{student_id:id}})

        return res.status(200).send({message:'Role updated successfully'})

    } catch (error) {
        return res.status(500).send({message:error.message})
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

        // const allStudents = await Student.findAll({ attributes: { exclude: ['password'] } });
        const allStudents = await Student.findAll({
            attributes: { exclude: ['password'] },
            where: {
              role: {
                [Op.ne]: 'SUPER ADMIN'
              }
            }
          });
          
        return res.json({ allStudents })
    } catch (error) {
        return res.status(500).send({ message: error.message })
    }
}

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lara.placementcell@gmail.com', //  email address
        pass: 'kphhcgeglahzzixb' // app password
    }
});

const sendNotificationEmails = async (req, res) => {
    try {
        const student_id = req.student_id;
        const userData = await Student.findOne({
            where: { student_id }
        });

        const userRole = userData.role;

        if (userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const { subject, body, emails } = req.body;

        if (!subject || !body || !emails || !Array.isArray(emails)) {
            return res.status(400).send({ message: 'Subject, body, and emails are required' });
        }

        const emailErrors = [];
        for (const email of emails) {
            const mailOptions = {
                from: 'lara.placementcell@gmail.com',
                to: email,
                subject,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                        <h2>${subject}</h2>
                        <p>${body}</p>
                        <p>Thank You,</p>
                        <p>Lara Technologies Team</p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                emailErrors.push({ email, error: error.message });
            }
        }

        if (emailErrors.length > 0) {
            return res.status(200).send({
                message: 'Notification sent with some unsent emails',
                emailErrors
            });
        } else {
            return res.status(200).send({
                message: 'Notifications sent successfully'
            });
        }
    } catch (error) {
        console.error('Error during sending notification emails:', error);
        return res.status(500).send({ message: 'An error occurred during sending notifications.' });
    }
};


module.exports = {
    updateRole,
    getAllStudentDetails,
    sendNotificationEmails,
}