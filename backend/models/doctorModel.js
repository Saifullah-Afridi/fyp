const mongoose = require("mongoose");
const doctorSchema = new mongoose.Schema({
  doctorName: {
    type: String,
    required: [true, "Provide the doctor name"],
    minlength: [3, "The minimum name should be of 3 character long"],
    maxlength: [15, "The maximum name should be of 15 character long"],
  },
  phoneNumber: {
    type: String,
    required: [true, "Provide the phone Number"],
    minlength: [11, "The minimum name should be of 11 character long"],
    maxlength: [11, "The maximum name should be of 11 character long"],
  },
  sepeciality: {
    type: String,
    required: [true, "Provide doctor speciality"],
  },
  address: {
    type: String,
    required: [true, "provide doctor address"],
  },
});

const Doctor = mongoose.model("Doctor", doctorSchema);

module.exports = Doctor;
