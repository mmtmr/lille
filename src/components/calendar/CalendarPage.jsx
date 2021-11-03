import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container';
import {CalendarSetting} from './CalendarSetting';
import {Calendar} from './Calendar';

export const CalendarPage = () => {
    return(
        <>
            <CalendarSetting />
            <Calendar />
        </>
    )
}