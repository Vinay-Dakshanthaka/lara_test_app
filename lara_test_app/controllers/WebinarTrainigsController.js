const db = require("../models");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const { Sequelize } = require("sequelize");
const xlsx = require("xlsx");
const WebinarTrainings = require("../models/WebinarTrainings");

const WebinarsTrainings = db.WebinarsTrainings;
const Student = db.Student;

const AddWebinarsTrainings = async (req, res) => {
  try {
    const student_id = req.student_id;
    const user = await Student.findByPk(student_id);
    const userRole = user.role;

    if (userRole !== "SUPER ADMIN" && userRole !== "PLACEMENT OFFICER") {
      return res.status(403).send({ message: "Access Forbidden" });
    }
    
    const {title, description, date, time, duration, speaker,  link} = req.body;
    const WebinarsTrainings = await WebinarTrainings.create({
        title, description, date, time, duration, speaker, link
    })
    res.status(200).send({message: 'Webinars Added Successfully', WebinarsTrainings})

  } catch (error) {
    console.log(error);
    res.status(500).send({ message: error.message });
  }
};

module.exports = {
    AddWebinarsTrainings
}
