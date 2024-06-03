const express = require("express");
const app = express();
const AppError = require("./utils/AppError");
const globalErrorHandler = require("./middlewares/globalErrorHandler");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const patientRoutes = require("./routes/PatientRoutes");
const doctorRoutes = require("./routes/doctorRoutes");

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
app.get("/a", (req, res) => {
  res.send("hello there");
});
app.use("/api/v1/patient", patientRoutes);
app.use("/api/v1/patient", doctorRoutes);

app.all("*", (req, res, next) => {
  next(new AppError(`can not find ${req.originalUrl} on this server`, 404));
});
app.use(globalErrorHandler);

module.exports = app;
