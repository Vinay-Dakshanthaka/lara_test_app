const bcrypt = require('bcrypt');
const db = require('../models');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const imgUpload = multer({dest: 'Images/'});
const xlsx = require('xlsx');
const nodemailer = require('nodemailer'); 
const fs = require('fs');
const path = require('path');
const { Where } = require('sequelize/lib/utils');
const { where } = require('sequelize');

const Student = db.Student;
const Skill = db.Skill;
const Student_Skill = db.Student_Skill;
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const jwtSecret = process.env.JWT_SECRET;
// No. of salt rounds hash the password using bcrypt 
const saltRounds = 10;

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Check if email already exists
        const existingStudent = await Student.findOne({ where: { email } });

        if (existingStudent) {
            if (existingStudent.isActive) {
                return res.status(400).send({ message: 'Email already exists' });
            } else {
                // Reactivate the existing student account
                const hashedPassword = await bcrypt.hash(password, saltRounds);
                await existingStudent.update({
                    name,
                    phoneNumber: phone,
                    password: hashedPassword,
                    role: 'STUDENT',
                    isActive: true
                });
                return res.status(200).send({ message: "Signup success", student: existingStudent });
            }
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
        console.log("Student ID : ", newCustomId);

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
            isActive: true
        });

        return res.status(200).send({ message: "Signup success", student: newStudent });
    } catch (error) {
        return res.status(500).send({ message: 'Signup failed', errorMessage: error.message });
    }
};


const verifyByEmail = async (req, res) => {
    try {
        const { email, password } = req.body;
        // console.log("email , password : ", email, " : ", password);

        // Find student data based on email
        const studentData = await Student.findOne({ where: { email } });

        // If no student found, return 404
        if (!studentData) {
            return res.status(404).send({ message: 'No Student Found with this Email Id' });
        }

        // Check if the student's account is active
        if (!studentData.isActive) {
            return res.status(404).send({ message: 'No Student Found with this Email Id' });
        }

        // Compare passwords using bcrypt
        const passwordMatch = await bcrypt.compare(password, studentData.password);

        if (passwordMatch) {
            const token = jwt.sign({ student_id: studentData.student_id, email: studentData.email }, jwtSecret);
            // Generate JWT token
            const role = studentData.role;
            // Check if the password is the default password that needs updating
            if (password === "password@123") {
                return res.status(400).send({ message: 'Please update your password', token, role });
            }

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
            return res.status(404).send({ message: 'No Student Found with this Phone' });
        }

        const passwordMatch = await bcrypt.compare(password, studentData.password);

        if (passwordMatch) {
            const token = jwt.sign({ student_id: studentData.student_id, email: studentData.email }, jwtSecret);
            const role = studentData.role;
            //send token and role to the client 
            return res.status(200).send({ token, role, message: 'Signin success!!' });
        } else {
            return res.status(401).send({ message: 'Invalid Password' });
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
        console.log("1");
        const studentId = req.student_id; // Extracted from the token
        const student = await Student.findByPk(studentId, {
            attributes: { exclude:['password'] }
        });
        if (!student) {
            return res.status(404).send({ message: 'Student not found' });
        }
        console.log("Student",student);
        return res.status(200).send(student);
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};




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
        const invalidEmails = [];
        const student_id = req.student_id;
        const userData = await Student.findOne({
            where: { student_id }
        })

        const userRole = userData.role;

        if (userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER') {
            return res.status(403).send({ message: 'Access Forbidden' });
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
            if(!(emailRegex.test(email))){
                invalidEmails.push(email);
                continue;
            }

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
                        <p> Click the below link to Signin to your Account</p>
                        <a href="http://localhost:5173/signin" target="_blank">http://localhost:5173/signin</a>
                        <p>We recommend that you change your password after logging in for the first time.</p>
                        <p>Until Your password is updated you won't be able to complete the further step.</p>
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
            return res.status(200).send({
                message: 'Bulk signup success with some unsent emails ',
                invalidEmails: invalidEmails,
                emailErrors
            });
        } else {
            return res.status(200).send({
                message: 'Bulk signup success and email sent successfully',
                students: createdStudents
            });
        }
    } catch (error) {
        console.error('Error during bulk signup:', error);
        return res.status(500).send({ message: 'An error occurred during bulk signup.' });
    }
};



