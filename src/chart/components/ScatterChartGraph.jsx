import React from 'react';
import { colourSchemePinkBlue } from './ColourScheme';
import { Scatter } from 'react-chartjs-2';

export const ScatterChartGraph = ({ selectedTimeLog, selectedTask, selectedType }) => {
    var datasets = [];

    var datas = selectedTask.map((tsk) => { return { tsk_id: tsk.tsk_id, tl_dates: [], tl_standby_mins: [], tl_real_mins: [] } });
    var options = {};
    const sortedTimeLog = selectedTimeLog.sort((a, b) => { return new Date(a.tl_date).getTime() - new Date(b.tl_date).getTime() });

    for (var data of datas) {
        for (var tl of sortedTimeLog) {
            if (data.tsk_id === tl.tsk_id) {
                data.tl_standby_mins.push(tl.tl_standby_min);
                data.tl_real_mins.push(tl.tl_real_min);
                data.tl_dates.push(new Date(new Date(tl.tl_date).getTime() - (new Date(tl.tl_date).getTimezoneOffset() * 60000)));
            }
        }
    }

    switch (selectedType) {
        case "total":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataW = [];
                var dataE = [];
                for (var j = 0; j < datas[i].tl_dates.length; j++) {
                    dataW.push({ x: datas[i].tl_dates[j], y: datas[i].tl_standby_mins[j] });
                    dataE.push({ x: datas[i].tl_dates[j], y: datas[i].tl_real_mins[j] });
                }

                datasets.push({
                    label: selectedTask[i].tsk_name + " (Wait Min)",
                    data: dataW,
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
                datasets.push({
                    label: selectedTask[i].tsk_name + " (Exe. Min)",
                    data: dataE,
                    backgroundColor: 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length],
                })
            }
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Task Time Log Total Minutes'
                    },
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return new Date(new Date(context.parsed.x).getTime() - (new Date(context.parsed.x).getTimezoneOffset() * 60000)).toISOString().split("T")[0]+" "+context.dataset.label.split(" (")[0] +" ("+context.parsed.y+" "+context.dataset.label.split(" (")[1];
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function (value) {
                                return new Date(new Date(value).getTime() - (new Date(value).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                            },
                            stepSize: 86400000
                        }
                    },
                }
            };
            break;
        case "waiting":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataW = [];
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
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return new Date(new Date(context.parsed.x).getTime() - (new Date(context.parsed.x).getTimezoneOffset() * 60000)).toISOString().split("T")[0]+" "+context.dataset.label+" ("+context.parsed.y+" mins)" ;
                            }
                        }
                    }

                },
                scales: {
                    x: {
                        ticks: {
                            callback: function (value) {
                                return new Date(new Date(value).getTime() - (new Date(value).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                            },
                            stepSize: 86400000
                        }
                    }
                }
            };
            break;
        case "executing":
            for (var i = 0; i < selectedTask.length; i++) {
                var dataE = [];
                for (var j = 0; j < datas[i].tl_dates.length; j++) {
                    dataE.push({ x: datas[i].tl_dates[j], y: datas[i].tl_real_mins[j] });
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
                    tooltip: {
                        callbacks: {
                            label: function (context) {
                                return new Date(new Date(context.parsed.x).getTime() - (new Date(context.parsed.x).getTimezoneOffset() * 60000)).toISOString().split("T")[0]+" "+context.dataset.label+" ("+context.parsed.y+" mins)" ;
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: {
                            callback: function (value) {
                                return new Date(new Date(value).getTime() - (new Date(value).getTimezoneOffset() * 60000)).toISOString().split('T')[0];
                            },
                            stepSize: 86400000
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