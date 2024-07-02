const db = require("../models");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Sequelize } = require("sequelize");
const xlsx = require("xlsx");
const WebinarTrainings = require("../models/WebinarTrainings");

const WebinarsTrainings = db.WebinarsTrainings;
const Student = db.Student;

const addWebinarsTrainings = async (req, res) => {
  try {
    const student_id = req.student_id;
    const user = await Student.findByPk(student_id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    
    const {title, description, date, time, duration, speaker,  link} = req.body;
    const WebinarTrainings = await WebinarsTrainings.create({
        title, description, date, time, duration, speaker, link
    })
    res.status(200).send({message: 'Webinars Added Successfully', WebinarTrainings})

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const getAllWebinarsTrainings = async (req, res) => {
  try {
    const webinarsTrainings = await WebinarsTrainings.findAll();
    res.status(200).send(webinarsTrainings);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const getWebinarsTrainingsById = async (req, res) => {
  try {
    const { id } = req.body;
    const webinarTraining = await WebinarsTrainings.findByPk(id);

    if (!webinarTraining) {
      return res.status(404).send({ message: 'Webinar/Training not found' });
    }

    res.status(200).send(webinarTraining);
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const updateWebinarsTrainings = async (req, res) => {
  try {
    const student_id = req.student_id;
    const user = await Student.findByPk(student_id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    const { id, title, description, date, time, duration, speaker, link } = req.body;

    const webinarTraining = await WebinarsTrainings.findByPk(id);
    if (!webinarTraining) {
      return res.status(404).send({ message: 'Webinar/Training not found' });
    }

    await webinarTraining.update({ title, description, date, time, duration, speaker, link });
    res.status(200).send({ message: 'Webinar/Training updated successfully', webinarTraining });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

const deleteWebinarsTrainings = async (req, res) => {
  try {
    const student_id = req.student_id;
    const user = await Student.findByPk(student_id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }

    const { id } = req.body

    const webinarTraining = await WebinarsTrainings.findByPk(id);

    if (!webinarTraining) {
      return res.status(404).send({ message: 'Webinar/Training not found' });
    }

    await webinarTraining.destroy();
    res.status(200).send({ message: 'Webinar/Training deleted successfully' });
  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};



module.exports = {
    addWebinarsTrainings,
    updateWebinarsTrainings,
    getWebinarsTrainingsById,
    deleteWebinarsTrainings,
    getAllWebinarsTrainings
}
