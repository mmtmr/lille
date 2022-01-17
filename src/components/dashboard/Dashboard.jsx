import React, { useRef, useState } from "react";
import FullCalendar from '@fullcalendar/react'
import listPlugin from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import iCalendarPlugin from '@fullcalendar/icalendar'
import { Tooltip } from "bootstrap/dist/js/bootstrap.esm.min.js"
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import CustomViewPlugin from './CustomView';
import { NotionBoard } from './NotionBoard';
import { NewEventModal } from './NewEventModal';
import { useFetch } from '../../hooks/useFetch'

export const Dashboard = () => {

  const [event, setEvent] = useState();
  const calBoardRef = useRef();
  const calCustomRef = useRef();


  const handleEventClick = (clickInfo) => {
    clickInfo.jsEvent.preventDefault();
    console.log(clickInfo.event);
    if (clickInfo.event.url) {
      if (confirm(`Are you sure you want to open new tab for the event '${clickInfo.event.title}'?`)) {
        window.open(clickInfo.event.url);
      }
    } else if (clickInfo.event.extendedProps.lecturer) {
      var schedule = { id: clickInfo.event._def.publicId, location: clickInfo.event.extendedProps.location, description: clickInfo.event.extendedProps.description, start: new Date(clickInfo.event._instance.range.start.getTime() + new Date().getTimezoneOffset() * 60000), end: new Date(clickInfo.event._instance.range.end.getTime() + new Date().getTimezoneOffset() * 60000) }
      setEvent(schedule);
    } else if (clickInfo.event.extendedProps.subject!=null) {
      var schedule = { id: clickInfo.event._def.publicId, title: clickInfo.event.title, subject: clickInfo.event.extendedProps.subject, description: clickInfo.event.extendedProps.description, start: new Date(clickInfo.event._instance.range.start.getTime() + new Date().getTimezoneOffset() * 60000), end: new Date(clickInfo.event._instance.range.end.getTime() + new Date().getTimezoneOffset() * 60000) }
      setEvent(schedule);

    }

  }
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

      info.el.style.backgroundColor = 'rgba(26, 9, 51,0.3)'
      if (document.getElementsByClassName('fc-list-day')[0]) document.getElementsByClassName('fc-list-day')[0].classList.remove('fc-list-day');
      if (document.getElementsByClassName('fc-list')[0]) document.getElementsByClassName('fc-list')[0].classList.remove('fc-list');
    } catch (err) { console.log(err); }
  }

  const removeTooltip = (info) => {
    try {
      const tooltips = document.getElementsByClassName('tooltip');
      while (tooltips.length > 0) {
        tooltips[0].parentNode.removeChild(tooltips[0]);
      }
    } catch (err) { console.log(err); }
  }


  return (
    <>
      <Container>
        <Row className="height-50">
          <FullCalendar
            ref={calCustomRef}
            plugins={[CustomViewPlugin, googleCalendarPlugin, iCalendarPlugin]}
            initialView='custom'
            headerToolbar={false}
            googleCalendarApiKey={'AIzaSyChhsubNQqDxtMQTFYNYTkaMvgnHI-Bgvo'}
            eventSources={[
              //{ googleCalendarId: 'lily.meisim@gmail.com', color: 'red', textColor: 'pink', id: 'notion' },
              { googleCalendarId: 'en.malaysia#holiday@group.v.calendar.google.com' },//Malaysia Holiday
              { googleCalendarId: 'p520al5mfgqq5m2a8pu021nv0c@group.calendar.google.com', color: '#00B2A9', textColor: 'white', backgroundColor: '#00B2A9' }, //Liverpool
              //{ googleCalendarId: '4gekf3tjbnuji36gm85a9sicrbt56jv9@import.calendar.google.com', color: 'pink', textColor: 'deeppink' }, //Outlook calendar, probably ms.l, originally ics but cannot import so convert to google calendar
              //{ googleCalendarId: '13h4uict96okp7hnmnq0m28fisn8k15c@import.calendar.google.com', color: 'violet', textColor: 'blue' }, //moodle assignment submission deadline
              {
                url: 'https://stormy-bastion-22629.herokuapp.com/https://outlook.live.com/owa/calendar/f2e5756d-59ee-4c79-b36f-b2c5bf186115/f187ce75-ea44-4841-834b-9d7c21ee588b/cid-3B7E356350CB85DB/calendar.ics',
                format: 'ics',
                color: 'pink',
                textColor: 'deeppink'
              },//Microsoft
              {
                url: '/api/timetable',
                method: 'GET',
                failure: function () {
                  alert('there was an error while fetching events!');
                },
                color: 'mediumseagreen',   // a non-ajax option
                extraParams: {
                  user_id: localStorage.user_id
              },
              },
              {
                url: '/api/notionLog',
                method: 'GET',
                failure: function () {
                  alert('there was an error while fetching events!');
                },
                color: 'red', textColor: 'pink', id: 'notion',
                extraParams: {
                  user_id: localStorage.user_id
              },
              },
              {
                url: 'https://stormy-bastion-22629.herokuapp.com/https://lms2.apiit.edu.my/calendar/export_execute.php?userid=40338&authtoken=493c4503582bbf37a4df8ae70d9c07bd27d8d99e&preset_what=all&preset_time=recentupcoming',
                format: 'ics',
                color: 'violet',
                textColor: 'blue'
              }
            ]}
            height="50vh"

          />
        </Row>
        <Row>
          <Col>
            <FullCalendar
              ref={calBoardRef}
              plugins={[listPlugin, googleCalendarPlugin, iCalendarPlugin]}
              initialView='listDay'
              headerToolbar={false}
              googleCalendarApiKey={'AIzaSyC3WkY3kzoBBWgYb_7dIrLe-JaBbN92nRM'}
              eventDidMount={generateTooltip}
              eventWillUnmount={removeTooltip}
              eventClick={handleEventClick}
              eventSources={[
                //{ googleCalendarId: 'lily.meisim@gmail.com', color: 'red', textColor: 'pink', id: 'notion' },
                { googleCalendarId: 'en.malaysia#holiday@group.v.calendar.google.com' },//Malaysia Holiday
                { googleCalendarId: 'p520al5mfgqq5m2a8pu021nv0c@group.calendar.google.com', color: '#00B2A9', textColor: 'white', backgroundColor: '#00B2A9' }, //Liverpool
                //{ googleCalendarId: '4gekf3tjbnuji36gm85a9sicrbt56jv9@import.calendar.google.com', color: 'pink', textColor: 'deeppink' }, //Outlook calendar, probably ms.l, originally ics but cannot import so convert to google calendar
                //{ googleCalendarId: '13h4uict96okp7hnmnq0m28fisn8k15c@import.calendar.google.com', color: 'violet', textColor: 'blue' }, //moodle assignment submission deadline
                {
                  url: '/api/timetable',
                  method: 'GET',
                  failure: function () {
                    alert('there was an error while fetching events!');
                  },
                  color: 'mediumseagreen',   // a non-ajax option
                  extraParams: {
                    user_id: localStorage.user_id
                },
                },
                {
                  url: 'https://stormy-bastion-22629.herokuapp.com/https://outlook.live.com/owa/calendar/f2e5756d-59ee-4c79-b36f-b2c5bf186115/f187ce75-ea44-4841-834b-9d7c21ee588b/cid-3B7E356350CB85DB/calendar.ics',
                  format: 'ics',
                  color: 'pink',
                  textColor: 'deeppink'
                },//Microsoft
                {
                  url: '/api/notionLog',
                  method: 'GET',
                  failure: function () {
                    alert('there was an error while fetching events!');
                  },
                  color: 'red', textColor: 'pink', id: 'notion',
                  extraParams: {
                    user_id: localStorage.user_id
                },
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
            <NotionBoard refetchCal={() => {
              let calBoardApi = calBoardRef.current.getApi();
              let notionCalBoard = calBoardApi.getEventSourceById('notion')
              notionCalBoard.refetch();

              let calCustomApi = calCustomRef.current.getApi();
              let notionCalCustom = calCustomApi.getEventSourceById('notion')
              notionCalCustom.refetch();
            }} />
          </Col>

        </Row>
      </Container>
      {event && (event.subject||event.subject=="") &&
        < NewEventModal
          onClose={() => { setEvent(null); }}
          onSave={async (we_title, we_desc, we_subject, we_start, we_end) => {
            try {
              const body = { we_title, we_desc, we_subject, we_start, we_end };
              const response = fetch(`/api/notionLog/${event.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken, "user_id": localStorage.user_id },
                body: JSON.stringify(body)
              });
              const status = await response?.status;
              if (status === 200) {
                toast.success("Event successfully modified!")
              }
              setEvent(null);
            } catch (err) {
              console.log(err.message);
            }
          }}

          schedule={event}
        />
      }
      {event && event.location &&
        < NewEventModal
          onClose={() => { setEvent(null); }}
          onSave={async (ce_start, ce_end, ce_desc, ce_location) => {
            try {
              const body = { ce_start, ce_end, ce_desc, ce_location };
              console.log(event);
              const response = fetch(`/api/timetable/${event.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json", "jwt_token": localStorage.token, "rt_token": localStorage.refreshToken, "user_id": localStorage.user_id },
                body: JSON.stringify(body)
              });
              const status = await response?.status;
              if (status === 200) {
                toast.success("Class event successfully modified!")
              }
              setEvent(null);
            } catch (err) {
              console.log(err.message);
            }
          }}

          schedule={event}
        />
      }
      <footer><i>Background vector created by <a href='https://www.freepik.com/vectors/background'>freepik</a></i></footer>
    </>
  );
};


