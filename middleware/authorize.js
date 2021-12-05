const jwt = require("jsonwebtoken");
const jwtGenerator = require("../utils/jwtGenerator");
require("dotenv").config();

//this middleware will on continue on if the token is inside the local storage

module.exports = function (req, res, next) {
  // Get token from header
  var token = req.header("jwt_token");
  const refreshToken = req.header("rt_token");

  // Check if not token
  if (!token && !refreshToken) {
    return res.status(403).json({ msg: "authorization denied" });
  } else {
    // Verify token
    try {
      //it is going to give user the user id (user:{id: user.id})
      
      const verify = jwt.verify(token, process.env.jwtSecret);
      req.user = verify.user;
      req.jwtToken = token;
      next();
    } catch (err) {
      //Verify refreshToken
      try {
        //it is going to give user the user id (user:{id: user.id})
        const verifyRefresh = jwt.verify(refreshToken, process.env.rtSecret);
        req.user = verifyRefresh.user;

        token = jwtGenerator(req.user.user_id);
        req.jwtToken = token;
        next();
      } catch (error) {
        res.status(401).json({ msg: "Refresh Token is not valid" });
      }
    }
  }

};