const db = require('../models');
const multer = require('multer');
const companyLogo = multer({dest: 'CompanyLogos/'});
const fs = require('fs');

const Company = db.Company;
const Student = db.Student;

const validFileFormats = ['jpeg', 'jpg', 'png'];

const saveCompany = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        
        if (role !== 'PLACEMENT OFFICER' && role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const {name, address, type, url, general_mail_id, phoneNumber, description} = req.body;

        const existingCompany = await Company.findOne({where: {general_mail_id}});

        if(existingCompany){
            return res.status(400).send({message : "Company already exists"})
        }

        // Check if the file format is valid
        // const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
        // if (!validFileFormats.includes(fileFormat)) {
        //     throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
        // }

        // const filePath = req.file.path;

        const newCompany = await Company.create({
            name,
            address,
            type,
            url,
            general_mail_id,
            phoneNumber,
            description
        });
        return res.status(200).send({message : "Company added succeccfully", company : newCompany });
    } catch(error) {
        return res.status(500).send({message : error.message});
    }
}

const updateCompany = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
            return res.status(403).send({ message: 'Access Forbidden' });
        }

        const {company_id, name, address, type, url, general_mail_id, phoneNumber, contactPerson} = req.body;

        const newCompany = await Company.findByPk(company_id);

        if (!newCompany) {
            return res.status(404).json({ error: 'No Company found' });
        }
                // update the subject 
        newCompany.name = name;
        newCompany.address = address;
        newCompany.type = type;
        newCompany.url = url;
        newCompany.general_mail_id = general_mail_id;
        newCompany.phoneNumber = phoneNumber;
        newCompany.description = description;

        await newCompany.save(newCompany)

        return res.status(200).send({message : "Company updated succeccfully", newCompany});

    } catch(error) {
        return res.status(500).send({message : error.message});
    }
}

const deleteCompany = async (req, res)=>{
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

        const {company_id} = req.body

        let company = await Company.findByPk(company_id);

        if (!company) {
            return res.status(404).json({ error: 'No Company found' });
        }
        await company.destroy();
        res.status(200).send({message : 'Company Deleted Successfully!!!'});

    }catch(error){
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getAllCompanyDetails = async (req, res) => {
    try {
        // Fetch all company deatils from the database
        const companies = await Company.findAll();

        res.status(200).json(companies);

    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}


const uploadCompanyLogo = async(req, res) => {
    try{

        const {company_id} = req.query;

        const company = await Company.findByPk(company_id);

        //Check if the file format is valid
        const fileFormat = req.file.originalname.split('.').pop().toLowerCase();
        if (!validFileFormats.includes(fileFormat)) {
            throw new Error('Invalid file format. Supported formats: JPEG, JPG, PNG.');
        }

        const filePath = req.file.path;
        company.company_logo = filePath;

        await company.save(company);
        res.status(200).send({message : 'Company Logo uploaded Successfully!!!', filePath});
    } catch (error) {
        console.log(error);
        res.status(500).send({ message: error.message });
    }
}

const getCompanyLogo = async(req, res) => {
    try{

        const {company_id} = req.query;

        const company = await Company.findByPk(company_id);
        if (!company) {
            return res.status(404).send({ message: 'Company not found.' });
        }

        const file = company.company_logo;
        if (!file) {
            return res.status(404).send({ message: 'Image not found.' });
        }

        fs.readFile(file, (err, data) => {
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
    saveCompany,
    updateCompany,
    companyLogo,
    deleteCompany,
    getAllCompanyDetails,
    uploadCompanyLogo,
    getCompanyLogo
}
