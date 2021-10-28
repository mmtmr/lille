import "core-js/stable";
import "regenerator-runtime/runtime";
import React from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import listPlugin from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar'
import iCalendarPlugin from '@fullcalendar/icalendar'
import axios from 'axios'
import "@fortawesome/fontawesome-free/css/all.css"
import { Tooltip } from "bootstrap/dist/js/bootstrap.esm.min.js"

export default class Calendar extends React.Component {

    state = {
        weekendsVisible: true,
        currentEvents: []
    }

    componentDidMount() {
        useTimetable();
    }
    render() {
        // const ce = this.state.timetable;
        // console.log(ce);
        return (
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
                        firstDay={1}
                        selectable={true}
                        selectMirror={true}
                        //select={this.handleDateSelect}
                        eventClick={this.handleEventClick}
                        //eventContent={renderEventContent}
                        weekNumbers={true}
                        weekNumberCalculation={calculateWeekNumber}
                        googleCalendarApiKey={'AIzaSyChhsubNQqDxtMQTFYNYTkaMvgnHI-Bgvo'}
                        eventContent={renderEventContent}
                        eventDidMount={
                            (info) => {
                                var tooltip = new Tooltip(info.el, {
                                    title: '@' + info.event.extendedProps.location + ' by ' + info.event.extendedProps.lecturer,
                                    placement: 'top',
                                    trigger: 'hover',
                                    container: 'body'
                                });
                            }
                        }
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
                            },
                            {
                                url:'https://stormy-bastion-22629.herokuapp.com/https://lms2.apiit.edu.my/calendar/export_execute.php?userid=40338&authtoken=493c4503582bbf37a4df8ae70d9c07bd27d8d99e&preset_what=all&preset_time=recentupcoming',
                                format:'ics',
                                color: 'violet',
                                textColor: 'blue'
                            }

                        ]}


                    />
            

        )
    }
    handleEventClick = (clickInfo) => {

        clickInfo.jsEvent.preventDefault();
        if (clickInfo.event.url) {
            if (confirm(`Are you sure you want to open new tab for the event '${clickInfo.event.title}'?`)) {
                window.open(clickInfo.event.url);
            }
        }

    }
}


function calculateWeekNumber(date) {
    let i = 0;
    let currentTime = date.getTime();
    //const firstAcademicDay = new Date(2021, 5, 7);
    const firstAcademicTime = new Date(2021, 5, 7).getTime();
    for (; currentTime >= firstAcademicTime; i++) {
        currentTime = currentTime - 6.048e+8;
    }
    return i;
}


function useTimetable() {
    function generateURL() {
        const d = new Date(2021, 5, 14);
        const oneMonthFromToday = new Date().setDate(new Date().getDate() + 28);
        const today = new Date();
        var weeks = [];
        for (let i = d; i <= oneMonthFromToday; i.setDate(i.getDate() + 7)) {
            var monday = i;
            //var monday = new Date(2021, 5, 14);
            //monday.setDate(monday.getDate() + 7);
            let day = monday.getDay();
            if (day !== 1)
                monday.setHours(-24 * (day - 1));
            monday.toISOString().slice(0, 10);
            var urlMonth = String(monday.getMonth() + 1).padStart(2, '0');
            var urlDay = String(monday.getDate()).padStart(2, '0');
            var urlYear = monday.getFullYear();
            var urlDate = urlYear + '-' + urlMonth + '-' + urlDay;
            var url = "";
            url = '/api/apuCourse/' + urlDate;
            weeks.push(url);
        }
        return weeks;
    }

    //TODA save all events in json or php whatever in the server
    async function generateTimetable() {
        async function fetchWithTimeout(resource, options) {
            const { timeout = 6000 } = options;

            const controller = new AbortController();
            const id = setTimeout(() => controller.abort(), timeout);

            const response = await axios.post(resource, {
                ...options,
                signal: controller.signal
            });
            clearTimeout(id);
            //console.log("whatever");
            return response;
        }
        const urls = generateURL();

        const resultFilter = (result, error) => result.filter(i => i.status === (!error ? 'fulfilled' : 'rejected')).map(i => (!error ? i.value.config.url : i.reason));
        const result = await Promise.allSettled(urls.map(u => fetchWithTimeout(u, { timeout: 6000 })));
        const weeks = await resultFilter(result); // all fulfilled results
        //const rejected = await resultFilter(result, true); // all rejected results
        const data = await Promise.all(await weeks.map(week => axios.post(week)));
        return data;
    }
    generateTimetable();
    console.log("success generating timetable");
}


function renderEventContent(eventInfo) {
    // function getDt (dt) {
    //     let year = "" + dt.getFullYear();
    //     let month = "" + (dt.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    //     let day = "" + dt.getDate(); if (day.length == 1) { day = "0" + day; }
    //     let hour = "" + dt.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    //     let minute = "" + dt.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    //     let second = "" + dt.getSeconds(); if (second.length == 1) { second = "0" + second; }
    //     return year + "-" + month + "-" + day + " " + hour + ":" + minute + ":" + second;
    //   }
    //   function checkNull(prop){
    //       if (!prop) return '-';
    //       else return prop;
    //   }
    if (eventInfo.event.extendedProps.lecturer && eventInfo.view.type === 'dayGridMonth') {
        return (
            <>
                <b>{eventInfo.timeText}</b> {eventInfo.event.extendedProps.course_code} ({eventInfo.event.extendedProps.course_type})
            </>
        )
        // Alert.alert(
        //     'Event Details',
        //     'Location: '+checkNull(clickInfo.event.extendedProps.location)+'\n'+
        //     'Lecture: '+clickInfo.event.extendedProps.lecturer+'\n'+
        //     'Description:'+checkNull(clickInfo.event.extendedProps.description),
        //     [
        //         { text: "OK", onPress: () => console.log("OK Pressed") }
        //       ]
        // );

    }

}


