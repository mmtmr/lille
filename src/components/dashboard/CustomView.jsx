import React, {useEffect, useState} from 'react';
import { sliceEvents, createPlugin } from '@fullcalendar/react';
import bedroom from '../../../public/bedroom.jpg';

const CustomView = (props) => {

  const segs = sliceEvents(props, true); // allDay=true
  const ongoingEvent=segs.find(({range})=> {return (range.end.getTime()-(new Date().getTime()-range.end.getTimezoneOffset() * 60000))>=0&&(range.start.getTime()-(new Date().getTime()-range.start.getTimezoneOffset() * 60000))<=0 });
  const upcomingEvent=segs.find(({range})=> {return (range.end.getTime()-(new Date().getTime()-range.end.getTimezoneOffset() * 60000))>=0&&(range.start.getTime()-(new Date().getTime()-range.start.getTimezoneOffset() * 60000))>0 });

  useEffect(() => {
    if(!ongoingEvent&&!upcomingEvent) {document.body.style.backgroundImage = `url(${bedroom})`;}
  }, [upcomingEvent,ongoingEvent])
  // getPosition = () => {
  //   return new Promise(function (resolve, reject) {
  //     navigator.geolocation.getCurrentPosition(resolve, reject);
  //   });    
  // }
  return (
    <>
      {/* <h1>
        {props.dateProfile.currentRange.start.toUTCString()}
      </h1> */}
      <div className="center display-4">
        {ongoingEvent&&ongoingEvent.def.title+" ongoing"} 
        {!ongoingEvent&&upcomingEvent&&upcomingEvent.def.title+" upcoming"} 
        {!upcomingEvent&&!ongoingEvent&&"No more events for the day"} 
      </div>
    </>
  );

}

export default createPlugin({
  views: {
    custom: CustomView
  }
});