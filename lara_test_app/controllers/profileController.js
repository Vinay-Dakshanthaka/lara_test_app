const db = require('../models');

const Student = db.Student;
const Profile = db.Profile;


const saveOrUpdateProfile = async(req, res) => {
    try {
        const id = req.student_id;
        //var student_id = "LARA00002";
        // console.log("student id :",student_id);
        const profileInfo = {
            name: req.body.name,
            gender: req.body.gender,
            highest_education: req.body.highest_education,
            year_of_passout: req.body.year_of_passout,
            specialization: req.body.specialization,
            highest_education_percent: req.body.highest_education_percent,
            tenth_percentage: req.body.tenth_percentage,
            twelth_percentage: req.body.twelth_percentage,
            mobile_number: req.body.mobile_number,
            father_name: req.body.father_name,
            father_mobile_number: req.body.father_mobile_number,
            father_occupation: req.body.father_occupation,
            mother_name: req.body.mother_name,
            mother_mobile_number: req.body.mother_mobile_number,
            adhaar_number: req.body.adhaar_number,
            address: req.body.address,
            pincode: req.body.pincode,  
            city: req.body.city,
            district: req.body.district,
            state: req.body.state,
            country: req.body.country,
            student_id: id
        };
        // console.log("profle info ", profileInfo)
  
        // console.log("Student id ", student_id)
        //  Check if the profile already exists
         const existingProfile = await Profile.findOne({ where: { student_id:id } });

        // Check if the profile already exists in Student table
        //const existingProfileAsStudent = await db.Student.findOne({ where: { student_id } });

        if (existingProfile) {
            // If the profile exists, update it
            await Profile.update(profileInfo, { where: { student_id:id } });
            res.status(200).send({profile: profileInfo, message: 'Profile updated successfully.' });
        } else {
            // If the profile doesn't exist, create a new one
            await Profile.create(profileInfo);
            res.status(200).send({profile: profileInfo, message: 'Profile saved successfully.' });
        }

        // if (existingProfileAsStudent) {
        //     // If the profile exists, update it
        //     const existingProfile = await db.Profile.findOne({ where: { student_id } });
        //     if (existingProfile){
        //         await db.Profile.update(profileInfo, { where: { student_id } });
        //         res.status(200).send({profile: profileInfo, message: 'Profile updated successfully.' });
        //     }

        //     else {
        //         // If the profile doesn't exist, create a new one
        //         await db.Profile.create(profileInfo);
        //         res.status(200).send({profile: profileInfo, message: 'Profile saved successfully.' });
        //     }
        // } else {
        //     // If the profile doesn't exist, 
        //     // await db.Profile.create(profileInfo);
        //     // res.status(200).send({profile: profileInfo, message: 'Profile saved successfully.' });
        //     res.status(400).send({message: 'Please sign in' });
        // }

    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



// Get profile details controller
const getProfileDetails = async (req, res) => {
    try {
        // console.log("inside get profile tyr")
        const student_id = req.student_id;
        const profile = await Profile.findOne({ where: { student_id } });
        if (profile) {
            res.status(200).send(profile);
        } else {
            res.status(404).send({ message: 'Profile not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};



const getProfileDetailsById = async (req, res) => {
    try {
        const {student_id} = req.body;
        const profile = await Profile.findOne({ where: { student_id } });
        if (profile) {
            res.status(200).send(profile);
        } else {
            res.status(404).send({ message: 'Profile not found.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


module.exports = {
    saveOrUpdateProfile,
    getProfileDetails,
    getProfileDetailsById,
}