const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const imgUpload = multer({dest: 'Images/'});
const xlsx = require('xlsx');
const nodemailer = require('nodemailer'); 
const fs = require('fs');
const path = require('path');

const Student = db.Student;
const Profile = db.Profile;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwtSecret = process.env.JWT_SECRET;
// No. of salt rounds hash the password using bcrypt 
const saltRounds = 15;

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if email already exists
        const existingStudent = await Student.findOne({ where: { email } });

        if (existingStudent) {
            return res.status(400).send({ message: 'Email already exists' });
        }

        // Generate student_id (e.g., "LARA00001")
        const lastStudent = await Student.findOne({
            order: [['student_id', 'DESC']]
        });

        let lastIdNumber = 0;
        if (lastStudent && lastStudent.student_id) {
            const lastId = lastStudent.student_id;
            lastIdNumber = parseInt(lastId.replace('LARA', ''), 10);
        }

        const newIdNumber = lastIdNumber + 1;
        const newCustomId = `LARA${newIdNumber.toString().padStart(5, '0')}`;
        console.log("Student ID : ", newCustomId)

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the Student in the database
        const newStudent = await Student.create({
            student_id: newCustomId,
            name,
            email,
            phoneNumber: phone,
            password: hashedPassword,
            role: 'STUDENT',
        });

        return res.status(200).send({ message: "Signup success", student: newStudent });
    } catch (error) {
        return res.status(500).send({ message: 'Signup failed', errorMessage: error.message });
    }
}

const verifyByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        console.log("email , password : ", email, " : ", password);

        // Find student data based on email
        const studentData = await Student.findOne({ where: { email } });

        // If no student found, return 404
        if (!studentData) {
            return res.status(404).send({ message: 'No Student Found with this Email Id' });
        }

        // console.log("studentData : ", studentData);

        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, studentData.password);

        if (passwordMatch) {
            // Generate JWT token
            const token = jwt.sign({ student_id: studentData.student_id, email: studentData.email }, jwtSecret);
            const role = studentData.role;

            // Send token and role to the client
            return res.status(200).send({ token, role, message: 'Signin success!!' });
        } else {
            // Incorrect password
            return res.status(401).send({ message: 'Invalid Password' });
        }
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error in verifyByEmail:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};


const verifyByPhone = async (req, res) => {
    try {
        const { phoneNumber, password } = req.body;
        const studentData = await Student.findOne({ where: { phoneNumber } });
        if (!studentData) {
          return  res.status(404).send({ message: 'No Student Found with this Phone' });
        }

        const passwordMatch = await bcrypt.compare(password, studentData.password);

        if (passwordMatch) {
            const token = jwt.sign({ student_id: studentData.student_id, email: studentData.email }, jwtSecret);
            const role = studentData.role;
            //send token and role to the client 
           return res.status(200).send({ token, role, message: 'Signin success!!' });
        } else {
          return  res.status(401).send({ message: 'Invalid Password' });
        }

    } catch (error) {
       return res.status(500).send({ message: error.message })
    }
};

const getStudentDetailsById = async (req, res) => {
    try {
        const student_id = req.student_id;
        // console.log("Student ID: ", student_id);
        
        const studentData = await Student.findByPk(student_id, {
            attributes: { exclude: ['password'] }
        });
        console.log("Student : ", Student)

        if (!studentData) {
            return res.status(404).send({ message: 'Student not found' });
        }

        return res.status(200).send({ studentData });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
}

const getStudentDetails = async (req, res) => {
    try {
        const studentId = req.student_id; // Extracted from the token
        const student = await Student.findByPk(studentId, {
            attributes: { exclude:['password'] }
        });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        res.status(200).send(student);
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getAllStudentDetails = async (req, res)=>{
    try{
        const student_id = req.student_id;

        const studentData = await Student.findByPk(student_id);
        const role = studentData.role;

        if(role!== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN'){
           return res.status(403).send({message:'Access Forbidden'});
        }

        const allStudents = await Student.findAll({attributes:{exclude:['password']}});

       return res.json({allStudents})
    }catch(error){
       return res.status(500).send({message: error.message})
    }
}


// const bulkSignup = async (req, res) => {
//     try {
//         const file = req.file;
//         if (!file) {
//             return res.status(400).send({ message: 'Please upload an Excel file' });
//         }

//         // Parse the Excel file
//         const workbook = xlsx.read(file.buffer, { type: 'buffer' });
//         const sheetName = workbook.SheetNames[0];
//         const sheet = workbook.Sheets[sheetName];
//         const rows = xlsx.utils.sheet_to_json(sheet);

//         // Collect new students data
//         const newStudentsData = [];
//         const saltRounds = 10;

//         // Fetch all existing emails once
//         const existingEmails = new Set(
//             (await Student.findAll({ attributes: ['email'] })).map(student => student.email)
//         );

//         // Fetch the last student ID once
//         const lastStudent = await Student.findOne({
//             order: [['student_id', 'DESC']]
//         });

//         let lastIdNumber = 0;
//         if (lastStudent && lastStudent.student_id) {
//             const lastId = lastStudent.student_id;
//             lastIdNumber = parseInt(lastId.replace('LARA', ''), 10);
//         }

//         for (const row of rows) {
//             const email = row.email;
//             if (!email || existingEmails.has(email)) {
//                 continue;
//             }

//             const password = 'password@123';
//             const hashedPassword = await bcrypt.hash(password, saltRounds);

//             // Generate student_id
//             lastIdNumber++;
//             const newCustomId = `LARA${lastIdNumber.toString().padStart(5, '0')}`;

//             newStudentsData.push({
//                 student_id: newCustomId,
//                 name: row.name || 'Please Update Your Name!!!',
//                 email,
//                 phoneNumber: row.phone || 'Please Update Your Phone Number!!!',
//                 password: hashedPassword,
//                 role: 'STUDENT',
//             });

//             // Add the email to the existingEmails set to skip duplicates in the file
//             existingEmails.add(email);
//         }

//         // Bulk insert new students
//         if (newStudentsData.length > 0) {
//             await Student.bulkCreate(newStudentsData);
//         }

//         res.status(200).send({ message: 'Bulk signup success', students: newStudentsData });
//     } catch (error) {
//         res.status(500).send({ message: error });
//     }
// }; 


const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'lara.placementcell@gmail.com', //  email address
        pass: 'kphhcgeglahzzixb' // app password
    }
});

