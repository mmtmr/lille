import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import 'bootswatch/dist/vapor/bootstrap.min.css'

export const NewTaskModal = ({ onSave, onClose, taskInfo }) => {
    const [name, setName] = useState(taskInfo.tsk_name);
    const [hour, setHour] = useState(taskInfo.tsk_est_min / 60?Math.trunc(taskInfo.tsk_est_min / 60):0);
    const [min, setMin] = useState(taskInfo.tsk_est_min % 60);
    const [error, setError] = useState(false);
    console.log(typeof hour, typeof min);
    return (
        <>
            <Modal
                show={true}
                onHide={onClose}
                backdrop="static">
                <Modal.Header>
                    <Modal.Title>Input Task</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            <InputGroup>
                                <InputGroup.Text>Task Name</InputGroup.Text>
                                
                                <Form.Control
                                    type="text"
                                    placeholder="Enter here"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <div class="row">
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Hours</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TaskEstHourInput"
                                            step="1"
                                            min='0'
                                            className={error ? 'error' : ''}
                                            value={hour}
                                            placeholder="Hour"
                                            onChange={e => setHour(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                                <div class="col">
                                    <InputGroup>
                                        <InputGroup.Text>Minutes</InputGroup.Text>
                                        <Form.Control
                                            type="number"
                                            id="TaskEstMinInput"
                                            step="5"
                                            min='0'
                                            max='59'
                                            className={error ? 'error' : ''}
                                            value={min}
                                            placeholder="Minute"
                                            onChange={e => setMin(e.target.value)}
                                        />
                                    </InputGroup>
                                </div>
                            </div>
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (name && (hour || min)) {
                                hour ? setHour(hour) : setHour(0);
                                min ? setMin(min) : setMin(0);
                                setError(false);
                                console.log(typeof parseInt(hour) * 60, typeof parseInt(min));
                                onSave(name, parseInt(hour) * 60 + parseInt(min));
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