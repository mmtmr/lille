import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Button from 'react-bootstrap/Button'
import BootstrapTable from 'react-bootstrap-table-next';
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import Alert from 'react-bootstrap/Alert'

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
    const [updateRevision, setUpdateRevision] = useState();
    const [revision, setRevision] = useState([]);
    const [dueRevision, setDueRevision] = useState([]);
    const [notes, setNotes] = useState([]);

    useEffect(() => {
        try {
            const getCards = async () => {
                const findCardsInReview = await ankiInvoke("findCards", 6, { query: "deck:Review" });
                if (findCardsInReview) {
                    const moveCardsToLille = await ankiInvoke("changeDeck", 6, { cards: findCardsInReview, deck: "Lille" });
                }
                const findCardsInLille = await ankiInvoke("findCards", 6, { query: "deck:Lille" });
                const areDue = await ankiInvoke("areDue", 6, { cards: findCardsInLille });
                const cardsInfo = await ankiInvoke("cardsInfo", 6, { cards: findCardsInLille });
                const dueCards = [];
                for (var i = 0; i < areDue.length; i++) {
                    if (areDue[i]) {
                        dueCards.push(cardsInfo[i]);
                    }
                }
                setRevision(cardsInfo);
                setDueRevision(dueCards)
            }
            getCards();
            const getNotes = async () => {
                const findNotes = await ankiInvoke("findNotes", 6, { query: "deck:Lille" });
                const notesInfo = await ankiInvoke("notesInfo", 6, { notes: findNotes });
                setNotes(notesInfo);
            }
            getNotes();
        } catch (err) {
            console.log(err.message);
        }
    }, [, createRevision, editRevision, deleteRevision, updateRevision]);

    useEffect(() => {
        try {
            const reviewCard = async () => {
                const changeDeckBeforeReview = await ankiInvoke("changeDeck", 6, { cards: [updateRevision.cardId], deck: "Review" });

                const guiDeckReview = await ankiInvoke("guiDeckReview", 6, { name: "Review" });
                const guiShowAnswer = await ankiInvoke("guiShowAnswer", 6);

                switch (updateRevision.action) {
                    case 'fail':
                        const guiFailCard = await ankiInvoke("guiAnswerCard", 6, { ease: 1 });
                        break;
                    case 'hard':
                        const guiHardCard = await ankiInvoke("guiAnswerCard", 6, { ease: 2 });
                        break;
                    case 'good':
                        const guiGoodCard = await ankiInvoke("guiAnswerCard", 6, { ease: 3 });
                        break;
                    case 'easy':
                        const guiEasyCard = await ankiInvoke("guiAnswerCard", 6, { ease: 4 });
                        break;
                    case 'suspend':
                        const suspendCard = await ankiInvoke("suspend", 6, { cards: updateRevision.cardId });
                        if (!suspendCard) {
                            const unsuspendCard = await ankiInvoke("unsuspend", 6, { cards: updateRevision.cardId });
                        }
                        break;
                }
                const changeDeckAfterReview = await ankiInvoke("changeDeck", 6, { cards: [updateRevision.cardId], deck: "Lille" });

            }
            if (updateRevision) {
                reviewCard();
                setUpdateRevision();
            }
        } catch (err) {
            console.log(err.message);
        }
    }, [updateRevision]);

    const modifyFormatter = (cell, row, rowIndex) => {
        return (
            <>
                {/* <Button variant="secondary" onClick={() => { setUpdateRevision({cardId:cell, action:'bury'}) }}>Bury</Button> */}
                <Button variant="secondary" onClick={() => { setUpdateRevision({ cardId: cell, action: 'suspend' }) }}>Suspend</Button>
                <Button variant="primary" onClick={() => { setEditRevision(cell) }}>Modify</Button>
                <Button variant="danger" onClick={() => { setDeleteRevision(cell) }}>Delete</Button>

            </>
        )
    }

    const reviewFormatter = (cell, row, rowIndex) => {
        return (
            <>

                <Button variant="danger" onClick={() => { setUpdateRevision({ cardId: cell, action: 'fail' }) }}>Fail</Button>
                <Button variant="warning" onClick={() => { setUpdateRevision({ cardId: cell, action: 'hard' }) }}>Hard</Button>
                <Button variant="success" onClick={() => { setUpdateRevision({ cardId: cell, action: 'good' }) }}>Good</Button>
                <Button variant="light" onClick={() => { setUpdateRevision({ cardId: cell, action: 'easy' }) }}>Easy</Button>
            </>
        )
    }

    const dueFormatter = (cell, row, rowIndex) => {
        if (parseInt(cell) === 0) {
            return "Now";
        } else if (parseInt(cell) < 0) {
            return parseInt(cell) / 60 + " min";
        } else {
            return new Date(cell*1000).toLocaleDateString("en-MY");
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

    const dueRevisionColumns = [
        {
            dataField: "due",
            text: "Due",
            sort: true,
            formatter: dueFormatter
        },
        {
            dataField: "fields.Front.value",
            text: "Title"
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

    const allRevisionColumns = [
        {
            dataField: "due",
            text: "Due",
            sort: true,
            formatter: dueFormatter
        },
        {
            dataField: "fields.Front.value",
            text: "Title"
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
                <Tabs defaultActiveKey="due">
                    {
                        dueRevision.length !== 0 &&
                        <Tab eventKey="due" title="Due" >
                            <BootstrapTable
                                keyField="cardId"
                                data={dueRevision}
                                columns={dueRevisionColumns}
                                defaultSorted={defaultSorted}
                                expandRow={expandRow}
                            />
                        </Tab>
                    }
                    {
                        dueRevision.length === 0 &&
                        <Tab eventKey="due" title="Due" >
                            <Alert key="due" variant="primary">Currently, there are no cards to review.</Alert>
                        </Tab>
                    }

                    <Tab eventKey="all" title="All" >
                        <BootstrapTable
                            keyField="cardId"
                            data={revision}
                            columns={allRevisionColumns}
                            defaultSorted={defaultSorted}
                            expandRow={expandRow}
                        />
                    </Tab>
                </Tabs>

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
                                const deleteNote = await ankiInvoke("deleteNotes", 6, { notes: [deleteRevision] });
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