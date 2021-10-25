import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'

export const NewTaskModal = ({ onSave, onClose, taskInfo }) => {
    const [name, setName] = useState(taskInfo.tsk_name);
    const [hour, setHour] = useState(taskInfo.tsk_est_min ? Math.trunc(taskInfo.tsk_est_min / 60) : 0);
    const [min, setMin] = useState(taskInfo.tsk_est_min ? taskInfo.tsk_est_min % 60 : 0);
    const [type, setType] = useState(taskInfo.tsk_todo ? "todo" : "habit");
    const [error, setError] = useState(false);
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
                            <Row>
                                <Col>
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
                                </Col>
                                <Col>
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
                                </Col>
                            </Row>
                        </Form.Group>
                        < br />
                        <InputGroup>
                            <InputGroup.Text>Type</InputGroup.Text>
                            <Form.Control
                                value={type}
                                as="select"
                                onChange={e => setType(e.target.value)}
                            >
                                <option value="habit">Habit</option>
                                <option value="todo">To Do</option>
                            </Form.Control>
                        </InputGroup>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (name) {
                                setError(false);
                                onSave(name, Number(parseInt(hour) * 60) + Number(parseInt(min)), type === "todo");
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