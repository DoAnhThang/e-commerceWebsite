module.exports = (req, res, next) => {
  if (!req.session.isAuthenticated) {
    return res
      .status(503)
      .json({ expired: true, errorMsg: "Expired or invalid cookies!" });
  }
  next();
};
