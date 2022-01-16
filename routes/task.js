const express = require("express");
const router = express.Router();
const pool = require("../db");
const authorize = require("../middleware/authorize");

//Task
//Create a task
router.post('/',authorize, async (req, res) => {

    try {
        const user_id = req.header("user_id");
        const { tsk_name, tsk_est_min, tsk_todo } = req.body;
        const newTask = await pool.query(
            "INSERT INTO task_t (tsk_name,tsk_est_min,tsk_todo,user_id) VALUES ($1,$2,$3,$4)", [tsk_name, tsk_est_min, tsk_todo, user_id]
        );
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});
//Create a subtask
router.post('/:tsk_id', authorize, async (req, res) => {

    try {
        const user_id = req.header("user_id");
        const { tsk_id } = req.params;
        const { st_name } = req.body;
        const newTask = await pool.query(
            "INSERT INTO subtask_t (st_name,tsk_id) VALUES ($1,$2,$3)", [st_name, tsk_id, user_id]
        );
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

//Get all tasks and subtasks with their occurance rate
router.get('/', authorize, async (req, res) => {
    try {
        const user_id = req.header("user_id");
        const allTasks = await pool.query(
            "SELECT * FROM task_t WHERE user_id=$1;",
            [user_id]
        );
        const allSubtasks = await pool.query(
            "SELECT * FROM subtask_t WHERE user_id=$2;",
            [user_id]
        );

        const allTasks_val = allTasks.rows;
        const allSubtasks_val = allSubtasks.rows;

        //TODO OCCURANCE RATE

        // const countTasks=await pool.query(
        //     "SELECT tsk_id,COUNT(tsk_id) FROM time_log_t GROUP BY tsk_id"
        // );
        // const countTasks = allTasks_val.map(tsk => {
        //     var countTask=await pool.query(
        //         "SELECT COUNT(*) FROM time_log_t WHERE tsk_id = $1", [tsk.tsk_id]
        //     );
        //     const countSubtasks = allSubtasks_val.map(st => {
        //         var countSubtask=await pool.query(
        //             "SELECT COUNT(*) FROM tl_st_relation_t WHERE st_id = $1 AND ", [st.st_id]
        //         );
        //         return countSubtask.rows[0];
        //     })
        //     return countTask.rows[0];
        // })



        const allFullTasks = await addSubtaskToTask(allTasks_val, allSubtasks_val);
        res.json(allFullTasks)
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }

    //To put all matching subtask into task to form full task
    async function addSubtaskToTask(allTasks, allSubtasks) {
        var allFullTasks = [];
        for (var task of allTasks) {
            task.subtask = [];
            for (var subtask of allSubtasks) {
                if (task.tsk_id === subtask.tsk_id) {
                    task.subtask.push(subtask);
                }
            }
            //console.log(allFullTasks);
            allFullTasks.push(task);
        }
        return allFullTasks;
    }
});



//Get a task and its subtasks
router.get('/:tsk_id', authorize,async (req, res) => {
    try {
        const user_id = req.header("user_id");
        const { tsk_id } = req.params;
        const task = await pool.query("SELECT * FROM task_t WHERE tsk_id = $1 AND user_id = $2", [tsk_id,user_id]);
        const subtasks = await pool.query(
            "SELECT * FROM subtask_t WHERE tsk_id = $1 AND user_id = $2;", [tsk_id,user_id]
        );
        //res.json(task.rows[0]);
        var fulltask = task.rows[0];
        fulltask.subtask = subtasks.rows;
        res.json(fulltask);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});
//Get a subtask
router.get('/:tsk_id/:st_id',authorize, async (req, res) => {
    try {
        const { tsk_id, st_id } = req.params;
        const subtask = await pool.query(
            "SELECT * FROM subtask_t WHERE st_id=$1;", [st_id]
        );
        res.json(subtask.rows);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
})

//Update a task
router.put('/:tsk_id', authorize, async (req, res) => {
    try {
        
        const { tsk_id } = req.params;
        const { tsk_name, tsk_est_min, tsk_todo } = req.body;
        const updateTask = await pool.query("UPDATE task_t SET tsk_name=$1,tsk_est_min=$2,tsk_todo=$3 WHERE tsk_id=$4;", [tsk_name, tsk_est_min, tsk_todo, tsk_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Update a subtask
router.put('/:tsk_id/:st_id', authorize,async (req, res) => {
    try {
        const { tsk_id, st_id } = req.params;
        const { st_name } = req.body;
        const updateSubtask = await pool.query("UPDATE subtask_t SET st_name=$1 WHERE st_id=$2;", [st_name, st_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Delete a task and its subtasks
router.delete('/:tsk_id', authorize,async (req, res) => {
    try {
        const { tsk_id } = req.params;
        // const deleteSubtask = await pool.query(
        //     "DELETE FROM subtask_t WHERE tsk_id=$1;", [tsk_id]);
        const deleteTask = await pool.query(
            "DELETE FROM task_t WHERE tsk_id=$1;", [tsk_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});
//Delete a subtask
router.delete('/:tsk_id/:st_id', authorize, async (req, res) => {
    try {
        const { tsk_id, st_id } = req.params;
        const deleteSubtask = await pool.query("DELETE FROM subtask_t WHERE st_id=$1;", [st_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

module.exports = router;