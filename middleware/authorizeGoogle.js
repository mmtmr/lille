module.exports = function (req, res, next) {
  if (req.isAuthenticated) {
    next();
  } else {
    return res.status(401).json({ message: "google not signed in" });
  }

};