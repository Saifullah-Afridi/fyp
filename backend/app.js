const express = require("express");
const app = express();
const AppError = require("./utils/AppError");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const patientRoutes = require("./routes/PatientRoutes");
const employeRoutes = require("./routes/employeeRoutes");
const globalErrorHandler = require("./controllers/globalErrorHandler");

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

//routes
app.get("/bout", () => {});
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/employee", employeRoutes);

app.all("*", (req, res, next) => {
  next(new AppError("Can not find " + req.originalUrl, 404));
});

app.use(globalErrorHandler);
module.exports = app;