const signupSingle = async (req, res) => {
    try {

        const student_id = req.student_id;
        const userData = await Student.findOne({
            where: { student_id }
        })

        const userRole = userData.role;

        if (userRole !== 'SUPER ADMIN' && userRole !== 'PLACEMENT OFFICER') {
            return res.status(403).send({ message: 'Access Forbidden' });
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
                    <p> Click the below link to Signin to your Account</p>
                    <a href="http://localhost:5173/signin" target="_blank">http://localhost:5173/signin</a>
                    <p>We recommend that you change your password after logging in for the first time.</p>
                    <p>Until Your password is updated you won't be able to complete the further step.</p>
                    <p>Thank You,</p>
                    <p>Lara Technologies Team</p>
                </div>
            `
        };

        try {
            await transporter.sendMail(mailOptions);
            return res.status(200).send({ message: 'Account Created successfylly. Email Sent', student: newStudent });
        } catch (emailError) {
            console.error('Error sending email:', emailError);
            return res.status(200).send({
                message: 'Signup success, but there was an error sending the welcome email',
                student: newStudent,
                emailError: emailError.message
            });
        }
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const updatePassword = async (req, res) => {
    try {
        // console.log("Starting password update process");

        const studentId =  req.student_id
        console.log('student id ', studentId)
        // console.log(req.studentId)
        // console.log("Extracted studentId from request:", studentId);

        const student = await Student.findOne({ where: { student_id: studentId } });
        if (!student) {
            return res.status(404).json({ error: 'Student not found' });
        }
        // console.log("Fetched student from database:", student);

        const existingPassword = student.password;
        // console.log("Existing password from database:", existingPassword);

        const { oldPassword, newPassword } = req.body;
        // console.log("Received old password and new password:", oldPassword, ":", newPassword);

        // Compare the provided password with the hashed password in the database
        const passwordMatch = await bcrypt.compare(oldPassword, existingPassword);
        // console.log("Password match result:", passwordMatch);

        // Check if the old password matches the existing password
        if (!passwordMatch) {
            return res.status(400).json({ error: 'Old password does not match' });
        }

        // Update the password with the new password
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        // console.log("Hashed new password:", hashedPassword);

        await Student.update({ password: hashedPassword }, { where: { student_id: studentId } });
        // console.log("Password updated in database");

        res.status(200).send({ message: 'Password updated successfully.' });
    } catch (error) {
        console.error("Error during password update process:", error);
        res.status(500).send({ message: error.message });
    }
};

const sendPasswordResetEmail = async (req, res) => {
    try {
        const { email } = req.body;
        
        // Check if the email exists in the database
        const user = await Student.findOne({ where: { email } });
        if (!user) {
            return res.status(403).send({ message: 'No account exists with this email ID.' });
        }

        // Generate unique token using JWT
        const token = jwt.sign({ student_id: user.student_id }, jwtSecret, { expiresIn: '30m' }); 

        // Define the email options
        const mailOptions = {
            from: 'lara.placementcell@gmail.com', // Sender address
            to: email, // Recipient's email address
            subject: 'Password Reset Request', // Subject line
            html: `
                <div style="font-family: Arial, sans-serif; padding: 20px;">
                    <img src="https://laragrooming.com/laralogo.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
                    <h2>Password Reset Request</h2>
                    <p>We received a request to reset the password associated with your account.</p>
                    <p>To proceed with the password reset, please click on the button below:</p>
                    <a href="https://www.laragrooming.com/resetPassword?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
                    <p>If you did not request a password reset, you can ignore this email.</p>
                    <p>Please note that the link will expire after 30 minutes, so make sure to reset your password promptly.</p>
                    <p>Thank You,</p>
                    <p>Lara Technologies Team</p>
                </div>
            `
        };
        console.log(`http://localhost:5173/reset-password?token=${token}`)
        // Send mail with defined transport object
        await transporter.sendMail(mailOptions);

        return res.status(200).send({ success: true, message: 'Password reset email sent successfully.' });
    } catch (error) {
        console.error('Error sending password reset email:', error);
        return res.status(500).send({ success: false, message: 'An error occurred while sending the password reset email.' });
    }
};



// const sendPasswordResetEmail = async (req, res) => {
//     try {
//         const { email } = req.body;

//         // Check if the email exists in the database
//         const user = await Student.findOne({ where: { email } });
//         if (!user) {
//             return res.status(403).send({ message: 'No account exists with this email ID.' });
//         }

//         // Generate unique token using JWT
//         const token = jwt.sign({ student_id: user.id }, jwtSecret, { expiresIn: '30m' }); 

//         // Define the email options
//         const mailOptions = {
//             from: 'lara.placementcell@gmail.com',
//             to: email, // Recipient's email address
//             subject: 'Password Reset Request', // Subject line
//             html: `
//                 <div style="font-family: Arial, sans-serif; padding: 20px;">
//                     <img src="https://laragrooming.com/laralogo.webp" alt="Lara Technologies Logo" style="max-width: 150px;">
//                     <h2>Password Reset Request</h2>
//                     <p>We received a request to reset the password associated with your account.</p>
//                     <p>To proceed with the password reset, please click on the button below:</p>
//                     <a href="http://localhost:8080/resetPassword?token=${token}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: #fff; text-decoration: none; border-radius: 5px;">Reset Password</a>
//                     <p>If you did not request a password reset, you can ignore this email.</p>
//                     <p>Please note that the link will expire after 30 minutes, so make sure to reset your password promptly.</p>
//                     <p>Thank You,</p>
//                     <p>Lara Technologies Team</p>
//                 </div>
//             `
//         };

//         console.log(`http://localhost:5173/reset-password?token=${token}`);

//         // Send mail with defined transport object
//         await transporter.sendMail(mailOptions);

//         return res.status(200).send({ success: true, message: 'Password reset email sent successfully.' });
//     } catch (error) {
//         console.error('Error sending password reset email:', error);
//         return res.status(500).send({ success: false, message: 'An error occurred while sending the password reset email.' });
//     }
// };


const resetPassword = async (req, res) => {
    try {
        const { newPassword } = req.body;
        const token = req.query.token; // Get the token from the query parameters which is sent along with the email link

        if (!token) {
            return res.status(400).send({ message: 'Token is missing.' });
        }

        // Verify the JWT token
        jwt.verify(token, jwtSecret, async (err, decoded) => {
            if (err) {
              console.error('Error verifying token:', err);
              console.log('Token:', token);
              console.log('jwtSecret:', jwtSecret);
              return res.status(403).send({ message: 'Invalid or expired token.' });
            }
          
            console.log('Decoded token:', decoded);
          
            if (!decoded || !decoded.student_id) {
              console.error('Decoded token is invalid or missing student_id');
              return res.status(403).send({ message: 'Invalid token.' });
            }
          
            const studentId = decoded.student_id;
            req.student_id = studentId;
          
            // Retrieve user information from the database
            try {
              const user = await Student.findOne({ where: { student_id: studentId } });
              console.log('user:', user);
              if (!user) {
                return res.status(404).send({ message: 'User not found.' });
              }
          
              // Hash the new password
              const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
          
              // Update the password in the database
              await Student.update({ password: hashedPassword }, { where: { student_id: studentId } });
          
              res.status(200).send({ message: 'Password updated successfully.' });
            } catch (error) {
              console.error('Error finding user:', error);
              res.status(500).send({ message: 'An error occurred while resetting the password.' });
            }
          });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).send({ message: 'An error occurred while resetting the password.' });
    }
};




