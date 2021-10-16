import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import Collapse from 'react-bootstrap/Collapse'
import axios from 'axios';
import { NewTaskModal } from './NewTaskModal';
import { NewSubTaskModal } from './NewSubTaskModal';
import { DeleteConfirmationModal } from '../../other/DeleteConfirmationModal';

import 'bootswatch/dist/vapor/bootstrap.min.css'
import { useFetch } from './hooks/useFetch';

import '../task.css'
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTasks, faEye } from "@fortawesome/free-solid-svg-icons";



export const TaskList = () => {
    const [createTask, setCreateTask] = useState();
    const [createSubTask, setCreateSubTask] = useState();
    const [editTask, setEditTask] = useState();
    const [editSubTask, setEditSubTask] = useState();
    const [deleteTask, setDeleteTask] = useState();
    const [deleteSubTask, setDeleteSubTask] = useState();
    const [task, setTask] = useState([]);

    const [toggle, setToggle] = useState();
    //const data = [{ tsk_id: "001", tsk_name: "Shower", tsk_est_min: "20", last5average: "10", improvement: "5%", subtask: [{ st_id: "0001", st_name: "Exfoliate", occurance: "60%" }, { st_id: "0002", st_name: "Wash Hair", occurance: "40%" }] }, { tsk_id: "0002", tsk_name: "Night Routine", tsk_est_min: "15", last5average: "10", improvement: "7%", subtask: [{ st_id: "0003", tsk_name: "Brush Teeth", occurance: "100%" }, { st_id: "0004", tsk_name: "Skin Care", occurance: "100%" }] }];

    useEffect(() => {
        const getTimeLog = async () => {
            try {
                const response = await axios.get(`/api/task`);
                const data = await response?.data;
                setTask(data);

            } catch (err) {
                console.log(err.message);
            }
        };
        getTimeLog();
    }, [, createTask, createSubTask, editTask, editSubTask, deleteTask, deleteSubTask]);
    return (
        <>
        <Container className="full-height">
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
                    onClick={() => setCreateTask(true)}
                >
                    <FontAwesomeIcon icon={faTasks} />
                </Action>

            </Fab>

                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Task List</th>
                            <th class="text-center">Name</th>
                            <th class="text-center">Estimate Minutes</th>
                            {/* <th class="text-center">Average Minutes (Last 5)</th>
                            <th class="text-center">Improvement</th> */}
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {task.map((tsk, index) =>
                            <>

                                <tr>
                                    <td>
                                        <button
                                            className="btn btn-default btn-xs"
                                            onClick={() => setToggle(toggle === index ? null : index)}
                                            aria-controls={index}
                                            aria-expanded={toggle === index ? true : false}
                                        >
                                            <FontAwesomeIcon icon={faEye} />
                                        </button>

                                    </td>

                                    <td class="text-center">{tsk.tsk_name}</td>
                                    <td class="text-center">{tsk.tsk_est_min}</td>
                                    {/* <td class="text-center">{tsk.last5average}</td>
                                    <td class="text-center">{tsk.improvement}</td> */}
                                    <td class="text-center">
                                        <Button variant="success" onClick={() => { setCreateSubTask({ tsk_id: tsk.tsk_id, tsk_name: "" }) }}>Add</Button>
                                        <Button variant="primary" onClick={() => { setEditTask({ tsk_id: tsk.tsk_id, tsk_name: tsk.tsk_name, tsk_est_min: tsk.tsk_est_min }) }}>Modify</Button>
                                        <Button variant="danger" onClick={()=>setDeleteTask(tsk)}>Delete</Button>
                                    </td>


                                </tr>
                                <Collapse in={toggle === index ? true : false}>
                                    <tr>
                                        <td></td>
                                        <td colSpan="6">
                                            <table class="table table-striped">
                                                <thead>
                                                    <tr>
                                                        <th class="text-center">Subtask</th>
                                                        {/* <th class="text-center">Occurance Rate</th> */}
                                                    </tr>
                                                </thead>


                                                <tbody>
                                                    {tsk.subtask.map((st) =>
                                                        <Collapse in={toggle === index ? true : false}>
                                                            <tr>

                                                                <td class="text-center">{st.st_name}</td>
                                                                {/* <td class="text-center">{st.occurance}</td> */}
                                                                <td class="text-center">
                                                                    <Button variant="primary" onClick={() => { setEditSubTask(true); setSubTaskInfo({ tsk_id: st.tsk_id, st_id:st.st_id, st_name: st.st_name }); }}>Modify</Button>
                                                                    <Button variant="danger" onClick={()=>setDeleteSubTask(st)}>Delete</Button>
                                                                </td>
                                                            </tr>
                                                        </Collapse>
                                                    )}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                </Collapse>
                            </>


                        )}

                    </tbody>
                </table>

            </Container>
            {
                createTask &&
                < NewTaskModal
                    onClose={() => { setCreateTask(null);}}
                    onSave={(tsk_name, tsk_est_min) => {
                        try {
                            const body = { tsk_name, tsk_est_min };
                            const response = fetch("/api/task", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            });
                            setCreateTask(null);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    taskInfo={createTask}
                />
            }
            {
                editTask &&
                < NewTaskModal
                    onClose={() => { setEditTask(null);}}
                    onSave={(tsk_name, tsk_est_min) => {
                        try {
                            const tsk_id=editTask.tsk_id;
                            const body = { tsk_name, tsk_est_min };
                            const response = fetch(`/api/task/${tsk_id}`, {
                                method: "PUT",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            });
                            setEditTask(null);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    taskInfo={editTask}
                />

            }
            {
                deleteTask &&
                < DeleteConfirmationModal
                onCancel={() => setDeleteTask(null) }
                    onConfirm={() => {
                        const tsk_id=deleteTask.tsk_id;
                        const body = { tsk_id };
                        const response = fetch(`/api/task/${tsk_id}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });
                        setDeleteTask(null);
                    }}
                    targetName={deleteTask.tsk_name}
                />
            }
            {
                createSubTask &&
                < NewSubTaskModal
                    onClose={() => { setCreateSubTask(null); }}
                    onSave={(st_name) => {
                        try {
                            const tsk_id = editSubTask.tsk_id;
                            const body = { st_name };
                            const response = fetch(`/api/task/${tsk_id}`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify(body)
                            });
                            setCreateSubTask(null);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    subTaskInfo={createSubTask}
                />
            }
            {
                editSubTask &&
                < NewSubTaskModal
                    onClose={() => { setEditSubTask(null);}}
                    onSave={(st_name) => {
                        const tsk_id=editSubTask.tsk_id;
                        const st_id=editSubTask.st_id;
                        const body = { st_name };
                        const response = fetch(`/api/task/${tsk_id}/${st_id}`, {
                            method: "PUT",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });
                        setEditSubTask(null);
                    }}
                    subTaskInfo={editSubTask}
                />
            }
            {
                deleteSubTask &&
                < DeleteConfirmationModal
                    onCancel={() => setDeleteSubTask(null) }
                    onConfirm={() => {
                        const tsk_id=deleteSubTask.tsk_id;
                        const st_id=deleteSubTask.st_id;
                        const body = { st_id };
                        const response = fetch(`/api/task/${tsk_id}/${st_id}`, {
                            method: "DELETE",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify(body)
                        });
                        setDeleteSubTask(null);
                    }}
                    targetName={deleteSubTask.tsk_name}
                />
            }
            

        </>
    );

};