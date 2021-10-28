import React from 'react';
import { colourSchemePinkBlue } from '../../lib/color/ColourScheme';
import { Line } from 'react-chartjs-2';

export const LineChartGraph = ({ selectedTimeLog, selectedSubtask, selectedType }) => {
    var datasets = [];
    var datas = selectedSubtask.map((st) => { return { st_id: st.st_id, tl_standby_mins: [], tl_real_mins: [] } });
    var options = {};
    const sortedTimeLog = selectedTimeLog.sort((a, b) => { return new Date(a.tl_date).getTime() - new Date(b.tl_date).getTime() });
    const labels = sortedTimeLog.map((tl) => { return new Date(new Date(tl.tl_date).getTime() - (new Date(tl.tl_date).getTimezoneOffset() * 60000)).toISOString().split('T')[0] });

    for (var tl of sortedTimeLog) {
        for (var data of datas) {
            if (data.st_id === 0 && tl.st_ids.length === 0) {
                data.tl_standby_mins.push(tl.tl_standby_min);
                data.tl_real_mins.push(tl.tl_real_min);
            } else if (data.st_id === 0 && tl.st_ids.length !== 0) {
                data.tl_standby_mins.push(null);
                data.tl_real_mins.push(null);
            } else if (data.st_id !== 0 && tl.st_ids.length === 0) {
                data.tl_standby_mins.push(null);
                data.tl_real_mins.push(null);
            } else {
                for (var st_id of tl.st_ids) {
                    if (data.st_id === st_id) {
                        data.tl_standby_mins.push(tl.tl_standby_min);
                        data.tl_real_mins.push(tl.tl_real_min);
                    }
                }
            }
        }
    }

    console.log(datas);


    switch (selectedType) {
        case "total":
            for (var i = 0; i < selectedSubtask.length; i++) {
                datasets.push({
                    label: selectedSubtask[i].st_name + " Waiting Minutes",
                    data: datas[i].tl_standby_mins,
                    borderColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length],
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
                datasets.push({
                    label: selectedSubtask[i].st_name + " Executing Minutes",
                    data: datas[i].tl_real_mins,
                    borderColor: 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length],
                    backgroundColor: 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length],
                })
            };
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Subtask Time Log Total Minutes',
                    }
                },
            };
            break;
        case "waiting":
            for (var i = 0; i < selectedSubtask.length; i++) {
                datasets.push({
                    label: selectedSubtask[i].st_name,
                    data: datas[i].tl_standby_mins,
                    borderColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length],
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Subtask Time Log Waiting Minutes',
                    }
                },
            };
            break;
        case "executing":
            for (var i = 0; i < selectedSubtask.length; i++) {
                datasets.push({
                    label: selectedSubtask[i].st_name,
                    data: datas[i].tl_real_mins,
                    borderColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length],
                    backgroundColor: 2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], //Double the colour scheme options
                })
            };
            options = {
                plugins: {
                    title: {
                        display: true,
                        text: 'Subtask Time Log Executing Minutes',
                    }
                },
            };
            break;
    }


    return (
        <Line data={{ labels: labels, datasets: datasets }} options={options} />
    );
}