import React from 'react';
import { colourSchemePinkBlue } from '../../lib/color/ColourScheme';
import Plot from 'react-plotly.js';

export const BoxPlotGraph = ({ selectedTimeLog, selectedTask, selectedType }) => {
    var datasets = [];

    var datas = selectedTask.map((tsk) => { return { tsk_id: tsk.tsk_id, tl_standby_mins: [], tl_real_mins: [] } });
    var layout = {};

    for (var tl of selectedTimeLog) {
        for (var data of datas) {
            if (data.tsk_id === tl.tsk_id) {
                data.tl_standby_mins.push(tl.tl_standby_min);
                data.tl_real_mins.push(tl.tl_real_min);

            } else {
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
                    name: selectedTask[i].tsk_name,
                    x: [...datas[i].tl_standby_mins.map(d => { return "Waiting" }), ...datas[i].tl_real_mins.map(d => { return "Executing" })],
                    y: [...datas[i].tl_standby_mins, ...datas[i].tl_real_mins],
                    marker: { color: i < colourSchemePinkBlue.length ? colourSchemePinkBlue[i] : colourSchemePinkBlue[i - colourSchemePinkBlue.length]}, //Double the colour scheme layout
                    boxpoints: 'all',
                    jitter: 0.3,
                    pointpos: -1.8,
                    type: 'box'
                })
            };
            layout = {
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font:{color:'rgb(50, 251, 226)'},
                title: 'Task Time Log Total Minutes',
                yaxis: {
                    zeroline: false
                },
               
                boxmode: 'group'
            };
            break;
        case "waiting":
            for (var i = 0; i < selectedTask.length; i++) {
                datasets.push({
                    name: selectedTask[i].tsk_name,
                    y: datas[i].tl_standby_mins,
                    marker: { color: i < colourSchemePinkBlue.length ? colourSchemePinkBlue[i] : colourSchemePinkBlue[i - colourSchemePinkBlue.length] }, //Double the colour scheme layout
                    boxpoints: 'all',
                    jitter: 0.3,
                    pointpos: -1.8,
                    type: 'box'
                })
            };
            layout = {
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font:{color:'rgb(50, 251, 226)'},
                title: 'Task Time Log Waiting Minutes'
            };
            break;
        case "executing":
            for (var i = 0; i < selectedTask.length; i++) {
                datasets.push({
                    name: selectedTask[i].tsk_name,
                    y: datas[i].tl_real_mins,
                    marker: { color: i < colourSchemePinkBlue.length ? colourSchemePinkBlue[i] : colourSchemePinkBlue[i - colourSchemePinkBlue.length] }, //Double the colour scheme layout
                    boxpoints: 'all',
                    jitter: 0.3,
                    pointpos: -1.8,
                    type: 'box'
                })
            };
            layout = {
                paper_bgcolor: 'rgba(0,0,0,0)',
                plot_bgcolor: 'rgba(0,0,0,0)',
                font:{color:'rgb(50, 251, 226)'},
                title: 'Task Time Log Executing Minutes'
            };
            break;
    }


    return (
        <Plot data={datasets} layout={layout} />
    );
}