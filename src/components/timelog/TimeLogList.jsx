import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { NewTimeLogModal } from './NewTimeLogModal'
import { useFetch } from '../../hooks/useFetch';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClock } from "@fortawesome/free-solid-svg-icons";

export const TimeLogList = () => {
    const [createLog, setCreateLog] = useState();
    const [editLog, setEditLog] = useState();
    const [deleteLog, setDeleteLog] = useState();
    const [log, setLog] = useState([]);
    const task = useFetch("/api/task");

    useEffect(() => {
        const getTimeLog = async () => {
            try {
                const response = await axios.get(`/api/timelog`,{headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken }});
                const data = await response?.data;
                setLog(data);

            } catch (err) {
                console.log(err.message);
            }
        };
        getTimeLog();
    }, [, createLog, editLog, deleteLog]);

    const buttonFormatter = (cell, row, rowIndex) => {
        return (
            <>
                <Button variant="primary" onClick={() => { setEditLog(cell) }}>Modify</Button>
                <Button variant="danger" onClick={() => { setDeleteLog(cell) }}>Delete</Button>
            </>
        )
    }

    const dateFormatter = (cell, row, rowIndex) => {
        const realDate = new Date(cell).toLocaleDateString("en-MY");
        return realDate;
    }

    const defaultSorted = [{
        dataField: "tl_date",
        order: "desc"
    }];

    const columns = [
        {
            dataField: "tl_id",
            text: "ID",
            hidden: true
        },
        {
            dataField: "tl_date",
            text: "Date",
            sort: true,
            formatter: dateFormatter
        },
        {
            dataField: "task.tsk_name",
            text: "Name",
            sort: true
        },
        {
            dataField: "tl_standby_min",
            text: "Waiting Time"
        },
        {
            dataField: "tl_real_min",
            text: "Execution Time"
        },
        {
            dataField: "tl_id",
            text: "",
            formatter: buttonFormatter
        }
    ];

    return (
        <>
            <Container className="full-height">
                {
                    !editLog && !createLog && !deleteLog &&
                    <Fab
                        position={{ bottom: 5, right: 5 }}
                        event="hover"
                        alwaysShowTitle={true}
                        mainButtonStyles={{
                            backgroundColor: "#00b5ad"
                        }}
                        icon="+"
                    >
                        <Action
                            style={{
                                backgroundColor: "#8e44ad"
                            }}
                            onClick={() => setCreateLog(true)}
                        >
                            <FontAwesomeIcon icon={faClock} />
                        </Action>

                    </Fab>
                }
                <BootstrapTable
                    keyField="tl_id"
                    data={log}
                    columns={columns}
                    defaultSorted={defaultSorted}
                />
            </Container>
            {
                createLog &&
                <NewTimeLogModal
                    timeLogInfo={null}
                    onSave={(tsk_id, tl_date, tl_standby_min, tl_real_min, st_ids) => {
                        try {
                            const body = { tl_date, tl_standby_min, tl_real_min, tsk_id, st_ids };
                            const response = fetch("/api/timelog", {
                                method: "POST",
                                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
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
            {
                editLog &&
                <NewTimeLogModal
                    timeLogInfo={log.find(l => { return l.tl_id === editLog })}
                    onSave={(tsk_id, tl_date, tl_standby_min, tl_real_min, st_ids) => {
                        try {
                            const body = { tl_date, tl_standby_min, tl_real_min, tsk_id, st_ids };
                            const response = fetch(`/api/timelog/${editLog}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
                                body: JSON.stringify(body)
                            }).then(setEditLog(false));
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    onClose={() => setEditLog(false)}
                    task={task}
                />
            }
            {
                deleteLog &&
                < DeleteConfirmationModal
                    onCancel={() => setDeleteLog(null)}
                    onConfirm={() => {
                        const body = { deleteLog };
                        const response = fetch(`/api/timelog/${deleteLog}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
                            body: JSON.stringify(body)
                        });
                        setDeleteLog(null);
                    }}
                    targetName={null}
                />
            }
        </>

    );

};