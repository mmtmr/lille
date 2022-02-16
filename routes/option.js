const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

//Get the option
router.get("/:param", async (req, res) => {
    try {
        const { param } = req.params;
        const user_id = req.header("user_id");
        // console.log(user_id)

        const userDetails = await pool.query(
            "SELECT * FROM USER_T WHERE user_id=$1;",
            [user_id]);

        const allOptions = await pool.query(
            "SELECT * FROM OPTION_T WHERE user_id=$1;",
            [user_id]);



        switch (param) {
            case 'opt_dashboard_image_url':
                res.send(allOptions.rows[0].opt_dashboard_image_url);
                break;
            case 'opt_google_api_key':
                res.send(allOptions.rows[0].opt_google_api_key);
                break;
            case 'user_name':
                res.send(userDetails.rows[0].user_name);
                break;
            default:
                res.send(allOptions.rows[0]);
        }

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});


//Update the option
router.put("/", async (req, res) => {
    try {
        const user_id = req.header("user_id");
        const { opt_notion_database_id, opt_google_api_key, opt_dashboard_image_url, opt_colour_scheme, opt_school, opt_habit, opt_revision } = req.body;
        const updateOption = await pool.query("UPDATE OPTION_T SET opt_notion_database_id=$1,opt_google_api_key=$2,opt_dashboard_image_url=$3,opt_colour_scheme=$4,opt_school=$5,opt_habit=$6,opt_revision=$7 WHERE user_id=$8;",
            [opt_notion_database_id, opt_google_api_key, opt_dashboard_image_url, opt_colour_scheme, opt_school, opt_habit, opt_revision, user_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

module.exports = router;