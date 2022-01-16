import React, { useState, useEffect } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import InputGroup from 'react-bootstrap/InputGroup'
import Select from 'react-select'

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
//TODO Colour option

export const GoogleCalendarSetting = ({ googleCalendarSetting, onSave, onClose }) => {
    const [apiKey, setApiKey] = useState(googleCalendarSetting?googleCalendarSetting.apiKey:null);
    const [ids, setIds] = useState(googleCalendarSetting?googleCalendarSetting.ids:[]);


    return (
        <>
            <Modal
                show={true}
                onHide={onClose}
                backdrop="static">
                <Modal.Header>
                    <Modal.Title>Google Calendar Setting</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Google API Key</Form.Label>
                            <Form.Control
                                type="text"
                                id="apiKey"
                                value={apiKey}
                                onChange={e => setApiKey(e.target.value)}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Google Calendar ID (Separate by comma, ex: ab12,cd34)</Form.Label>
                            <Form.Control
                                type="text"
                                id="googleCalendarIDs"
                                value={ids}
                                onChange={e => setApiKey(e.target.value.split())}
                            />
                        </Form.Group>                        
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => onSave(apiKey,ids)}
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