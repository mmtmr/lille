-- CREATE DATABASE lille;
-- CREATE DATABASE lille;

-- CREATE TABLE COURSE_T(
--     cou_code VARCHAR(5) NOT NULL,
--     cou_name VARCHAR(50) NOT NULL,
--     cou_lecturer VARCHAR(50) NOT NULL,
--     cou_academic_year INT NOT NULL,
--     cou_academic_semester INT NOT NULL,
--      intake_group_code VARCHAR(25) NOT NULL,
--     PRIMARY KEY (cou_code, intake_group_code)
-- );

-- CREATE TABLE WORK_T(
--     wrk_id SERIAL PRIMARY KEY,
--     wrk_title VARCHAR(100),
--     wrk_start TIMESTAMP NOT NULL,
--     wrk_end TIMESTAMP NOT NULL,
--     wrk_desc VARCHAR(200),
--     cou_code VARCHAR(5),
--     FOREIGN KEY (cou_code) REFERENCES COURSE_T(cou_code)
-- );

-- CREATE TABLE CLASS_EVENT_T(
--     ce_id SERIAL PRIMARY KEY,
--     ce_type CHAR(3) NOT NULL,
--     ce_title VARCHAR(100) NULL,
--     ce_start TIMESTAMP NOT NULL,
--     ce_end TIMESTAMP NOT NULL,
--     ce_desc VARCHAR(200),
--     ce_location VARCHAR(50) NOT NULL,
--     ce_replacement BOOLEAN NOT NULL DEFAULT FALSE,
--     ce_week CHAR(10) NOT NULL,
--     cou_code VARCHAR(5) NOT NULL,
--     intake_group_code VARCHAR(25) NOT NULL,
--     FOREIGN KEY (cou_code,intake_group_code) REFERENCES COURSE_T(cou_code,intake_group_code)
--     CONSTRAINT UQ_CLASS_EVENT_T UNIQUE(ce_type, cou_code, ce_week)
-- );

