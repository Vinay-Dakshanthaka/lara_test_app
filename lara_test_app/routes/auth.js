const express = require('express');
const authRoute = express.Router();
const bcrypt = require('bcrypt');
const { User } = require('../models'); // Adjust the path as per your project structure

const saltRounds = 15;

// POST route for user signup
authRoute.post('/signup', async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Generate customId (e.g., "LARA00001")
        const lastUser = await User.findOne({
            order: [['customId', 'DESC']] // Ordering by customId
        });

        let lastIdNumber = 0;
        if (lastUser && lastUser.customId) {
            const lastId = lastUser.customId;
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
        res.status(500).send({ message: error.message });
    }
});

module.exports = authRoute;
