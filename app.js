"use strict";
var rp = require("request-promise");
const express = require("express");
const cheerio = require("cheerio");
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;
const pool = require("./db");

app.use(express.json());
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(__dirname + '/dist'));
}

//register and login routes
app.use("/auth",require("./routes/jwtAuth"))
app.use("/dashboard", require("./routes/dashboard"));


app.use(express.static('dist'));
// app.get('', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'calendar.html'));
// });


// app.get('/calendar', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'calendar.html'));
// });

// app.get('/task', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'task.html'));
// });
// app.get('/timelog', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'timelog.html'));
// });

// app.get('/chart', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'chart.html'));
// });

// app.get('/revision', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'revision.html'));
// });

// app.get('/welcome', (req, res) => {
//     res.sendFile(path.resolve(__dirname + '/dist', 'welcome.html'));
// });


app.get('/api/apuCourse', async (req, res) => {

    try {
        // console.log(req.body);
        const ce = await pool.query(
            "SELECT ce.ce_id AS id, TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MI:SS') AS start, TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MI:SS') AS end,ce.ce_title AS title,c.cou_lecturer AS lecturer,ce.ce_week AS week, ce.ce_location AS location,ce.ce_desc AS description,ce.ce_type AS course_type, ce.cou_code AS course_code FROM CLASS_EVENT_T AS ce, COURSE_T AS c WHERE c.cou_code=ce.cou_code;");
        res.send(ce.rows);
    } catch (err) {
        console.error(err.message);
    }
});
app.post('/api/apuCourse/:urlDate', (req, res) => {
    var table = [];
    var ce = [];
    var urlDate = req.params.urlDate;
    rp({
        url: `https://api.apiit.edu.my/timetable-print/index.php?Week=${urlDate}&Intake=APU2F2106CS(DA)&Intake_Group=G1&print_request=print_tt`,
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36' },
        json: true,
    })
        .then(html => {
            // console.log(html);
            let $ = cheerio.load(html);
            // find what element ids, classes, or tags you want from opening console in the browser
            // cheerio library lets you select elements similar to querySelector
            $('td').each(function (i, element) {
                table[i] = $(this).text();
            });


            for (let j = 0; j < table.length / 6; j++) {
                //date
                var tableDate = table[j * 6].split(/, |-/);
                var tableTime = table[(j * 6) + 1].split(" - ");
                //console.log(tableTime);
                var tableSubject = table[(j * 6) + 4].split("-");
                var tableMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
                var typeShort = ['L', 'L T', 'LAB', 'T'];
                var typeCorrect = ['LEC', 'L/T', 'LAB', 'TUT'];

                for (let k = 0; k < tableMonth.length; k++) {
                    if (tableDate[2] === tableMonth[k]) {
                        tableDate[2] = tableMonth.indexOf(tableMonth[k]) + 1;
                    }
                }
                for (let k = 0; k < typeShort.length + 1; k++) {
                    if (tableSubject[tableSubject.length - 2] === typeShort[k]) {
                        tableSubject[tableSubject.length - 2] = typeCorrect[k];
                        break;
                    }
                    else if (k === typeShort.length) {
                        tableSubject[tableSubject.length - 2] = 'OTH';
                    }
                }
                // if (tableSubject[tableSubject.length - 3] === "N/A")
                //     continue;

                if (tableDate[2] < 10) {
                    tableDate[2] = '0' + tableDate[2];
                }

                let class_event = {
                    type: tableSubject[tableSubject.length - 2],
                    start: tableDate[3] + '-' + tableDate[2] + '-' + tableDate[1] + ' ' + tableTime[0] + ':00',
                    end: tableDate[3] + '-' + tableDate[2] + '-' + tableDate[1] + ' ' + tableTime[1] + ':00',
                    location: table[(j * 6) + 2],
                    week: urlDate,
                    cou_code: tableSubject[tableSubject.length - 3]
                }
                // if (class_event.cou_code === '2 PSMOD') class_event.cou_code = 'PSMOD';
                //console.log(class_event);
                var subjectShort = ['DMPM', 'CCP', 'EET', 'RMCT', 'CRI', 'DSTR', 'BIS'];//Modify each semester
                for (let k = 0; k < subjectShort.length + 1; k++) {
                    if ((class_event.cou_code).indexOf(subjectShort[k]) !== -1) {
                        //console.log(class_event);
                        ce.push(class_event);

                    }
                }

            }
            return ce;
        })
        .then(ce => { ce.map(e => insertCE(e)); res.sendStatus(500); })
        .then(updateCETitle)
        .catch(function (err) {
            console.error(err.message + ' ' + urlDate);
        });
}

);
async function insertCE(ce) {
    try {
        await pool.query(
            "INSERT INTO CLASS_EVENT_T (ce_type,ce_start,ce_end,ce_location,ce_week,cou_code) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (ce_type,cou_code,ce_week) DO UPDATE SET ce_type=EXCLUDED.ce_type, ce_start=EXCLUDED.ce_start, ce_end=EXCLUDED.ce_end, ce_location=EXCLUDED.ce_location, ce_week=EXCLUDED.ce_week, cou_code=EXCLUDED.cou_code;",
            [ce.type, ce.start, ce.end, ce.location, ce.week, ce.cou_code]);

        //console.log(`Success ${ce.cou_code} ${ce.type} ${ce.week}`);
    } catch (err) {
        console.error(err.message + ' on insert ' + ce.cou_code + ce.type + ce.start + ce.end + ce.week);
    }
}
async function updateCETitle() {
    try {
        await pool.query(
            "UPDATE CLASS_EVENT_T SET ce_title=CONCAT(c.cou_name,' ',ce_type) FROM COURSE_T c WHERE CLASS_EVENT_T.cou_code = c.cou_code;");
        //console.log(`Success ${ce.cou_code} ${ce.type} ${ce.week}`);
    } catch (err) {
        console.error(err.message + ' on update ' + ce.cou_code + ce.type + ce.start + ce.end + ce.week);
    }
}



