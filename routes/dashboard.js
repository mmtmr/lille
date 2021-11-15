const router = require("express").Router();
const authorize = require("../middleware/authorize");
const pool = require("../db");

router.get("/", authorize, async (req, res) => {
  const user_id='84d81b06-5f3b-4e6e-8320-61391fe59bbe';
  try {
    const user = await pool.query(
      "SELECT user_name FROM USER_T WHERE user_id = $1",
      [user_id] 
    ); 
    
  //if would be req.user if you change your payload to this:
    
  //   function jwtGenerator(user_id) {
  //   const payload = {
  //     user: user_id
  //   };
    res.json(user.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;