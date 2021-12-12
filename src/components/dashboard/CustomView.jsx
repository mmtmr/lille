import React, {useEffect, useState} from 'react';
import { sliceEvents, createPlugin } from '@fullcalendar/react';
import bedroom from '../../../public/bedroom.jpg';
import school_ring from '../../../public/school_ring.mp3';
import { useAudio } from '../../hooks/useAudio';

const CustomView = (props) => {

  const segs = sliceEvents(props, true); // allDay=true
  const [ongoingEvent,setOngoingEvent]=useState([]);
  const [upcomingEvent,setUpcomingEvent]=useState([]);
  const [onTimer,setOnTimer]=useState(0);
  const [upTimer,setUpTimer]=useState(0);
  const [playing, toogle, keepPlaying] = useAudio(school_ring);

  useEffect(() => {
    // if(ongoingEvent.length===0&&upcomingEvent.length===0) {document.body.style.backgroundImage = `url(${bedroom})`;}
    document.body.style.backgroundImage = `url(${bedroom})`;
    const interval = setInterval(() => {
      const onEvents=segs.filter(({def})=>{return !def.allDay}).filter(({range})=> {return (range.end.getTime()-(new Date().getTime()-range.end.getTimezoneOffset() * 60000))>=0&&(range.start.getTime()-(new Date().getTime()-range.start.getTimezoneOffset() * 60000))<=0 }).sort((a,b)=>b.range.end.getTime()-a.range.end.getTime());
      setOngoingEvent(onEvents);

      const upEvents=segs.filter(({def})=>{return !def.allDay}).filter(({range})=> {return (range.end.getTime()-(new Date().getTime()-range.end.getTimezoneOffset() * 60000))>=0&&(range.start.getTime()-(new Date().getTime()-range.start.getTimezoneOffset() * 60000))>0 }).sort((a,b)=>a.range.start.getTime()-b.range.start.getTime());
      setUpcomingEvent(upEvents);

      if(onEvents.length>0){
        setOnTimer(onEvents[0].range.end.getTime()-(new Date().getTime()-onEvents[0].range.end.getTimezoneOffset() * 60000));
      }
      if(upEvents.length>0){
        const countdown=upEvents[0].range.start.getTime()-(new Date().getTime()-upEvents[0].range.start.getTimezoneOffset() * 60000);
        setUpTimer(countdown);
        if(countdown<=1800000&&countdown>1790000){
          keepPlaying();
        }else if(countdown<=60000&&countdown>50000){
          keepPlaying();
        }
      }
    }, 10000);//refresh every 10 seconds


    return () => clearInterval(interval);
  }, [segs])
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
        {
          ongoingEvent.length>0&&
          ongoingEvent.map((eve, i)=>{
            if(i==0) return eve.def.title;
            else return " "+eve.def.title
            })+" ongoing w/"+Math.floor(onTimer/60000)+" min left"
        }
        {
          ongoingEvent.length>0&&
          upcomingEvent.length>0&&
          upTimer<=1800000&&
          `\n\n`+upcomingEvent[0].def.title+" upcoming in "+Math.floor(upTimer/60000)+" min"
        } 
        {ongoingEvent.length===0&&upcomingEvent.length>0&&upcomingEvent[0].def.title+" upcoming in "+Math.floor(upTimer/60000)+" min"} 
        {upcomingEvent.length===0&&ongoingEvent.length===0&&"No more events for the day"} 
      </div>
    </>
  );

}

export default createPlugin({
  views: {
    custom: CustomView
  }
});