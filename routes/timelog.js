const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

//Create a timelog
router.post('/', authorize, async (req, res) => {
    try {
        const { tl_date, tl_standby_min, tl_real_min, tsk_id, st_ids } = req.body;
        const newTimeLog = await pool.query(
            "INSERT INTO time_log_t (tl_date,tl_standby_min,tl_real_min,tsk_id) VALUES ($1,$2,$3,$4) RETURNING tl_id", [tl_date, tl_standby_min, tl_real_min, tsk_id]
        );
        const { tl_id } = newTimeLog.rows[0];

        async function addSubtaskToTimeLog(tl_id, st_id) {
            pool.query(
                "INSERT INTO tl_st_relation_t (tl_id,st_id) VALUES ($1,$2)", [tl_id, st_id]
            )
        }
        const newTimeLogSubtask = await st_ids.map(st_id => addSubtaskToTimeLog(tl_id, st_id));
        res.sendStatus(200);
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

//Get all timelog and their subtask
router.get('/', authorize, async (req, res) => {
    try {
        const tl_st = await pool.query("SELECT * FROM tl_st_relation_t;");
        const tl_st_ids = tl_st.rows.map(tl_st => Object.values(tl_st));
        const timelog = await pool.query("SELECT * FROM time_log_t;");
        var allTimelog = timelog.rows;

        allTimelog.map(tl => tl.subtask = []);
        allTimelog.map(tl => tl.st_ids = []);

        for (var all_tl of allTimelog) {
            const tsk = await pool.query(
                "SELECT * FROM task_t WHERE tsk_id= $1;", [all_tl.tsk_id]
            );
            all_tl.task = tsk.rows[0];
        }

        for (var tl_st_id of tl_st_ids) {
            const tl = await pool.query(
                "SELECT * FROM time_log_t WHERE tl_id= $1;", [tl_st_id[0]]
            );
            var tl_val = tl.rows[0];
            const st = await pool.query(
                "SELECT * FROM subtask_t WHERE st_id= $1;", [tl_st_id[1]]
            );
            var st_val = st.rows[0];


            for (var all_tl of allTimelog) {
                if (all_tl.tl_id === tl_val.tl_id) {
                    all_tl.subtask.push(st_val);
                    all_tl.st_ids.push(tl_st_id[1]);
                    break;
                }
            }


        } res.json(allTimelog);

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Get a timelog and its task and subtask
router.get('/:tl_id', authorize, async (req, res) => {
    try {
        const { tl_id } = req.params;
        const timelog = await pool.query("SELECT * FROM time_log_t WHERE tl_id = $1;", [tl_id]);

        const subtask_ids = await pool.query(
            "SELECT st_id FROM tl_st_relation_t WHERE tl_id = $1;", [tl_id]
        );


        const st_ids = subtask_ids.rows.map(({ st_id }) => st_id);


        var subtask = [];
        for (var st_id of st_ids) {
            const st = await pool.query(
                "SELECT * FROM subtask_t WHERE st_id= $1;", [st_id]
            );
            subtask.push(st.rows[0]);
        }

        var timelogValue = timelog.rows[0];

        const task = await pool.query(
            "SELECT * FROM task_t WHERE tsk_id= $1;", [timelogValue.tsk_id]
        );

        timelogValue.task = task.rows[0];
        timelogValue.subtask = subtask;
        timelogValue.st_ids = st_ids;
        res.json(timelogValue);

    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Update a timelog
router.put('/:tl_id', authorize, async (req, res) => {
    try {
        const { tl_id } = req.params;
        const { tl_date, tl_standby_min, tl_real_min, tsk_id, st_ids } = req.body;
        const updateTimeLog = await pool.query("UPDATE time_log_t SET tl_date=$1,tl_standby_min=$2,tl_real_min=$3,tsk_id=$4 WHERE tl_id=$5;", [tl_date, tl_standby_min, tl_real_min, tsk_id, tl_id]);
        const deleteSubtaskofTimeLog = await pool.query("DELETE FROM tl_st_relation_t WHERE tl_id=$1;", [tl_id]);

        async function addSubtaskToTimeLog(tl_id, st_id) {
            pool.query(
                "INSERT INTO tl_st_relation_t (tl_id,st_id) VALUES ($1,$2)", [tl_id, st_id]
            )
        }
        const newTimeLogSubtask = await st_ids.map(st_id => addSubtaskToTimeLog(tl_id, st_id));
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Delete a timelog
router.delete('/:tl_id', authorize, async (req, res) => {
    try {
        const { tl_id } = req.params;

        const deleteTimeLog = await pool.query(
            "DELETE FROM time_log_t WHERE tl_id=$1;", [tl_id]);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

module.exports = router;