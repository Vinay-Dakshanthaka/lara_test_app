const db = require('../models');
const multer = require('multer');
const companyLogo = multer({dest: 'CompanyLogos/'});

const Company = db.Company;
const Student = db.Student;

const validFileFormats = ['jpeg', 'jpg', 'png'];

const saveCompany = async(req, res) => {
    try{
        const id = req.student_id;
        const student = await Student.findByPk(id);
        const role = student.role;
        
        if (role !== 'PLACEMENT OFFICER' & role !== 'SUPER ADMIN') {
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
            description,
            //company_logo : filePath
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

        res.status(200).send({message : "Company updated succeccfully", newCompany});

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

        await company.destroy(company)

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


module.exports = {
    saveCompany,
    updateCompany,
    companyLogo,
    deleteCompany,
    getAllCompanyDetails
}
