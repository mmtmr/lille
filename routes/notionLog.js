const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

//Create a work event
router.post('/', authorize, async (req, res) => {
    try {
        const {we_title, we_start, we_end, we_desc, we_subject} = req.body;
        const newWorkEvent = await pool.query(
            "INSERT INTO work_event_t (we_title,we_start,we_end,we_desc,we_subject) VALUES ($1,$2,$3,$4,$5)", [we_title, we_start, we_end, we_desc, we_subject]
        );
        res.sendStatus(200);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

//Get all work events
router.get('/', async (req, res) => {
    try {
        const allWorkEvent = await pool.query(
            "SELECT we_id AS id, we_start AS start,we_end AS end,we_title AS title, we_desc AS description,we_subject AS subject FROM WORK_EVENT_T;"
            );
        res.send(allWorkEvent.rows);

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});


//Update a work event
router.put('/:we_id', authorize, async (req, res) => {
    try {
        const { we_id } = req.params;
        const { we_title, we_start, we_end, we_desc, we_subject} = req.body;
        const updateWorkEvent = await pool.query("UPDATE work_event_t SET we_title=$1,we_start=$2,we_end=$3,we_desc=$4,we_subject=$5 WHERE we_id=$6;", [we_title, we_start, we_end, we_desc, we_subject, we_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Delete a work event
router.delete('/:we_id', authorize, async (req, res) => {
    try {
        const { we_id } = req.params;

        const deleteWorkEvent = await pool.query(
            "DELETE FROM work_event_t WHERE we_id=$1;", [we_id]);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

module.exports = router;