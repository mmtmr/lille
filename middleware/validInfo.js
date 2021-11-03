module.exports = function(req, res, next) {
    const { user_email, user_name, user_password } = req.body;
  
    function validEmail(userEmail) {
      return /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userEmail);
    }
  
    if (req.path === "/register") {
      console.log(!user_email.length);
      if (![user_email, user_name, user_password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(user_email)) {
        return res.json("Invalid email");
      }
    } else if (req.path === "/login") {
      if (![user_email, user_password].every(Boolean)) {
        return res.json("Missing Credentials");
      } else if (!validEmail(user_email)) {
        return res.json("Invalid email");
      }
    }
  
    next();
  };