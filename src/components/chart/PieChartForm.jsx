import React, { useState, useEffect } from 'react';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChartPie } from "@fortawesome/free-solid-svg-icons";


export const PieChartForm = ({ onSubmit }) => {

    const [date, setDate] = useState(new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)).toISOString().split('T')[0]);
    const [error, setError] = useState();

    return (
        <>
            <Form>
                <FontAwesomeIcon icon={faChartPie} />    <i>Generate a pie chart for an overview of the day.</i>
                <br />
                <br />
                <Form.Group className={error ? 'error' : ''}>
                    <Form.Label>Start</Form.Label>
                    <Form.Control
                        type="date"
                        id="DateInput"
                        value={date}
                        onChange={e => setDate(e.target.value)}
                    />
                </Form.Group>
                <br />
                <br />
                <div className="d-grid gap-2">
                    <Button
                        variant="secondary"
                        size="lg"
                        onClick={() => {
                            if (date) {
                                setError(false);
                                onSubmit(date);
                            } else {
                                setError(true);
                            }
                        }
                        }
                        id="submitButton">
                        Generate
                    </Button>
                </div>
                <br />
                <br />
                <br />
            </Form>
        </>

    );

};