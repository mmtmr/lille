import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import CreatableSelect from 'react-select/creatable';
import { useTags } from '../../hooks/useTags';

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

export const NewRevisionModal = ({ noteInfo, onSave, onClose }) => {
    const [noteId, setNoteId] = useState(noteInfo === null ? 0 : noteInfo.noteId);
    const [frontField, setFrontField] = useState(noteInfo === null ? "" : noteInfo.fields.Front.value);
    const [backField, setBackField] = useState(noteInfo === null ? "" : noteInfo.fields.Back.value);
    const [tags, setTags] = useState(noteInfo === null ? [] : noteInfo.tags);

    const [error, setError] = useState(false);

    const oldTags = useState(noteInfo === null ? [] : noteInfo.tags);
    const allTags = useTags();
    const handleFrontFieldChange = e => setFrontField(e.target.value)
    const handleBackFieldChange = e => setBackField(e.target.value)

    const handleTagsChange = (selected) => { console.log(selected); setTags(selected.map(t => t.value)); };


    const tagOptions = [];
    allTags.map((tag) => {
        tagOptions.push({ value: tag, label: tag })
    })

    return (
        <>
            <Modal
                show={true}
                onHide={onClose}
                backdrop="static">
                <Modal.Header>
                    <Modal.Title>Input Revision</Modal.Title>
                </Modal.Header>

                <Modal.Body>
                    <Form>
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Front</Form.Label>
                            <Form.Control
                                id="RevisionFrontField"
                                value={frontField}
                                onChange={handleFrontFieldChange}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Back</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                id="RevisionBackField"
                                value={backField}
                                onChange={handleBackFieldChange}
                            />
                        </Form.Group>
                        <br />
                        <Form.Group className={error ? 'error' : ''}>
                            <Form.Label>Tags</Form.Label>
                            <CreatableSelect
                                options={tagOptions}
                                isMulti
                                value={tags.map((tag) => { return { value: tag, label: tag } })}
                                theme={OptionTheme}
                                onChange={handleTagsChange}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button
                        variant="primary"
                        onClick={() => {
                            if (frontField) {
                                const params = {
                                    note: {
                                        "id": noteId,
                                        "deckName": "Lille",
                                        "modelName": "Basic",
                                        "fields": {
                                            "Front": frontField,
                                            "Back": backField
                                        },
                                        "options": {
                                            "allowDuplicate": false,
                                            "duplicateScope": "deck",
                                            "duplicateScopeOptions": {
                                                "deckName": "Lille",
                                                "checkChildren": false,
                                                "checkAllModels": false
                                            }
                                        },
                                        "tags": tags
                                    }
                                }

                                setError(false);
                                onSave(params);
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