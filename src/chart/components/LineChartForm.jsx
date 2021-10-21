import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import Select from 'react-select';
import 'bootswatch/dist/vapor/bootstrap.min.css'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartLine } from "@fortawesome/free-solid-svg-icons";

const OptionTheme = (theme) => ({
    ...theme,
    borderRadius: 0,
    colors: {
        ...theme.colors,
        neutral0: '#30115e',
        neutral50: 'white',
        neutral80: 'white',

        neutral10: 'hotpink',
        primary25: 'hotpink',
        primary: '#32fbe2',
    },
})

const typeOptions = [
    { value: "total", label: "Total Duration" },
    { value: "waiting", label: "Waiting Time" },
    { value: "executing", label: "Executing Time" }
];

export const LineChartForm = ({ task, onSubmit }) => {
    const [selectedTaskID, setSelectedTaskID] = useState();
    const [selectedSubtaskID, setSelectedSubtaskID] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [subtaskOpt, setSubtaskOpt] = useState([]);
    const [startDate, setStartDate] = useState("2021-10-01");
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    const [error, setError] = useState();

    const handleTypeChange = (selected) => { setSelectedType(selected.value); };
    const handleTaskChange = (selected) => { setSelectedTaskID(selected.value); setSelectedSubtaskID([]);};

    const handleSubtaskChange = (selected) => { setSelectedSubtaskID(selected.map(t => Object.values(t)[0])); };

    var taskOptions = [];
    task.map((tsk) => {
        taskOptions.push({ value: tsk.tsk_id, label: tsk.tsk_name })
    })

    useEffect(() => {
        try {
            var subtaskOptions =[];
            const tsk = task.find(tsk => { return tsk.tsk_id === selectedTaskID });
            subtaskOptions.push({ value: 0, label: "None" });
            tsk.subtask.map((st) => {
                subtaskOptions.push({ value: st.st_id, label: st.st_name });
            })
            setSubtaskOpt(subtaskOptions);

        } catch (err) {
            console.log(err.message);
        }
    }, [selectedTaskID]);


    return (
        <>
            <Form>
                <FontAwesomeIcon icon={faChartLine} />    <i>Generate a line chart to compare subtasks of a task by the total time, waiting time, or executing time.</i>
                <br />
                <br />
                <Form.Group className={error ? 'error' : ''}>
                    <Form.Label>Type</Form.Label>
                    <Select options={typeOptions} theme={OptionTheme} onChange={handleTypeChange} />
                </Form.Group>
                <br />

                <Form.Group className={error ? 'error' : ''}>
                    <Form.Label>Task</Form.Label>
                    <Select options={taskOptions} theme={OptionTheme} onChange={handleTaskChange} />
                </Form.Group>
               

                <br />
                <Form.Group className={error ? 'error' : ''}>
                    <div class="row">
                        <div class="col">
                            <Form.Label>Start</Form.Label>
                            <Form.Control
                                type="date"
                                id="StartDateInput"
                                value={startDate}
                                onChange={e => setStartDate(e.target.value)}
                            />
                        </div>
                        <div class="col">
                            <Form.Label>End</Form.Label>
                            <Form.Control
                                type="date"
                                id="EndDateInput"
                                value={endDate}
                                onChange={e => setEndDate(e.target.value)}
                            />
                        </div>
                    </div>
                </Form.Group>
                <br />
                <Form.Group>
                    <Form.Label>Task(s)</Form.Label>
                    <Select
                        value={selectedSubtaskID.map((ssid) => { return subtaskOpt.find(so => { return so.value === parseInt(ssid) }); })}
                        options={subtaskOpt}
                        isMulti
                        theme={OptionTheme}
                        onChange={handleSubtaskChange}
                    />
                </Form.Group>
                <br />
                <br />
                <div className="d-grid gap-2">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            if (selectedType && selectedTaskID && selectedSubtaskID && startDate && endDate) {
                                setError(false);
                                console.log(selectedType, selectedTaskID, selectedSubtaskID, startDate, endDate);
                                onSubmit(selectedType, selectedTaskID, selectedSubtaskID, startDate, endDate);
                            } else {
                                setError(true);
                            }
                        }
                        }
                        id="submitButton">
                        Generate
                    </Button>
                </div>
                <br />
                <br />
                <br />

            </Form>
        </>

    );

};