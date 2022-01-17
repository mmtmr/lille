import "core-js/stable";
import "regenerator-runtime/runtime";
import React, { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import iCalendarPlugin from '@fullcalendar/icalendar'
import "@fortawesome/fontawesome-free/css/all.css"
import { Tooltip } from "bootstrap/dist/js/bootstrap.esm.min.js"
import { NewEventModal } from '../dashboard/NewEventModal';
import { useFetch } from '../../hooks/useFetch';

export const Calendar = () => {
    const [event, setEvent] = useState();
    // const [eventSources]
    const googleCalendarApiKey = useFetch('/api/option/opt_google_api_key');
    const handleEventClick = (clickInfo) => {
        clickInfo.jsEvent.preventDefault();
        // console.log(clickInfo.event);
        if (clickInfo.event.url) {
            if (confirm(`Are you sure you want to open new tab for the event '${clickInfo.event.title}'?`)) {
                window.open(clickInfo.event.url);
            }
        } else if (clickInfo.event.extendedProps.lecturer) {
            var schedule = { id: clickInfo.event._def.publicId, location: clickInfo.event.extendedProps.location, description: clickInfo.event.extendedProps.description, start: new Date(clickInfo.event._instance.range.start.getTime() + new Date().getTimezoneOffset() * 60000), end: new Date(clickInfo.event._instance.range.end.getTime() + new Date().getTimezoneOffset() * 60000) }
            setEvent(schedule);
        } else if (clickInfo.event.extendedProps.subject) {
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

    //TODO customized calendar
    return (
        <>
            <FullCalendar

                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, listPlugin, googleCalendarPlugin, iCalendarPlugin]}
                headerToolbar={{
                    left: 'title',
                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                    right: 'prev,next,today'
                }}
                initialView='dayGridMonth'
                buttonText={{
                    listYear: 'year',
                    listMonth: 'month',
                    listWeek: 'week',
                    listDay: 'day'
                }}
                footerToolbar={{
                    center: 'listYear,listMonth,listWeek,listDay'
                }}
                nowIndicator={true}
                firstDay={1}
                selectable={true}
                selectMirror={true}
                //select={this.handleDateSelect}
                eventClick={handleEventClick}
                //eventContent={renderEventContent}
                weekNumbers={true}
                weekNumberCalculation={calculateWeekNumber}
                googleCalendarApiKey={googleCalendarApiKey}
                eventContent={renderEventContent}
                eventDidMount={generateTooltip}
                eventWillUnmount={removeTooltip}
                eventSources={[
                    { googleCalendarId: 'en.malaysia#holiday@group.v.calendar.google.com' },//Malaysia Holiday
                    //{ googleCalendarId: 'lily.meisim@gmail.com', color: 'red', textColor: 'pink' },
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
                        url: 'api/timetable',
                        method: 'GET',
                        beforeSend: function (xhr) {
                            var headers = [{ "Content-Type": "application/json" }, { "jwt_token": localStorage.token }, { "rt_token": localStorage.refreshToken }, { "user_id": localStorage.user_id }];
                            for (var i in headers) xhr.setRequestHeader(i, headers[i]);
                        },
                        extraParams: {
                            user_id: localStorage.user_id
                        },
                        failure: function () {
                            alert('there was an error while fetching events!');
                        },
                        color: 'mediumseagreen',   // a non-ajax option
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


            />
            {event && event.subject &&
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
        </>

    )
}


const calculateWeekNumber = (date) => {
    let i = 0;
    let currentTime = date.getTime();
    //const firstAcademicDay = new Date(2021, 5, 7);
    const firstAcademicTime = new Date(2021, 10, 8).getTime();
    for (; currentTime >= firstAcademicTime; i++) {
        currentTime = currentTime - 6.048e+8;
    }
    return i;
}


// const useTimetable = () => {
//     function generateURL() {
//         const d = new Date(2021, 5, 14);
//         const oneMonthFromToday = new Date().setDate(new Date().getDate() + 28);
//         const today = new Date();
//         var weeks = [];
//         for (let i = d; i <= oneMonthFromToday; i.setDate(i.getDate() + 7)) {
//             var monday = i;
//             //var monday = new Date(2021, 5, 14);
//             //monday.setDate(monday.getDate() + 7);
//             let day = monday.getDay();
//             if (day !== 1)
//                 monday.setHours(-24 * (day - 1));
//             monday.toISOString().slice(0, 10);
//             var urlMonth = String(monday.getMonth() + 1).padStart(2, '0');
//             var urlDay = String(monday.getDate()).padStart(2, '0');
//             var urlYear = monday.getFullYear();
//             var urlDate = urlYear + '-' + urlMonth + '-' + urlDay;
//             var url = "";
//             url = '/api/apuCourse/' + urlDate;
//             weeks.push(url);
//         }
//         return weeks;
//     }

//     //TODA save all events in json or php whatever in the server
//     async function generateTimetable() {
//         async function fetchWithTimeout(resource, options) {
//             const { timeout = 6000 } = options;

//             const controller = new AbortController();
//             const id = setTimeout(() => controller.abort(), timeout);

//             const response = await axios.post(resource,null, {
//                 ...options,
//                 signal: controller.signal,
//                 headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken } 
//             });
//             clearTimeout(id);
//             //console.log("whatever");
//             return response;
//         }
//         const urls = generateURL();

//         const resultFilter = (result, error) => result.filter(i => i.status === (!error ? 'fulfilled' : 'rejected')).map(i => (!error ? i.value.config.url : i.reason));
//         const result = await Promise.allSettled(urls.map(u => fetchWithTimeout(u, { timeout: 6000 })));
//         const weeks = await resultFilter(result); // all fulfilled results
//         //const rejected = await resultFilter(result, true); // all rejected results
//         const data = await Promise.all(await weeks.map(week => axios.post(week,null, { headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken } })));
//         return data;
//     }
//     generateTimetable();
//     console.log("success generating timetable");
// }


const renderEventContent = (eventInfo) => {
    if (eventInfo.event.extendedProps.lecturer && eventInfo.view.type === 'dayGridMonth') {
        return (
            <>
                <b>{eventInfo.timeText}</b> {eventInfo.event.extendedProps.course_code} ({eventInfo.event.extendedProps.course_type})
            </>
        )

    }

}


