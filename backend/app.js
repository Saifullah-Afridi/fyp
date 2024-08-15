const express = require("express");
const app = express();

const AppError = require("./utils/AppError");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const patientRoutes = require("./routes/PatientRoutes");
const visitRoutes = require("./routes/visitRoutes");
const employeRoutes = require("./routes/employeeRoutes");
const globalErrorHandler = require("./controllers/globalErrorHandler");
const cookieParser = require("cookie-parser");
app.use(express.json());
app.use(cookieParser());
app.use(
  "*",
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(morgan("dev"));
app.use(cookieParser());
//routes

app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/visit", visitRoutes);
app.use("/api/v1/employee", employeRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("Can not find " + req.originalUrl, 404));
});

app.use(globalErrorHandler);
module.exports = app;
