const mongoose = require("mongoose");

const dataBaseConnect = () => {
  mongoose.connect(process.env.DB_URI).then(() => {
    console.log("database connected successfully");
  });
};

module.exports = dataBaseConnect;
