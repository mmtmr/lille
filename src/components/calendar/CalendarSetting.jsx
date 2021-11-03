import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { useFetch } from '../../hooks/useFetch';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock, faEdit } from "@fortawesome/free-solid-svg-icons";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";

export const CalendarSetting = () => {
    const [googleCalendar, setGoogleCalendar] = useState(false);
    const [apuSchedule, setApuSchedule] = useState(false);
    const [icsCalendar, setIcsCalendar] = useState(false);

    const [log, setLog] = useState([]);
    const task = useFetch("/api/task");

    useEffect(() => {
        const getTimeLog = async () => {
            try {
                const response = await axios.get(`/api/timelog`);
                const data = await response?.data;
                setLog(data);

            } catch (err) {
                console.log(err.message);
            }
        };
        getTimeLog();
    }, []);

    return (
        <>
            {
                !googleCalendar && !apuSchedule && !icsCalendar &&
                <Fab
                    position={{ bottom: 5, right: 5 }}
                    event="hover"
                    alwaysShowTitle={true}
                    mainButtonStyles={{
                        backgroundColor: "#00b5ad"
                    }}
                    icon={<FontAwesomeIcon icon={faEdit} />}
                >
                    {/* <Action
                        style={{
                            backgroundColor: "#8e44ad"
                        }}
                        text="APU Calendar"
                        onClick={() => setCreateLog(true)}
                    >
                        <FontAwesomeIcon icon={faClock} />
                    </Action> */}
                    <Action
                        style={{
                            backgroundColor: "#ea39b8"
                        }}
                        text="Google Calendar"
                        onClick={() => setGoogleCalendar(true)}
                    >
                        <FontAwesomeIcon icon={faGoogle} />
                    </Action>
                </Fab>
            }

            {
                googleCalendar &&
                <GoogleCalendarSetting
                    googleCalendar={null}
                    onSave={(apiKey,ids) => {
                        try {
                            const body = { apiKey,ids };
                            const response = fetch("/api/googleCalendar", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            });
                            setCreateLog(false);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    onClose={() => setCreateLog(false)}
                    task={task}
                />
            }
            {/*
                editLog &&
                <NewTimeLogModal
                    timeLogInfo={log.find(l => { return l.tl_id === editLog })}
                    onSave={(tsk_id, tl_date, tl_standby_min, tl_real_min, st_ids) => {
                        try {
                            const body = { tl_date, tl_standby_min, tl_real_min, tsk_id, st_ids };
                            const response = fetch(`/api/timelog/${editLog}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            }).then(setEditLog(false));
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    onClose={() => setEditLog(false)}
                    task={task}
                />
            } */}
        </>

    );

};