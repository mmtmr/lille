import React from 'react';
import { colourSchemePinkBlue } from './ColourScheme';
import { Scatter } from 'react-chartjs-2';

export const ScatterChartGraph = ({ selectedTimeLog, selectedTask, selectedType }) => {
    var datasets = [];

    var datas = selectedTask.map((tsk) => { return { tsk_id: tsk.tsk_id, tl_dates: [], tl_standby_mins: [], tl_real_mins: [] } });
    var options = {};
    const sortedTimeLog = selectedTimeLog.sort((a, b) => { return new Date(a.tl_date).getTime() - new Date(b.tl_date).getTime() });

    for (var tl of sortedTimeLog) {
        for (var i = 0; i < datas.length; i++) {
            datas[i].tl_dates.push(new Date(new Date(tl.tl_date).getTime() - (new Date(tl.tl_date).getTimezoneOffset() * 60000)));
            if (datas[i].tsk_id === tl.tsk_id) {
                datas[i].tl_standby_mins.push(tl.tl_standby_min);
                datas[i].tl_real_mins.push(tl.tl_real_min);

            } else {
                datas[i].tl_standby_mins.push(0);
                datas[i].tl_real_mins.push(0);
            }
            console.log(datas[i]);
        }
    }

    switch (selectedType) {
        case "total":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataW=[];
                var dataE=[];
                for (var j = 0; j < datas[i].tl_dates.length; j++) {
                   dataW.push({ x: datas[i].tl_dates[j], y: datas[i].tl_standby_mins[j] });
                   dataE.push ({ x: datas[i].tl_dates[j], y: datas[i].tl_standby_mins[j] });
                }

                datasets.push({
                    label: selectedTask[i].tsk_name + " Waiting Minutes",
                    data: dataW,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                    stack: selectedTask[i].tsk_id
                })
                datasets.push({
                    label: selectedTask[i].tsk_name + " Executing Minutes",
                    data: dataE,
                    backgroundColor: 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length],
                    stack: selectedTask[i].tsk_id
                })
            }
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Time Log Total Minutes'
                    },
                },
                scales: {
                    x: {
                        stacked: true,
                        ticks: {
                            callback: function(value) {
                                return new Date(value).toISOString().split('T')[0];
                            }
                        }
                    },
                    y: {
                        stacked: true
                    }
                }
            };
            break;
        case "waiting":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataW=[];
                for (var j = 0; j < datas[i].tl_dates.length; j++) {
                   dataW.push({ x: datas[i].tl_dates[j], y: datas[i].tl_standby_mins[j] });
                }
                datasets.push({
                    label: selectedTask[i].tsk_name,
                    data: dataW,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Time Log Waiting Minutes'
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function(value) {
                                return new Date(value).toISOString().split('T')[0];
                            }
                        }
                    }
                }
            };
            break;
        case "executing":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataE=[];
                for (var j = 0; j < datas[i].tl_dates.length; j++) {
                   dataE.push ({ x: datas[i].tl_dates[j], y: datas[i].tl_standby_mins[j] });
                }
                datasets.push({
                    label: selectedTask[i].tsk_name,
                    data: dataE,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Time Log Executing Minutes'
                    },
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function(value) {
                                return new Date(value).toISOString().split('T')[0];
                            }
                        }
                    }
                }
            };
            break;

    }

    console.log(datasets);
    return (
        <Scatter data={{ datasets: datasets }} options={options} />
    );
}