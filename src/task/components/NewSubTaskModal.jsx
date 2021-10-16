import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'

import 'bootswatch/dist/vapor/bootstrap.min.css'

export const NewSubTaskModal = ({ onSave, onClose, subTaskInfo }) => {
    const [name, setName] = useState(subTaskInfo?subTaskInfo.st_name:"");
    const [error, setError] = useState(false);

    return (
        <>
            <Modal
                backdrop="static"
                show={true}>
                <Modal.Header>
                    <Modal.Title>Input Subtask</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            <InputGroup>
                                <InputGroup.Text>Subtask Name</InputGroup.Text>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter here"
                                    value={name}
                                    onChange={e => setName(e.target.value)}
                                />
                            </InputGroup>
                        </Form.Group>

                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (name) {
                                setError(false);
                                onSave(name);
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