const validFileFormats = ['jpeg', 'jpg', 'png'];

const uploadProfileImage = async (req, res) => {
    // console.log("222222222222222222");
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
    console.log("111111111111111");
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

const updateStudentNameAndPhoneNumber = async (req, res) => {
    const studentId = req.student_id;
    const { name, phoneNumber } = req.body;

    const user = Student.findByPk(studentId);
    if(!user){
        return res.status(404).send({message: "Student not found"})
    }

    try {
        await Student.update(
            { name:name, phoneNumber:phoneNumber },
            { where: { student_id: studentId } }
        );
        res.status(200).send({ message: 'Student information updated successfully.', name, phoneNumber });
    } catch (error) {
        console.error('Error updating student information:', error);
        res.status(500).send({ message: error.message });
    }
}

const deleteAccount = async (req, res) => {
    try {
        const studentId = req.student_id;

        // Find student data based on student ID
        const studentData = await Student.findOne({ where: { student_id: studentId } });

        // If no student found, return 404
        if (!studentData) {
            return res.status(404).send({ message: 'No Student Found with this ID' });
        }

        // If the account is already inactive, return 404 not found
        if (!studentData.isActive) {
            return res.status(404).send({ message: 'No user found' });
        }

        // Mark the account as inactive
        await studentData.update({ isActive: false });

        // Check if profile details exist and delete if they do
        const profileData = await Profile.findOne({ where: { student_id: studentId } });

        if (profileData) {
            await Profile.destroy({ where: { student_id: studentId } });
        }

        return res.status(200).send({ message: 'Account and profile details deleted successfully.' });
    } catch (error) {
        // Handle any unexpected errors
        console.error('Error in deleteAccount:', error);
        return res.status(500).send({ message: 'Internal server error' });
    }
};

const addSkillsToStudent = async (req, res) => {
    try {
        const { student_id, skill_ids } = req.body; 
  
        if (!student_id || !skill_ids) {
            return res.status(400).json({ error: 'Missing skillId or studentId in request body' });
        }
  
        const student = await Student.findByPk(student_id);
  
        if (!student) {
            return res.status(404).json({ error: 'No student found' });
        }
        
        const skills = await Skill.findAll({ where: { skill_id : skill_ids } });
        // Ensure all skills exist
        if (skills.length !== skill_ids.length) {
            return res.status(404).json({ error: 'One or more skills not found' });
        }
        await Promise.all(skill_ids.map(async skill_id => {
            await Student_Skill.create({
                skill_id: skill_id,
                student_id: student_id
            });
        }));
  
        return res.status(200).json({ message: 'Skills added to the student successfully.' });
    } catch (error) {
        console.error('Failed to add skills to the student.', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

const removeSkillFromStudent = async (req, res) => {
    try {
        const { student_id, skill_id } = req.body; 
  
        if (!student_id || !skill_id) {
            return res.status(400).json({ error: 'Missing studentId or skillId in request body' });
        }
  
        await Student_Skill.destroy({ where: { student_id, skill_id } });
  
        return res.status(200).json({ message: 'Skill removed from student successfully.' });
    } catch (error) {
        console.error('Failed to remove skill from student.', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = {
    signup,
    verifyByEmail,
    verifyByPhone,
    getStudentDetailsById,
    getStudentDetails,
    imgUpload,
    upload,
    bulkSignup,
    signupSingle,
    uploadProfileImage,
    getProfileImage,
    getProfileImageFor,
    updateStudentNameAndPhoneNumber,
    sendPasswordResetEmail,
    updatePassword,
    resetPassword,
    deleteAccount,
    addSkillsToStudent,
    removeSkillFromStudent
}