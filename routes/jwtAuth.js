const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const pool = require("../db");
const validInfo = require("../middleware/validInfo");
const jwtGenerator = require("../utils/jwtGenerator");
const rtGenerator = require("../utils/rtGenerator");
const authorize = require("../middleware/authorize");

//authorizeentication

router.post("/register", validInfo, async (req, res) => {
// router.post("/register", async (req, res) => {
  const { user_email, user_name, user_password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM USER_T WHERE user_email = $1", [
      user_email
    ]);

    if (user.rows.length > 0) {
      return res.status(401).json("User already exist!");
    }

    const salt = await bcrypt.genSalt(10);
    const bcryptPassword = await bcrypt.hash(user_password, salt);

    let newUser = await pool.query(
      "INSERT INTO USER_T (user_name, user_email, user_password) VALUES ($1, $2, $3) RETURNING *",
      [user_name, user_email, bcryptPassword]
    );

    const jwtToken = jwtGenerator(newUser.rows[0].user_id);
    const rtToken = rtGenerator(newUser.rows[0].user_id);

    return res.status(200).json({ jwtToken, rtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/login", validInfo, async (req, res) => {
// router.post("/login", async (req, res) => {
  const { user_email, user_password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM USER_T WHERE user_email = $1", [
      user_email
    ]);

    if (user.rows.length === 0) {
      return res.status(401).json("Invalid Credential");
    }

    const validPassword = await bcrypt.compare(
      user_password,
      user.rows[0].user_password
    );

    if (!validPassword) {
      return res.status(401).json("Invalid Credential");
    }
    const jwtToken = jwtGenerator(user.rows[0].user_id);
    const rtToken = rtGenerator(user.rows[0].user_id);
    return res.status(200).json({ jwtToken, rtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

router.post("/verify", authorize, (req, res) => {
  const jwtToken=req.jwtToken;
  try {
    res.status(200).json({ jwtToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;