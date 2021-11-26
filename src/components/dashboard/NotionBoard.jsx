import React, {useState, useEffect} from 'react';
import Button from 'react-bootstrap/Button'
import { toast } from "react-toastify";
import BootstrapTable from 'react-bootstrap-table-next';
import { useFetch } from '../../hooks/useFetch';
import axios from 'axios';
import 'react-tiny-fab/dist/styles.css';
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { faClock } from "@fortawesome/free-solid-svg-icons";
import { compareByFieldSpecs } from '@fullcalendar/common';

export const NotionBoard = () => {

    const [list, setList] = useState([]);
    const [schedule, setSchedule] = useState();

    useEffect(() => {
        const getList = async () => {
            try {
                const response = await axios.get(`/api/dashboard/notion`);
                const data = await response?.data;
                setList(data);

            } catch (err) {
                console.log(err.message);
            }
        };
        getList();
    }, []);

    const rowStyle = (row, rowIndex) => {
        if (!row.properties.Priority.select) return { color: 'rgb(27,162,246)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
        const priority = row.properties.Priority.select.name
        if (priority === "High") return { color: 'rgb(228,76,85)', backgroundColor: 'rgba(26, 9, 51,0.3)'}
        if (priority === "Medium") return { color: 'rgb(255,193,7)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
        if (priority === "Low") return {  color: 'rgb(68,217,232)', backgroundColor: 'rgba(26, 9, 51,0.3)' }
    }

    const handleComplete = (id) => {
        try {
            console.log(id)
            const body = { id };
            const response = fetch("/api/dashboard/notion", {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(body)
            });
            toast.success("Congratulations in completing task :D");
            setList(list.filter((l)=>{return l.id!==id} ));
            console.log(list);
        } catch (err) {
            console.log(err.message);
        }
    }
    const buttonFormatter = (cell, row, rowIndex) => {
        const title=row.properties.Name.title[0].plain_text;
        return (
            <>
                <Button variant="success" onClick={() => {handleComplete(cell)}}><FontAwesomeIcon icon={faCheck} /></Button>
                <Button variant="info" onClick={() => {setSchedule(title)}}><FontAwesomeIcon icon={faClock} /></Button>
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
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))' }
        },
        {
            dataField: "properties.Subject.select.name",
            text: "Subject",
            sort: true,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))' }

        },
        {
            dataField: "properties.Status.select.name",
            text: "Status",
            sort: true,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))' }

        },
        {
            dataField:"id",
            text:"",
            formatter:buttonFormatter,
            headerStyle: { backgroundColor: 'var(--fc-neutral-bg-color, rgba(208, 208, 208, 0.3))' }

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
        </>

    );

};