const bcrypt = require('bcrypt');
const { User } = require('../models'); 



// No. of salt rounds hash the password using bcrypt 
const saltRounds = 15;

const signup = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Generate user_id (e.g., "LARA00001")
        const lastUser = await User.findOne({
            order: [['user_id', 'DESC']] // Ordering by user_id
        });

        let lastIdNumber = 0;
        if (lastUser && lastUser.user_id) {
            const lastId = lastUser.user_id;
            lastIdNumber = parseInt(lastId.replace('LARA', ''), 10);
        }

        const newIdNumber = lastIdNumber + 1;
        const newCustomId = `LARA${newIdNumber.toString().padStart(5, '0')}`;
        console.log("User ID : ", newCustomId)
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Create the user in the database
        const newUser = await User.create({
            user_id: newCustomId,
            name,
            email,
            phoneNumber: phone,
            password: hashedPassword,
            role: 'STUDENT', 
            
        });

        res.status(200).send({ message: "Signup success", user: newUser });
    } catch (error) {
        res.status(500).send({ message: error , errorMessage : error.message});
    }
}


module.exports = {
    signup,
}