const bulkSignup = async (req, res) => {
    try {

        const student_id = req.student_id;
        const userData = await Student.findOne({
            where:{student_id}
        })

        const userRole = userData.role;

        if(userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER'){
          return  res.status(403).send({message:'Access Forbidden'});
        }

        const file = req.file;
        if (!file) {
            return res.status(400).send({ message: 'Please upload an Excel file' });
        }

        // Parse the Excel file
        const workbook = xlsx.read(file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rows = xlsx.utils.sheet_to_json(sheet);

        // Collect new students data
        const newStudentsData = [];
        const saltRounds = 10;

        // Fetch all existing emails once
        const existingEmails = new Set(
            (await Student.findAll({ attributes: ['email'] })).map(student => student.email)
        );

        // Fetch the last student ID once
        const lastStudent = await Student.findOne({
            order: [['student_id', 'DESC']]
        });

        let lastIdNumber = 0;
        if (lastStudent && lastStudent.student_id) {
            const lastId = lastStudent.student_id;
            lastIdNumber = parseInt(lastId.replace('LARA', ''), 10);
        }

        for (const row of rows) {
            const email = row.email;
            if (!email || existingEmails.has(email)) {
                continue;
            }

            const password = 'password@123';
            const hashedPassword = await bcrypt.hash(password, saltRounds);

            // Generate student_id
            lastIdNumber++;
            const newCustomId = `LARA${lastIdNumber.toString().padStart(5, '0')}`;

            newStudentsData.push({
                student_id: newCustomId,
                name: row.name || 'Please Update Your Name!!!',
                email,
                phoneNumber: row.phone || 'Please Update Your Phone Number!!!',
                password: hashedPassword,
                role: 'STUDENT',
            });

            // Add the email to the existingEmails set to skip duplicates in the file
            existingEmails.add(email);
        }

        // Bulk insert new students
        let createdStudents = [];
        if (newStudentsData.length > 0) {
            createdStudents = await Student.bulkCreate(newStudentsData);
        }

        // Send welcome emails to new students
        const emailErrors = [];
        for (const student of createdStudents) {
            const mailOptions = {
                from: 'lara.placementcell@gmail.com',
                to: student.email,
                subject: 'Account Created Successfully',
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px;">
                        <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                        <h2>Welcome to Lara Technologies!</h2>
                        <p>Dear Student,</p>
                        <p>Your account has been successfully created. Here are your login details:</p>
                        <p><strong>Email:</strong> ${student.email}</p>
                        <p><strong>Password:</strong> password@123</p>
                        <p>We recommend that you change your password after logging in for the first time.</p>
                        <p>Until Your password is updated you won't able to complete the further step.</p>
                        <p>Thank You,</p>
                        <p>Lara Technologies Team</p>
                    </div>
                `
            };

            try {
                await transporter.sendMail(mailOptions);
            } catch (error) {
                emailErrors.push({ email: student.email, error: error.message });
            }
        }

        if (emailErrors.length > 0) {
          return  res.status(200).send({
                message: 'Bulk signup success with some email errors',
                students: createdStudents,
                emailErrors
            });
        } else {
          return  res.status(200).send({
                message: 'Bulk signup success',
                students: createdStudents
            });
        }
    } catch (error) {
        console.error('Error during bulk signup:', error);
      return  res.status(500).send({ message: 'An error occurred during bulk signup.' });
    }
};



const signupSingle = async (req, res) => {
    try {

        const student_id = req.student_id;
        const userData = await Student.findOne({
            where:{student_id}
        })

        const userRole = userData.role;

        if(userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER'){
         return   res.status(403).send({message:'Access Forbidden'});
        }

        const { email } = req.body;
        if (!email) {
            return res.status(400).send({ message: 'Email is required' });
        }

        // Check if email already exists
        const existingStudent = await Student.findOne({ where: { email } });
        if (existingStudent) {
            return res.status(400).send({ message: 'Email already in use' });
        }

        const saltRounds = 10;
        const password = 'password@123';
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Fetch the last student ID
        const lastStudent = await Student.findOne({
            order: [['student_id', 'DESC']]
        });

        let lastIdNumber = 0;
        if (lastStudent && lastStudent.student_id) {
            const lastId = lastStudent.student_id;
            lastIdNumber = parseInt(lastId.replace('LARA', ''), 10);
        }

        // Generate new student_id
        const newIdNumber = lastIdNumber + 1;
        const newCustomId = `LARA${newIdNumber.toString().padStart(5, '0')}`;

        // Create new student
        const newStudent = await Student.create({
            student_id: newCustomId,
            name: 'Please Update Your Name!!!',
            email,
            phoneNumber: 'Please Update Your Phone Number!!!',
            password: hashedPassword,
            role: 'STUDENT',
        });

        // Send welcome email to the new student
        const mailOptions = {
            from: 'lara.placementcell@gmail.com',
            to: newStudent.email,
            subject: 'Account Created Successfully',
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <img src="https://laragrooming.com/static/media/laralogo.4950e732716a6d9baed2.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                    <h2>Welcome to Lara Technologies!</h2>
                    <p>Dear Student,</p>
                    <p>Your account has been successfully created. Here are your login details:</p>
                    <p><strong>Email:</strong> ${newStudent.email}</p>
                    <p><strong>Password:</strong> password@123</p>
                    <p>We recommend that you change your password after logging in for the first time.</p>
                    <p>Until Your password is updated you won't able to complete the further step.</p>
                    <p>Thank You,</p>
                    <p>Lara Technologies Team</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
          return  res.status(200).send({ message: 'Signup success', student: newStudent });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
          return  res.status(200).send({ 
                message: 'Signup success, but there was an error sending the welcome email', 
                student: newStudent, 
                emailError: emailError.message 
            });
        }
    } catch (error) {
       return res.status(500).send({ message: error.message });
    }
};


const validFileFormats = ['jpeg', 'jpg', 'png'];

const uploadProfileImage = async (req, res) => {
    try {
        const studentId = req.student_id;
        console.log("id :"+studentId);
        // Check if file was uploaded
        if (!req.file) {
            throw new Error('No image file uploaded.');
        }

        // Check if the file format is valid
        const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
        if (!validFileFormats.includes(fileFormat)) {
            throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
        }

        // Construct the full path for saving the image
        const imagePath = req.file.path;
        console.log("path :"+imagePath);
        console.log("path req:"+req.file.path);
        // Update the image path in the database
        await Student.update({ imagePath: imagePath }, { where: { student_id: studentId } });

        res.status(200).send({ message: 'Profile image uploaded successfully.', imagePath });
        console.log("Path: " + imagePath);
    } catch (error) {
        console.error('Error uploading profile image:', error);
        res.status(500).send({ message: error.message });
    }
};

const getProfileImage = async (req, res) => {
    try {
        const id = req.student_id;
        const profile = await Student.findOne({ where: { student_id: id } });

        if (!profile) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        const imagePath = profile.imagePath;

        // Check if imagePath exists
        if (!imagePath) {
            return res.status(404).send({ message: 'Image not found.' });
        }

        // Read the image file
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return res.status(500).send({ message: 'Error reading image file.' });
            }

            // Set the appropriate content type
            res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image format

            // Send the image file as response
            // console.log(data)
            res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

const getProfileImageFor = async (req, res) => {
    try {
        const {student_id} = req.body;
        const profile = await Student.findOne({ where: { student_id }  });

        if (!profile) {
            return res.status(404).send({ message: 'Student not found.' });
        }

        const imagePath = profile.imagePath;

        // Check if imagePath exists
        if (!imagePath) {
            return res.status(404).send({ message: 'Image not found.' });
        }

        // Read the image file
        fs.readFile(imagePath, (err, data) => {
            if (err) {
                return res.status(500).send({ message: 'Error reading image file.' });
            }

            // Set the appropriate content type
            res.setHeader('Content-Type', 'image/jpeg'); // Adjust content type based on your image format

            // Send the image file as response
            // console.log(data)
            res.status(200).send(data);
        });
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};

module.exports = {
    signup,
    verifyByEmail,
    verifyByPhone,
    getStudentDetailsById,
    getStudentDetails,
    getAllStudentDetails,
    imgUpload,
    upload,
    bulkSignup,
    signupSingle,
    uploadProfileImage,
    getProfileImage,
    getProfileImageFor,
}