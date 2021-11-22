const express = require("express");
const router = express.Router();
const cheerio = require("cheerio");
const pool = require("../db");
var rp = require("request-promise");

router.get('/', async (req, res) => {

    try {
        // console.log(req.body);
        const ce = await pool.query(
            "SELECT ce.ce_id AS id, TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MI:SS') AS start, TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MI:SS') AS end,ce.ce_title AS title,c.cou_lecturer AS lecturer,ce.ce_week AS week, ce.ce_location AS location,ce.ce_desc AS description,ce.ce_type AS course_type, ce.cou_code AS course_code FROM CLASS_EVENT_T AS ce, COURSE_T AS c WHERE c.cou_code=ce.cou_code;");
        res.send(ce.rows);
    } catch (err) {
        console.error(err.message);
    }
});
router.post('/:urlDate', (req, res) => {
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

module.exports = router;