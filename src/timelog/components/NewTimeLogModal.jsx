import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Select from 'react-select'
import 'bootswatch/dist/vapor/bootstrap.min.css';


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

export const NewTimeLogModal = ({ task, timeLogInfo, onSave, onClose }) => {
    //const timeLogInfo = { task:{tsk_name:"Elaine's Website"},tsk_id:"1", st_id:["1","2"]};
    //const timeLogInfo={tsk_name:["Shower"]};
    const [taskID, setTaskID] = useState(timeLogInfo === null ? 0 : timeLogInfo.tsk_id);
    const [subtaskOpt, setSubtaskOpt] = useState([{ value: "N/A", label: "N/A" }]);
    const [selectedSubtaskID, setSelectedSubtaskID] = useState(timeLogInfo === null ? [] : timeLogInfo.st_ids);
    const [standbyHour, setStandbyHour] = useState(timeLogInfo === null ? 0 : Math.trunc(timeLogInfo.tl_standby_min / 60));
    const [standbyMin, setStandbyMin] = useState(timeLogInfo === null ? 0 : timeLogInfo.tl_standby_min % 60);
    const [realHour, setRealHour] = useState(timeLogInfo === null ? 0 : Math.trunc(timeLogInfo.tl_real_min / 60));
    const [realMin, setRealMin] = useState(timeLogInfo === null ? 0 : timeLogInfo.tl_real_min % 60);
    const [date, setDate] = useState(timeLogInfo === null ? new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0] : new Date(new Date(timeLogInfo.tl_date).getTime() - (new Date(timeLogInfo.tl_date).getTimezoneOffset() * 60000)).toISOString().split('T')[0]); //Convert UTC Stored in Database to Local Time Zone
    const [error, setError] = useState(false);

    const handleTaskChange = (selected) => { setTaskID(selected.value) };
    const handleSubtaskChange = (selected) => { setSelectedSubtaskID(selected.map(st => Object.values(st)[0])); };




    useEffect(() => {
        try {
            const tsk = task.find(tsk => { return tsk.tsk_id === taskID });

            var subtaskOptions=[];
            tsk.subtask.map((st) => {
                subtaskOptions.push({ value: st.st_id, label: st.st_name })
            })
            setSubtaskOpt(subtaskOptions);
            console.log("hi");
        } catch (err) {
            console.log(err.message);
        }
    }, [taskID,]);



    const taskOptions = [];
    task.map((tsk) => {
        taskOptions.push({ value: tsk.tsk_id, label: tsk.tsk_name })
    })

    return (
        <>
            <Modal
                show={true}
                onHide={onClose}
                backdrop="static">
                <Modal.Header>
                    <Modal.Title>Input Time Log</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Task</Form.Label>
                            <Select value={taskOptions.find(to => { return to.value === parseInt(taskID) })} options={taskOptions} theme={OptionTheme} onChange={handleTaskChange} />
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Date</Form.Label>
                            <Form.Control
                                type="date"
                                id="TimeLogDateInput"
                                value={date}
                                onChange={e => setDate(e.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Waiting</Form.Label>
                            <div class="row">
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Hours</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TimeLogStandbyHourInput"
                                            step="1"
                                            min='0'
                                            className={error ? 'error' : ''}
                                            value={standbyHour}
                                            placeholder="Hour"
                                            onChange={e => setStandbyHour(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Minutes</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TimeLogStandbyMinInput"
                                            step="5"
                                            min='0'
                                            max='59'
                                            className={error ? 'error' : ''}
                                            value={standbyMin}
                                            placeholder="Min"
                                            onChange={e => setStandbyMin(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Executing</Form.Label>
                            <div class="row">
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Hours</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TimeLogRealHourInput"
                                            step="1"
                                            min='0'
                                            className={error ? 'error' : ''}
                                            value={realHour}
                                            placeholder="Hour"
                                            onChange={e => setRealHour(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Minutes</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TimeLogRealMinInput"
                                            step="5"
                                            min='0'
                                            max='59'
                                            className={error ? 'error' : ''}
                                            value={realMin}
                                            placeholder="Min"
                                            onChange={e => setRealMin(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Subtask</Form.Label>
                            <Select
                                options={subtaskOpt}
                                isMulti
                                value={selectedSubtaskID.map((ssid) => { return subtaskOpt.find(so => { return so.value === parseInt(ssid) }); })}
                                theme={OptionTheme}
                                onChange={handleSubtaskChange}
                            />

                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (taskID && date && (realHour || realMin)) {
                                standbyHour ? setStandbyHour(standbyHour) : setStandbyHour(0);
                                standbyMin ? setStandbyMin(standbyMin) : setStandbyMin(0);
                                realHour ? setRealHour(realHour) : setRealHour(0);
                                realMin ? setRealMin(realMin) : setRealMin(0);
                                setError(false);
                                onSave(taskID, date, standbyHour * 60 + standbyMin, realHour * 60 + realMin, selectedSubtaskID);
                            } else {
                                setError(true);
                            }

                        }
                        }
                        id="saveButton">Save</Button>


                    <Button
                        variant="secondary"
                        onClick={onClose}
                        id="cancelButton">Cancel</Button>
                </Modal.Footer>

            </Modal>
        </>
    );
};