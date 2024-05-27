const mongoose = require("mongoose");

const patientSchemea = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name of patient"],
    minlength: [4, "name should not be less then 4 characters"],
    maxlength: [15, "name should be greater then 15 characters"],
  },
  guardianName: {
    type: String,
    required: [true, "Please provide guardian name of patient"],
    minlength: [4, " guadrian name should not be less then 4 characters"],
    maxlength: [15, " guardian name should be greater then 15 characters"],
  },
  address: {
    type: String,
    required: [true, "Please provide address of patient"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number of patient "],
  },
  phoneNumber: {
    type: String,
    required: [true, "Please provide phone number of patient"],
  },
  NIC: {
    type: String,
    required: [true, "Please provide NIC of patient"],
    minlength: [11, "NIC should be of 11 character"],
    maxlength: [15, "NIC should be of 11 character"],
  },
  age: {
    type: String,
    required: [true, "Please provide age of patient"],
  },
});

const Patient = mongoose.model("Patient", patientSchemea);

module.exports = Patient;