//Task
//Create a task
app.post('/api/task', async (req, res) => {

    try {
        const { tsk_name, tsk_est_min, tsk_todo } = req.body;
        const newTask = await pool.query(
            "INSERT INTO task_t (tsk_name,tsk_est_min,tsk_todo) VALUES ($1,$2,$3)", [tsk_name, tsk_est_min, tsk_todo]
        );
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});
//Create a subtask
app.post('/api/task/:tsk_id', async (req, res) => {

    try {
        const { tsk_id } = req.params;
        const { st_name } = req.body;
        const newTask = await pool.query(
            "INSERT INTO subtask_t (st_name,tsk_id) VALUES ($1,$2)", [st_name, tsk_id]
        );
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

//Get all tasks and subtasks with their occurance rate
app.get('/api/task', async (req, res) => {
    try {
        const allTasks = await pool.query(
            "SELECT * FROM task_t;"
        );
        const allSubtasks = await pool.query(
            "SELECT * FROM subtask_t;"
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
app.get('/api/task/:tsk_id', async (req, res) => {
    try {
        const { tsk_id } = req.params;
        const task = await pool.query("SELECT * FROM task_t WHERE tsk_id = $1", [tsk_id]);
        const subtasks = await pool.query(
            "SELECT * FROM subtask_t WHERE tsk_id = $1;", [tsk_id]
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
app.get('/api/task/:tsk_id/:st_id', async (req, res) => {
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
app.put('/api/task/:tsk_id', async (req, res) => {
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
app.put('/api/task/:tsk_id/:st_id', async (req, res) => {
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
app.delete('/api/task/:tsk_id', async (req, res) => {
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
app.delete('/api/task/:tsk_id/:st_id', async (req, res) => {
    try {
        const { tsk_id, st_id } = req.params;
        const deleteSubtask = await pool.query("DELETE FROM subtask_t WHERE st_id=$1;", [st_id]);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Create a timelog
app.post('/api/timelog', async (req, res) => {
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
        res.send('/timelog.html');
    } catch (err) {
        console.error(err.message);
        res.sendStatus(500);
    }
});

//Get all timelog and their subtask
app.get('/api/timelog', async (req, res) => {
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
app.get('/api/timelog/:tl_id', async (req, res) => {
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
app.put('/api/timelog/:tl_id', async (req, res) => {
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
        res.send('/timelog.html');
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Delete a timelog
app.delete('/api/timelog/:tl_id', async (req, res) => {
    try {
        const { tl_id } = req.params;

        const deleteTimeLog = await pool.query(
            "DELETE FROM time_log_t WHERE tl_id=$1;", [tl_id]);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});


app.get("*",(req,res)=>{
    res.sendFile(path.resolve(__dirname + '/dist', 'calendar.html'));
});

// app.route('/*')
//     .get(function (req, res) {
//         res.sendFile(path.resolve(__dirname + '/dist', 'calendar.html'));
//     });
app.listen(PORT, () => console.log(`Example app listening on port ${PORT}!`));