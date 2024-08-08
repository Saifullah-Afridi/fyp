const Visit = require("../models/visitModel");

exports.recordVisit = async (req, res, next) => {
  try {
    const { patientId, prescription, tests, medicines } = req.body;

    const visit = await Visit.findOneAndUpdate(
      { patientId, date: { $gte: new Date().setHours(0, 0, 0, 0) } },
      { prescription, tests, medicines },
      { new: true }
    );

    if (!visit) {
      return res
        .status(404)
        .json({ status: "fail", message: "Visit record not found" });
    }

    res.status(200).json({ status: "success", visit });
  } catch (error) {
    next(error);
  }
};
