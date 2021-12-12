import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify";
import BootstrapTable from 'react-bootstrap-table-next';
import axios from 'axios';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { NewEventModal } from './NewEventModal';
import { ConfirmationModal } from './ConfirmationModal';
//import { GoogleAuth } from '../access/GoogleAuth'
export const NotionBoard = ({ refetchCal }) => {
    const [list, setList] = useState([]);
    const [schedule, setSchedule] = useState();
    const [confirm, setConfirm] = useState();

    // const [googleLogin, setGoogleLogin] = useState(false);

    useEffect(() => {
        const getList = async () => {
            try {
                const response = await axios.get(`/api/dashboard/notion`, { headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken } });
                const data = await response?.data;
                setList(data);

            } catch (err) {
                console.log(err.message);
            }
        };
        getList();
    }, []);
    // useEffect(() => {
    //     const sendEvent = async () => {
    //         try {
    //             if (!event || googleLogin) return;
    //             const response = await axios.post('/auth/google/event', event)
    //             const status = await response?.status;

    //             if (status === 200) {
    //                 setEvent();
    //                 toast.success("Event successfully added!")
    //                 refetchCal();

    //             }

    //         } catch (err) {
    //             console.log(err);
    //             setGoogleLogin(true);
    //         }
    //     };
    //     sendEvent();
    // }, [event]);

    // useEffect(() => {
    //     const verifyGoogle = async () => {
    //         try {
    //             if (!schedule) return;
    //             const response = await axios.get('/auth/google/verify')
    //             const status = await response?.status;
    //             console.log(response);
    //             if (status === 200) {
    //                 return;
    //             }
    //             else {
    //                 setGoogleLogin(true);
    //             }

    //         } catch (err) {
    //             console.log(err);
    //             setGoogleLogin(true);
    //         }
    //     };
    //     verifyGoogle();
    // }, [schedule]);

    const rowStyle = (row, rowIndex) => {
        if (!row.properties.Priority.select) return { color: 'rgb(27,162,246)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
        const priority = row.properties.Priority.select.name
        if (priority === "High") return { color: 'rgb(228,76,85)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
        if (priority === "Medium") return { color: 'rgb(255,193,7)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
        if (priority === "Low") return { color: 'rgb(68,217,232)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
    }

    const handleComplete = (id) => {
        try {
            console.log(id)
            const body = { id };
            const response = fetch("/api/dashboard/notion", {
                method: "PUT",
                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
                body: JSON.stringify(body)
            });
            toast.success("Congratulations in completing task :D");
            setList(list.filter((l) => { return l.id !== id }));
            console.log(list);
        } catch (err) {
            console.log(err.message);
        }
    }
    const buttonFormatter = (cell, row, rowIndex) => {
        const title = row.properties.Name.title[0].plain_text;
        const subject = row.properties.Subject.select ? row.properties.Subject.select.name : "";
        return (
            <>
                <Button variant="success" onClick={() => { setConfirm([title, cell]) }}><FontAwesomeIcon icon={faCheck} /></Button>
                <Button variant="info" onClick={() => { setSchedule({ title: title, subject: subject, desc: "", start: new Date(), end: new Date() }) }}><FontAwesomeIcon icon={faClock} /></Button>
            </>
        )
    }

    const columns = [
        {
            dataField: "id",
            text: "ID",
            hidden: true
        },
        {
            dataField: "properties.Priority.select.name",
            text: "Priority",
            hidden: true,
            sort: true
        },
        {
            dataField: "properties.Name.title[0].plain_text",
            text: "Title",
            sort: true,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))', width: "40%" }
        },
        {
            dataField: "properties.Subject.select.name",
            text: "Subject",
            sort: true,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))', width: "20%" }

        },
        {
            dataField: "properties.Status.select.name",
            text: "Status",
            sort: true,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))', width: "20%" }

        },
        {
            dataField: "id",
            text: "",
            formatter: buttonFormatter,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))', width: "20%" }

        }
    ];

    return (
        <>
            <BootstrapTable
                keyField="id"
                data={list}
                columns={columns}
                rowStyle={rowStyle}
                tabIndexCell={true}
            />
            {
                schedule &&
                < NewEventModal
                    onClose={() => { setSchedule(null); }}
                    onSave={async(we_title, we_desc, we_subject, we_start, we_end) => {
                        try {
                            const body = { we_title, we_desc, we_subject, we_start, we_end };
                            const response = fetch(`/api/notionLog`, {
                                method: "POST",
                                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
                                body: JSON.stringify(body)
                            });
                            const status = await response?.status;
                            if (status === 200) {
                                toast.success("Event successfully added!")
                                refetchCal();
                            }
                            setSchedule(null);
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}

                    schedule={schedule}
                />
            }
            {/* {
                schedule &&
                googleLogin &&
                <GoogleAuth />
            } */}
            {
                confirm &&
                <ConfirmationModal
                    targetName={confirm[0]}
                    onCancel={() => setConfirm(null)}
                    onConfirm={() => {
                        handleComplete(confirm[1]);
                        setConfirm(null);
                    }} />
            }
        </>

    );

};