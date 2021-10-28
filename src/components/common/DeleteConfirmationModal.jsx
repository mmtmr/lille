import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button'

import 'bootswatch/dist/vapor/bootstrap.min.css'

export const DeleteConfirmationModal = ({ onConfirm, onCancel, targetName }) => {
    const [name, setName] = useState(targetName === null ? "this" : targetName);
    return (
        <>
            <Modal
                backdrop="static"
                show={true}>
                <Modal.Header>
                    <Modal.Title>Delete Confirmation</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    Are you sure you want to delete <b>{name}</b>?
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="danger"
                        onClick={() => onConfirm()}
                        id="confirmButton">Confirm</Button>


                    <Button
                        variant="secondary"
                        onClick={onCancel}
                        id="cancelButton">Cancel</Button>
                </Modal.Footer>

            </Modal>
        </>
    );
};