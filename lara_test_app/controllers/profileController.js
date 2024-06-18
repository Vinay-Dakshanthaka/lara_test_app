const db = require('../models');



const saveOrUpdateProfile = async(req, res) => {
    try {
        //const student_id = req.studentId;
        const student_id = "1111";
        console.log("student id :",student_id)
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
            user_id: student_id
        };

        // Check if the profile already exists
        const existingProfile = await db.Profile.findOne({ where: { user_id } });

        if (existingProfile) {
            // If the profile exists, update it
            await db.Profile.update(profileInfo, { where: { user_id } });
            res.status(200).send({profile: profileInfo, message: 'Profile updated successfully.' });
        } else {
            // If the profile doesn't exist, create a new one
            await db.Profile.create(profileInfo);
            res.status(200).send({profile: profileInfo, message: 'Profile saved successfully.' });
        }
    } catch (error) {
        res.status(500).send({ message: error.message });
    }
};


module.exports = {
    saveOrUpdateProfile,
}