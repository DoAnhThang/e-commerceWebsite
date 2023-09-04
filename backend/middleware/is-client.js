const User = require("../models/user");

module.exports = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id);
    if (user.role !== "admin" && user.role !== "consultant") {
      return res.status(401).json({ errorMsg: "Unauthorized!" });
    }
    next();
  } catch (err) {
    next(err);
  }
};
