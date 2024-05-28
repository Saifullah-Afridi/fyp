const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema({
  patientName: {
    type: String,
    required: [true, "Please provide name of patient"],
    minlength: [4, "Name should not be less than 4 characters"],
    maxlength: [15, "Name should not be greater than 15 characters"],
  },
  guardianName: {
    type: String,
    required: [true, "Please provide guardian name of patient"],
    minlength: [4, "Guardian name should not be less than 4 characters"],
    maxlength: [15, "Guardian name should not be greater than 15 characters"],
  },
  address: {
    type: String,
    required: [true, "Please provide address of patient"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number of patient"],
  },
  NIC: {
    type: String,
    required: [true, "Please provide NIC of patient"],
    minlength: [11, "NIC should be at least 11 characters"],
  },
  age: {
    type: String,
    required: [true, "Please provide age of patient"],
  },
});

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
