import React, { useEffect, useState } from "react";
import Card from 'react-bootstrap/Card'
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import iCalendarPlugin from '@fullcalendar/icalendar'
import { toast } from "react-toastify";
import { Tooltip } from "bootstrap/dist/js/bootstrap.esm.min.js"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
export const Dashboard = () => {

  const generateTooltip = (info) => {
    try {
      const generateTooltipTitle = (info) => {
        if (info.event.extendedProps.location && info.event.extendedProps.lecturer) {
          return '@' + String(info.event.extendedProps.location) + ' by ' + String(info.event.extendedProps.lecturer)

        } else if (info.event.extendedProps.location) {
          return '@' + String(info.event.extendedProps.location)
        } else { return String(info.event.title); }
      }
      var title = String(generateTooltipTitle(info));

      var tooltip = new Tooltip(info.el, {
        title: title,
        placement: 'top',
        trigger: 'hover',
        container: 'body'
      });
    } catch (err) { console.log(err); }
  }

  return (
    <>
      <Row>

      </Row>
      <Row>
        <Col>
          <FullCalendar

            plugins={[listPlugin, googleCalendarPlugin, iCalendarPlugin]}
            initialView='listDay'
            googleCalendarApiKey={'AIzaSyChhsubNQqDxtMQTFYNYTkaMvgnHI-Bgvo'}
            eventDidMount={generateTooltip}
            eventSources={[
              { googleCalendarId: 'en.malaysia#holiday@group.v.calendar.google.com' },//Malaysia Holiday
              { googleCalendarId: 'p520al5mfgqq5m2a8pu021nv0c@group.calendar.google.com', color: '#00B2A9', textColor: 'white', backgroundColor: '#00B2A9' }, //Liverpool
              { googleCalendarId: '4gekf3tjbnuji36gm85a9sicrbt56jv9@import.calendar.google.com', color: 'pink', textColor: 'deeppink' }, //Outlook calendar, probably ms.l, originally ics but cannot import so convert to google calendar
              //{ googleCalendarId: '13h4uict96okp7hnmnq0m28fisn8k15c@import.calendar.google.com', color: 'violet', textColor: 'blue' }, //moodle assignment submission deadline
              {
                url: '/api/apuCourse',
                method: 'GET',
                failure: function () {
                  alert('there was an error while fetching events!');
                },
                color: 'mediumseagreen',   // a non-ajax option
                extraParams: {
                  headers: [{ jwt_token: localStorage.token, rt_token: localStorage.refreshToken }]
                }
              },
              {
                url: 'https://stormy-bastion-22629.herokuapp.com/https://lms2.apiit.edu.my/calendar/export_execute.php?userid=40338&authtoken=493c4503582bbf37a4df8ae70d9c07bd27d8d99e&preset_what=all&preset_time=recentupcoming',
                format: 'ics',
                color: 'violet',
                textColor: 'blue'
              }

            ]}


          />
        </Col>
        <Col>
        </Col>
      </Row>

    </>
  );
};
