const mongoose = require("mongoose");
const EmployeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide the doctor name"],
    minlength: [3, "The minimum name should be of 3 character long"],
    maxlength: [15, "The maximum name should be of 15 character long"],
    trim: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Provide the phone Number"],
    minlength: [11, "The minimum name should be of 11 character long"],
    maxlength: [11, "The maximum name should be of 11 character long"],
  },
  password: {
    type: String,
    required: [true, "Provide the phone Number"],
    minlength: [6, "The minimum length should be 6"],
    maxlength: [true, "the maximum length should be 10"],
  },
  confirmPassword: {
    type: String,
    required: [true, "please confirm your password"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
    },
    message: "the password does not match please try again later",
  },
  address: {
    type: String,
    required: [true, "provide doctor address"],
  },
  occupation: {
    type: String,
    required: [true, "please provide speciality"],
    enum: ["doctor", "recipient"],
  },
  sepeciality: {
    type: String,
    default: "none",
  },
});

const Employee = mongoose.model("Doctor", EmployeeSchema);

module.exports = Employee;
