import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'

import Button from 'react-bootstrap/Button'
import Select from 'react-select';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartArea } from "@fortawesome/free-solid-svg-icons";

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

export const ScatterChartForm = ({ task, onSubmit }) => {
    const [selectedTaskID, setSelectedTaskID] = useState([]);
    const [selectedType, setSelectedType] = useState("");
    const [startDate, setStartDate] = useState("2021-10-01");
    const [endDate, setEndDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    const [error, setError] = useState();

    const handleTypeChange = (selected) => { setSelectedType(selected.value) };
    const handleTaskChange = (selected) => { setSelectedTaskID(selected.map(t => Object.values(t)[0])); };

    var taskOptions = [];
    task.map((tsk) => {
        taskOptions.push({ value: tsk.tsk_id, label: tsk.tsk_name })
    })

    return (
        <>
            <Form>
                <FontAwesomeIcon icon={faChartArea} />    <i>Generate a scatter chart to compare tasks by their total time, waiting time, or executing time.</i>
                <br />
                <br />
                <Form.Group className={error ? 'error' : ''}>
                    <Form.Label>Type</Form.Label>
                    <Select options={typeOptions} theme={OptionTheme} onChange={handleTypeChange} />
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
                        options={taskOptions}
                        isMulti
                        theme={OptionTheme}
                        onChange={handleTaskChange}
                    />
                </Form.Group>
                <br />
                <br />
                <div className="d-grid gap-2">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            if (selectedType && selectedTaskID && startDate && endDate) {
                                setError(false);
                                onSubmit(selectedType, selectedTaskID, startDate, endDate);
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