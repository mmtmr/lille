import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next';
import { DeleteConfirmationModal } from '../common/DeleteConfirmationModal';
import { NewRevisionModal } from './NewRevisionModal'
import 'bootswatch/dist/vapor/bootstrap.css'
import { ankiInvoke } from '../../lib/anki/anki';
import { Fab, Action } from 'react-tiny-fab';
import 'react-tiny-fab/dist/styles.css';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListAlt } from "@fortawesome/free-solid-svg-icons";




export const RevisionList = () => {
    const [createRevision, setCreateRevision] = useState();
    const [editRevision, setEditRevision] = useState();
    const [deleteRevision, setDeleteRevision] = useState();
    const [updateRevision, setUpdateRevision] = useState([]);
    const [revision, setRevision] = useState([]);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        try {
            const getCards = async () => {
                const findCards = await ankiInvoke("findCards", 6, { query: "deck:Lille" });
                if (findCards) {
                    const cardsInfo = await ankiInvoke("cardsInfo", 6, { cards: findCards });
                    if (cardsInfo) {
                        setRevision(cardsInfo);
                    }
                }
            }
            getCards();
            const getNotes = async () => {
                const findNotes = await ankiInvoke("findNotes", 6, { query: "deck:Lille" });
                if (findNotes) {
                    const notesInfo = await ankiInvoke("notesInfo", 6, { notes: findNotes });
                    if (notesInfo) {
                        setNotes(notesInfo);
                    }
                }
            }
            getNotes();
        } catch (err) {
            console.log(err.message);
        }
    }, [, createRevision, editRevision, deleteRevision, updateRevision]);

    const modifyFormatter = (cell, row, rowIndex) => {
        return (
            <>
                {/* <Button variant="secondary" onClick={() => { setUpdateRevision({cardID:cell, action:'bury'}) }}>Bury</Button> */}
                <Button variant="secondary" onClick={() => { setUpdateRevision({ cardID: cell, action: 'suspend' }) }}>Suspend</Button>
                <Button variant="primary" onClick={() => { setEditRevision(cell) }}>Modify</Button>
                <Button variant="danger" onClick={() => { setDeleteRevision(cell) }}>Delete</Button>

            </>
        )
    }

    const reviewFormatter = (cell, row, rowIndex) => {
        return (
            <>

                <Button variant="danger" onClick={() => { setUpdateRevision({ cardID: cell, action: 'fail' }) }}>Fail</Button>
                <Button variant="warning" onClick={() => { setUpdateRevision({ cardID: cell, action: 'hard' }) }}>Hard</Button>
                <Button variant="success" onClick={() => { setUpdateRevision({ cardID: cell, action: 'good' }) }}>Good</Button>
                <Button variant="light" onClick={() => { setUpdateRevision({ cardID: cell, action: 'easy' }) }}>Easy</Button>
            </>
        )
    }

    const intervalFormatter = (cell, row, rowIndex) => {
        if (parseInt(cell) == 0) {
            return "Now";
        } else if (parseInt(cell) < 0) {
            return parseInt(cell) / 60 + " min";
        } else {
            return parseInt(cell) + " day";
        }
    }


    const expandRow = {
        renderer: (row, rowIndex) => (
            <div>
                {`${row.fields.Back.value}`}
            </div>
        )
    };

    const defaultSorted = [{
        dataField: "ord",
        order: "asc"
    }];

    const columns = [
        {
            dataField: "ord",
            text: "Order",
            sort: true,
        },
        {
            dataField: "fields.Front.value",
            text: "Title"
        },
        {
            dataField: "interval",
            text: "Due",
            formatter: intervalFormatter
        },
        {
            dataField: "cardId",
            text: "",
            formatter: reviewFormatter
        },
        {
            dataField: "note",
            text: "",
            formatter: modifyFormatter
        }
    ];

    return (
        <>
            <Container className="full-height">
                {
                    !createRevision && !editRevision && !deleteRevision &&
                    <Fab
                        position={{ bottom: 5, right: 5 }}
                        event="hover"
                        alwaysShowTitle={true}
                        mainButtonStyles={{
                            backgroundColor: "#00b5ad"
                        }}
                        icon="+"
                    >
                        <Action
                            style={{
                                backgroundColor: "#8e44ad"
                            }}
                            onClick={() => setCreateRevision(true)}
                        >
                            <FontAwesomeIcon icon={faListAlt} />
                        </Action>

                    </Fab>
                }

                <BootstrapTable
                    keyField="cardId"
                    data={revision}
                    columns={columns}
                    defaultSorted={defaultSorted}
                    expandRow={expandRow}
                />
            </Container>
            {
                createRevision &&
                <NewRevisionModal
                    noteInfo={null}
                    onSave={(params) => {
                        try {
                            const createNote = async () => {
                                const addNote = await ankiInvoke("addNote", 6, params);
                                setCreateRevision(false);
                            }
                            createNote();
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    onClose={() => setCreateRevision(false)}
                />
            }
            {
                editRevision &&
                <NewRevisionModal
                    noteInfo={notes.find(n => { return n.noteId === editRevision; })}
                    onSave={(params) => {
                        try {
                            const updateNote = async () => {
                                const updateNoteFields = await ankiInvoke("updateNoteFields", 6, params);
                                setEditRevision(false);
                            }
                            updateNote();

                            const updateTags = async () => {
                                const oldTags = notes.find(n => { return n.noteId === editRevision; }).tags;
                                const removeTags = await oldTags.map(tag => ankiInvoke("removeTags", 6, { notes: [editRevision], tags: tag }));
                                const addTags = await params.note.tags.map(tag => ankiInvoke("addTags", 6, { notes: [editRevision], tags: tag }));
                                setEditRevision(false);
                            }
                            updateTags();
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    onClose={() => setEditRevision(false)}
                />
            }
            {
                deleteRevision &&
                < DeleteConfirmationModal
                    onCancel={() => setDeleteRevision(null)}
                    onConfirm={() => {
                        try {
                            const removeNote = async () => {
                                const deleteNote = await ankiInvoke("deleteNotes", 6, {notes:[deleteRevision]});
                                setDeleteRevision(null);
                            }
                            removeNote();
                        } catch (err) {
                            console.log(err.message);
                        }
                    }}
                    targetName={deleteRevision.question}
                />
            }
        </>

    );

};