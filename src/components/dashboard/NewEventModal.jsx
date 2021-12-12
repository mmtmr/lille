import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';

export const NewEventModal = ({ onSave, onClose, schedule }) => {
    const [name, setName] = useState(schedule.title);
    const [subject, setSubject] = useState(schedule.subject);
    const [location, setLocation] = useState(schedule.location);
    const [description, setDescription] = useState(schedule.description);
    const [del, setDel] = useState();
    const [range, setRange] = useState([schedule.start, schedule.end]);
    const [error, setError] = useState(false);

    return (
        <>
            <Modal
                backdrop="static"
                show={true}>
                <Modal.Header>
                    <Modal.Title>Input Event</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            {
                                name &&
                                <InputGroup>
                                    <InputGroup.Text>Event Name</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter here"
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                    />
                                </InputGroup>

                            }
                            {
                                subject &&
                                <InputGroup>
                                    <InputGroup.Text>Subject</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter here"
                                        value={subject}
                                        onChange={e => setSubject(e.target.value)}
                                    />
                                </InputGroup>
                            }
                            {
                                location &&
                                <InputGroup>
                                    <InputGroup.Text>Location</InputGroup.Text>
                                    <Form.Control
                                        type="text"
                                        placeholder="Enter here"
                                        value={location}
                                        onChange={e => setLocation(e.target.value)}
                                    />
                                </InputGroup>
                            }
                            <InputGroup>
                                <InputGroup.Text>Description</InputGroup.Text>
                                <Form.Control
                                    type="textarea"
                                    placeholder="Enter here"
                                    rows={3}
                                    value={description}
                                    onChange={e => setDescription(e.target.value)}
                                />
                            </InputGroup>
                            <br />
                            <DateTimeRangePicker
                                onChange={setRange}
                                value={range}
                            />
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    {
                        schedule.id &&
                        <Button
                            variant="danger"
                            onClick={() => { setDel(schedule) }}
                            id="deleteButton">Delete</Button>
                    }
                    {
                        del &&
                        < DeleteConfirmationModal
                            onCancel={() => setDel(null)}
                            onConfirm={() => {
                                const we_id = schedule.id;
                                const body = { we_id };
                                const response = fetch(`/api/notionLog/${we_id}`, {
                                    method: "DELETE",
                                    headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken },
                                    body: JSON.stringify(body)
                                });
                                setDel(null);
                            }}
                            targetName={schedule.title}
                        />
                    }
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (name && range) {
                                if (!description) { setDescription(""); }
                                setError(false);
                                onSave(name, description, subject, range[0], range[1]);
                            }else if(location && range){
                                if (!description) { setDescription(""); }
                                setError(false);
                                onSave(range[0], range[1], description, location);
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