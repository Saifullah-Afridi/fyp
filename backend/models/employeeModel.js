const mongoose = require("mongoose");
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { promisify } = require("util");
const employeeSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Provide the doctor name"],
    minlength: [3, "The minimum name should be of 3 character long"],
    maxlength: [15, "The maximum name should be of 15 character long"],
    trim: true,
  },
  NIC: {
    type: String,
    unique: true,
    trim: true,
    required: [true, "Please provide NIC"],
    minlength: [13, "NIC should be  13 characters"],
    maxlength: [13, "NIC should 13 characters"],
  },
  phoneNumber: {
    type: String,
    unique: true,
    required: [true, "Provide the phone Number"],
    minlength: [11, "The phone number should be  of 11 character long"],
    maxlength: [11, "The phone number should be of 11 character long"],
  },
  password: {
    type: String,
    required: [true, "Provide Password"],
    minlength: [6, "The minimum length should be 6"],
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
    required: [true, "Please provide address"],
  },
  occupation: {
    type: String,
    required: [true, "please provide speciality"],
    enum: ["doctor", "receptionist", "pharmacist", "admin"],
  },
  sepeciality: {
    type: String,
    default: "none",
  },
});

//only runs with save and ccreate does not work with findoneandupdate

employeeSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcryptjs.hash(this.password, 9);
  this.confirmPassword = undefined;
});

employeeSchema.methods.comparePassword = async function (
  enteredPassword,
  userPassword
) {
  return await bcryptjs.compare(enteredPassword, userPassword);
};

employeeSchema.methods.generateJsonWebToken = async function () {
  const token = await promisify(jwt.sign)(
    { _id: this._id },
    process.env.SECRET,
    {
      expiresIn: "9 days",
    }
  );
  return token;
};

const Employee = mongoose.model("Employee", employeeSchema);

module.exports = Employee;
