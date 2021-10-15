import React from 'react';
import {colourSchemePinkBlue} from './ColourScheme';
import { Bar } from 'react-chartjs-2';

export const BarChartGraph = ({ selectedTimeLog, selectedTask, selectedType }) => {
    var datasets = [];
    
    var datas = selectedTask.map((tsk) => { return { tsk_id: tsk.tsk_id, tl_standby_mins: [], tl_real_mins: [] } });
    var options={};
    const sortedTimeLog=selectedTimeLog.sort((a,b)=>{return new Date(a.tl_date).getTime()-new Date(b.tl_date).getTime()});
    const sortedDate=sortedTimeLog.map((tl)=>{return new Date(new Date(tl.tl_date).getTime() - (new Date(tl.tl_date).getTimezoneOffset() * 60000)).toISOString().split('T')[0]});
    const labels = [...new Set(sortedDate)];
    for (var tl of sortedTimeLog) {
        for (var data of datas) {
            if (data.tsk_id === tl.tsk_id) {
                data.tl_standby_mins.push(tl.tl_standby_min);
                data.tl_real_mins.push(tl.tl_real_min);
                
            }else{
                data.tl_standby_mins.push(0);
                data.tl_real_mins.push(0);
            }
            console.log(data);
        }
    }

    switch (selectedType) {
        case "total":
            for (var i = 0; i < selectedTask.length; i++) {
                datasets.push({
                    label: selectedTask[i].tsk_name + " Waiting Minutes",
                    data: datas[i].tl_standby_mins,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                    stack: selectedTask[i].tsk_id
                })
                datasets.push({
                    label: selectedTask[i].tsk_name + " Executing Minutes",
                    data: datas[i].tl_real_mins,
                    backgroundColor: 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length],
                    stack: selectedTask[i].tsk_id
                })
            };
            options = {
                plugins:{
                    title: {
                        display: true,
                        text: 'Task Time Log Total Minutes'
                    },
                },                
                scales: {
                    x: {
                        stacked: true,
                    },
                    y: {
                        stacked: true
                    }
                }
            };
            break;
        case "waiting":
            for (var i = 0; i < selectedTask.length; i++) {
                datasets.push({
                    label: selectedTask[i].tsk_name,
                    data: datas[i].tl_standby_mins,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins:{
                    title: {
                        display: true,
                        text: 'Task Time Log Waiting Minutes'
                    },
                },  
            };
            break;
        case "executing":
            for (var i = 0; i < selectedTask.length; i++) {
                datasets.push({
                    label: selectedTask[i].tsk_name,
                    data: datas[i].tl_real_mins,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins:{
                    title: {
                        display: true,
                        text: 'Task Time Log Executing Minutes'
                    },
                },  
            };
            break;
    }


    return (
        <Bar data={{ labels: labels, datasets: datasets }} options={options} />
    );
}