const mongoose = require("mongoose");

const patientSchema = new mongoose.Schema(
  {
    patientName: {
      type: String,
      required: [true, "Please provide name of patient"],
      minlength: [3, "Patient name should not be less than 4 characters"],
      maxlength: [20, "Patient name should not be greater than 15 characters"],
    },
    NIC: {
      type: String,
      unique: [true, "This NIC Already exist "],
      required: [true, "Please provide NIC of patient"],
    },
    guardianName: {
      type: String,
      required: [true, "Please provide guardian name of patient"],
      minlength: [3, "Guardian name should not be less than 4 characters"],
      maxlength: [20, "Guardian name should not be greater than 15 characters"],
    },
    address: {
      type: String,
      required: [true, "Please provide address of patient"],
    },
    phoneNumber: {
      type: String,
      unique: true,
      required: [true, "Please provide phone number of patient"],
    },

    age: {
      type: String,
      required: [true, "Please provide age of patient"],
    },
  },
  { timestamps: true }
);

const Patient = mongoose.model("Patient", patientSchema);

module.exports = Patient;