-- INSERT INTO COURSE_T
-- VALUES ('SDM','System Development Methods','SIVANANTHAN A/L CHELLIAH',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('PSMOD','Probability and Statistical Modelling','LOW KOK SUN',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('PFDA','Programming for Data Analysis','MINNU HELEN JOSEPH',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('DTM','Data Management','DR. SHUBASHINI A/P RATHINA VELU ',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('OODJ','Object Oriented Development with Java','DR. KADHAR BATCHA NOWSHATH',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('COMT','Computing Theory','DR BOOMA POOLAN MARIKANNAN',2,1);

-- INSERT INTO COURSE_T
-- VALUES ('WPCS','Workplace Professional Communication Skills','VICKNISHA A/P BALU',2,1);

/*
TEST
INSERT INTO CLASS_EVENT_T (ce_type,ce_start,ce_end,ce_location,ce_week,cou_code)
            VALUES('LAB','2021-06-27 18:00:00','2021-06-27 20:00:00','Online','2021-06-27','PSMOD')
        ON CONFLICT (ce_type,cou_code)
        DO UPDATE SET 
            ce_type=EXCLUDED.ce_type,  ce_start=EXCLUDED.ce_start, ce_end=EXCLUDED.ce_end, ce_location=EXCLUDED.ce_location, cou_code=EXCLUDED.cou_code;
*/

-- DROP TABLE COURSEWORK_T;
-- DROP TABLE CLASS_EVENT_T;
-- DROP TABLE COURSE_T;

-- INSERT INTO CLASS_EVENT_T (ce_type,ce_date,ce_statl_time,ce_end_time,ce_location,ce_week,cou_code) VALUES($1,$2,$3,$4,$5,$6,$7) ON CONFLICT (ce_type,cou_code,ce_week) DO UPDATE SET ce_type=EXCLUDED.ce_type, ce_date=EXCLUDED.ce_date, ce_statl_time=EXCLUDED.ce_statl_time, ce_end_time=EXCLUDED.ce_end_time, ce_location=EXCLUDED.ce_location, ce_week=EXCLUDED.ce_week, cou_code=EXCLUDED.cou_code;

-- SELECT json_build_object('id',ce.ce_id,'start',TO_CHAR(ce.ce_start,'YYYY-MM-DD"T"HH24:MM:SS'),'end',TO_CHAR(ce.ce_end,'YYYY-MM-DD"T"HH24:MM:SS'),'title',ce.ce_title,extendedProps,json_build_object('lecturer',c.cou_lecturer,'week',ce.ce_week,'location',ce.ce_location,'description',ce.ce_desc)) FROM CLASS_EVENT_T INNER JOIN COURSE_T c ON c.cou_code=ce.cou_code;

-- "SELECT json_build_object('id',ce.ce_id,'start',TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MM:SS'),'end',TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MM:SS'),'title',ce.ce_title,'extendedProps',json_build_object('lecturer',c.cou_lecturer,'week',ce.ce_week,'location',ce.ce_location,'description',ce.ce_desc)) AS event FROM CLASS_EVENT_T ce INNER JOIN COURSE_T c ON c.cou_code=ce.cou_code;"

-- SELECT ce.ce_id AS 'id',TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MM:SS') AS 'start', TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MM:SS') AS 'end',ce.ce_title AS 'title',c.cou_lecturer AS 'lecturer',ce.ce_week AS 'week', ce.ce_location AS'location',ce.ce_desc AS 'description' FROM CLASS_EVENT_T ce INNER JOIN COURSE_T c ON c.cou_code=ce.cou_code
-- SELECT ce.ce_id AS id, TO_CHAR(ce.ce_start,'YYYY-MM-DD\"T\"HH24:MI:SS') AS start, TO_CHAR(ce.ce_end,'YYYY-MM-DD\"T\"HH24:MI:SS') AS end,ce.ce_title AS title,c.cou_lecturer AS lecturer,ce.ce_week AS week, ce.ce_location AS location,ce.ce_desc AS description FROM CLASS_EVENT_T AS ce, COURSE_T AS c WHERE c.cou_code=ce.cou_code;



CREATE TABLE TASK_T(
    tsk_id SERIAL PRIMARY KEY,
    tsk_name VARCHAR(100) NOT NULL,
    tsk_est_min INT NOT NULL,
    tsk_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tsk_archive BOOLEAN DEFAULT FALSE,
    tsk_todo BOOLEAN DEFAULT FALSE
);

CREATE TABLE SUBTASK_T(
    st_id SERIAL PRIMARY KEY,
    st_name VARCHAR(100) NOT NULL,
    tsk_id INT NOT NULL,
    st_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (tsk_id) REFERENCES TASK_T(tsk_id) ON UPDATE CASCADE ON DELETE CASCADE
);

CREATE TABLE TIME_LOG_T(
    tl_id SERIAL PRIMARY KEY,
    tl_date DATE NOT NULL,
    tl_standby_min INT NOT NULL,
    tl_real_min INT NOT NULL,
    tl_created TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    tsk_id INT NOT NULL,
    FOREIGN KEY (tsk_id) REFERENCES TASK_T(tsk_id) ON UPDATE CASCADE ON DELETE CASCADE
);


CREATE TABLE TL_ST_RELATION_T(
    tl_id INT REFERENCES TIME_LOG_T(tl_id) ON UPDATE CASCADE ON DELETE CASCADE,
    st_id INT REFERENCES SUBTASK_T(st_id),
    CONSTRAINT tsr_id PRIMARY KEY (tl_id, st_id)
);

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE TABLE USER_T(
    user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_name VARCHAR(255) NOT NULL,
    user_email VARCHAR(255) NOT NULL,
    user_password VARCHAR(255) NOT NULL
);

-- INSERT INTO COURSE_T
-- VALUES ('DMPM','Data Mining and Predictive Modeling','DR. PREETHI SUBRAMANIAN',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('CCP','Concurrent Programming','ZAILAN ARABEE BIN ABDUL SALAM',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('EET','Employee & Employment Trends','HALIMATON BINTI YUSOF',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('RMCT','Research Methods for Computing and Technology','TAN CHYE CHEAH ',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('CRI','Creativity & Innovation','HASLINA HASHIM',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('DSTR','Data Structures','CHONG MIEN MAY',2,2);

-- INSERT INTO COURSE_T
-- VALUES ('BIS','Business Intelligence Systems','MOHAMMAD NAMAZEE BIN MOHD NIZAM',2,2);