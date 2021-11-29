import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import DateTimeRangePicker from '@wojtekmaj/react-datetimerange-picker'

export const NewEventModal = ({ onSave, onClose, title }) => {
    const [name, setName] = useState(title);
    const [description, setDescription] = useState("");
    const [range, setRange] = useState([new Date(), new Date()]);
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
                            <InputGroup>
                                <InputGroup.Text>Event Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter here"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputGroup>
                            <br />
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
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (name && range) {
                                if (!description) { setDescription(""); }
                                setError(false);
                                onSave(name, description, range);
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