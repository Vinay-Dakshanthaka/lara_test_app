const db = require('../models');

const Student = db.Student;
const PlacementTest = db.PlacementTest;
const PlacementTestTopic = db.PlacementTestTopic;
const PlacementTestStudent = db.PlacementTestStudent;
const Topic = db.Topic;
const {baseURL} = require('./baseURLConfig')


const createPlacementTestLink = async (req, res) => {
    try {
        const { number_of_questions, description, start_time, end_time, show_result, topic_ids } = req.body;

        if (!number_of_questions || !start_time || !end_time || !Array.isArray(topic_ids) || topic_ids.length === 0) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Validate that all provided topic_ids exist in the topics table
        const topics = await Topic.findAll({
            where: {
                topic_id: topic_ids
            }
        });

        if (topics.length !== topic_ids.length) {
            return res.status(400).send({ message: 'One or more topic IDs are invalid' });
        }

        const newTest = await PlacementTest.create({
            test_link: '', // Initially empty, will be updated later
            number_of_questions,
            description,
            start_time,
            end_time,
            show_result: show_result !== undefined ? show_result : true // Default to true if not provided
        });

        // Generate the test link using the created test ID
        const test_link = `${baseURL}/test/${newTest.placement_test_id}`;

        // Update the test link in the database
        newTest.test_link = test_link;
        await newTest.save();

        // Save the topic IDs in the PlacementTestTopic table
        const topicPromises = topic_ids.map(topic_id => 
            PlacementTestTopic.create({
                placement_test_id: newTest.placement_test_id,
                topic_id
            })
        );

        await Promise.all(topicPromises);

        return res.status(200).send({ message: 'Placement test added successfully', newTest });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};

const savePlacementTestStudent = async (req, res) => {
    try {
        const { name, email, phone_number } = req.body;

        // Check if all required fields are provided
        if (!name || !email || !phone_number ) {
            return res.status(400).send({ message: 'Required fields are missing or invalid' });
        }

        // Check if the email already exists in the PlacementTestStudent table
        const existingStudent = await PlacementTestStudent.findOne({
            where: {
                email
            }
        });

        if (existingStudent) {
            return res.status(200).send({ message: 'Student details already exist' });
        }

        // Create the new student record
        const newStudent = await PlacementTestStudent.create({
            student_name:name,
            email,
            phone_number
        });

        return res.status(200).send({ message: 'Student details saved successfully', newStudent });
    } catch (error) {
        return res.status(500).send({ message: error.message });
    }
};


module.exports = {
    createPlacementTestLink,
    savePlacementTestStudent 
}