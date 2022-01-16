const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const pool = require("../db");
var rp = require("request-promise");
const authorize = require("../middleware/authorize");


router.get('/', async (req, res) => {
    try {
        const user_id = req.query.user_id;
        const findSchool = await pool.query(
            "SELECT opt_school FROM OPTION_T WHERE user_id=$1;",
            [user_id]
        );

        const school = await findSchool.rows[0].opt_school;
        switch (school) {
            case 'APU':
                res.send(await getAPUTimetable(school));
                break;
            default:
                const timetable=await getCE(school)
                res.send(timetable.rows);
        }
    } catch (err) {
        console.log(err.message);
    }

}

);

// router.post('/taruc', async (req, res) => {
//     try {
//         const timetable = req.body;
//         await insertTARUCTimetable(timetable);
//         res.sendStatus(200);
//     } catch (err) {
//         console.log(err.message);
//     }
// }

// );

function getAPUTimetable(school) {
    return rp({
        url: "https://s3-ap-southeast-1.amazonaws.com/open-ws/weektimetable",

        headers: { "Content-type": "application/json; charset=UTF-8", 'User-Agent': 'Mozilla/5.0 (Windows NT 6.3; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.111 Safari/537.36' },
        json: false,
        gzip: true
    })
        .then(xml => {
            var ce = [];

            const json = JSON.parse(xml).filter((j) => { return j.INTAKE === "APU2F2106CS(DA)" && j.MODULE_NAME !== "Bahasa Melayu Komunikasi 2" && j.MODULE_NAME !== "Islamic Civilisation & Asian Civilisation" });
            //     let $ = cheerio.load(html);
            //     // find what element ids, classes, or tags you want from opening console in the browser
            //     // cheerio library lets you select elements similar to querySelector
            //     $('td').each(function (i, element) {
            //         table[i] = $(this).text();
            //         console.log(table[i]);
            //     });


            for (var j of json) {
                var tableSubject = j.MODID.split("-");
                var typeShort = ['L', 'L T', 'LAB', 'T'];
                var typeCorrect = ['LEC', 'L/T', 'LAB', 'TUT'];

                for (let k = 0; k < typeShort.length + 1; k++) {
                    if (tableSubject[tableSubject.length - 2] === typeShort[k]) {
                        tableSubject[tableSubject.length - 2] = typeCorrect[k];
                        break;
                    }
                    else if (k === typeShort.length) {
                        tableSubject[tableSubject.length - 2] = 'OTH';
                    }
                }

                var monday = new Date(j.DATESTAMP_ISO);
                let day = monday.getDay();
                if (day !== 1)
                    monday.setHours(-24 * (day - 1));
                monday.toISOString().slice(0, 10);
                var urlMonth = String(monday.getMonth() + 1).padStart(2, '0');
                var urlDay = String(monday.getDate()).padStart(2, '0');
                var urlYear = monday.getFullYear();
                var urlDate = urlYear + '-' + urlMonth + '-' + urlDay;

                let class_event = {
                    type: tableSubject[tableSubject.length - 2],
                    start: j.TIME_FROM_ISO,
                    end: j.TIME_TO_ISO,
                    location: j.ROOM,
                    week: urlDate,
                    cou_code: tableSubject[tableSubject.length - 3]
                }
                // if (class_event.cou_code === '2 PSMOD') class_event.cou_code = 'PSMOD';
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
        .then(ce => { ce.map(e => insertCE(e)); })
        .then(updateCETitle)
        .then(() => {
            return getCE(school);
        })
        .then((ces) => {
            return ces.rows;
        })
        .catch(function (err) {
            console.error(err.message);
        });

}

async function insertTARUCTimetable(timetable) {
    try {
        console.log(timetable);
        for (var course of timetable.courses) {
            console.log(course);
            await pool.query(
                "INSERT INTO COURSE_T (cou_code,cou_name,cou_lecturer,cou_academic_year,cou_academic_semester,cou_school) VALUES($1,$2,$3,$4,$5,$6);",
                [course.cou_code, course.cou_name, course.cou_lecturer, timetable.cou_academic_year, timetable.cou_academic_semester, timetable.cou_school]
            );
        }
        for (var week=0; week < timetable.week; week++) {
            for (var ce of timetable.classes) {
                var newStart = new Date(new Date(ce.start).getTime() + 604800000 * week);//+7 days in milliseconds
                var newEnd = new Date(new Date(ce.end).getTime() + 604800000 * week);//+7 days in milliseconds
                console.log(ce,newStart,newEnd);
                await pool.query(
                    "INSERT INTO CLASS_EVENT_T (ce_type,ce_start,ce_end,ce_location,ce_week,cou_code) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (ce_type,cou_code,ce_week) DO UPDATE SET ce_type=EXCLUDED.ce_type, ce_start=EXCLUDED.ce_start, ce_end=EXCLUDED.ce_end, ce_location=EXCLUDED.ce_location, ce_week=EXCLUDED.ce_week, cou_code=EXCLUDED.cou_code;",
                    [ce.type, newStart, newEnd, ce.location, week + 1, ce.cou_code]
                );
            }

        }
    } catch (err) {
        console.error(err.message + ' on insert '+ ce);
    }
}

//TODO Conflicts between different school on COU_CODE
async function insertCE(ce) {
    try {
        const checkReplacement = await pool.query(
            "SELECT * FROM CLASS_EVENT_T WHERE ce_type=$1 AND cou_code=$2 AND ce_week=$3 AND ce_replacement=true;",
            [ce.type, ce.cou_code, ce.week]);
        if (checkReplacement.rows.length > 0) return;
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
async function getCE(school) {
    try {
        return await pool.query(
            "SELECT ce.ce_id AS id, TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MI:SS') AS start, TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MI:SS') AS end,ce.ce_title AS title,c.cou_lecturer AS lecturer,ce.ce_week AS week, ce.ce_location AS location,ce.ce_desc AS description,ce.ce_type AS course_type, ce.cou_code AS course_code FROM CLASS_EVENT_T AS ce, COURSE_T AS c WHERE c.cou_code=ce.cou_code AND c.cou_school=$1;",
            [school]);
    } catch (err) {
        console.error(err.message + ' on update ' + ce.cou_code + ce.type + ce.start + ce.end + ce.week);
    }
}

//Update a course event
router.put('/:ce_id', authorize, async (req, res) => {
    try {
        const { ce_id } = req.params;
        const { ce_start, ce_end, ce_desc, ce_location } = req.body;
        // console.log(req.body);
        const updateClassEvent = await pool.query(
            "UPDATE CLASS_EVENT_T SET ce_start=$1,ce_end=$2,ce_desc=$3,ce_location=$4, ce_replacement=$5 WHERE ce_id=$6;", [ce_start, ce_end, ce_desc, ce_location, "t", ce_id]
        );
        // console.log(updateClassEvent);
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});

//Create a course event
router.post('/', async (req, res) => {
    try {
        const { ce } = req.body;
        // console.log(req.body);
        const updateClassEvent = await pool.query(
            "INSERT INTO CLASS_EVENT_T (ce_type,ce_start,ce_end,ce_location,ce_week,cou_code) VALUES($1,$2,$3,$4,$5,$6) ON CONFLICT (ce_type,cou_code,ce_week) DO UPDATE SET ce_type=EXCLUDED.ce_type, ce_start=EXCLUDED.ce_start, ce_end=EXCLUDED.ce_end, ce_location=EXCLUDED.ce_location, ce_week=EXCLUDED.ce_week, cou_code=EXCLUDED.cou_code;",
            [ce.type, ce.start, ce.end, ce.location, ce.week, ce.cou_code]);
        await updateCETitle();
        res.sendStatus(200);
    } catch (err) {
        console.log(err.message);
        res.sendStatus(500);
    }
});
module.exports = router;