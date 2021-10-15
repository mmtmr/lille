import React, { useRef, useEffect } from 'react';
import { colourSchemePinkBlue } from './ColourScheme';
import { Pie, Chart } from 'react-chartjs-2';

export const PieChartGraph = ({ selectedTimeLog }) => {

    const chartRef = useRef(null);



    var datasets = [];
    var labels = [];
    var datas = selectedTimeLog.map((tl) => { return { tsk_id: tl.tsk_id, tl_standby_min: tl.tl_standby_min, tl_real_min: tl.tl_real_min, tsk_name: tl.task.tsk_name, st_names: tl.subtask.map(st => { return st.st_name }).flat() } });

    for (var i = 0; i < datas.length; i++) {
        labels.push(datas[i].tsk_name + " (Executing)");
        labels.push(datas[i].tsk_name + " (Waiting)");
        datasets.push({
            backgroundColor: [2 * i < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i] : colourSchemePinkBlue[2 * i - colourSchemePinkBlue.length], 2 * i + 1 < colourSchemePinkBlue.length ? colourSchemePinkBlue[2 * i + 1] : colourSchemePinkBlue[2 * i + 1 - colourSchemePinkBlue.length]],
            data: [datas[i].tl_real_min, datas[i].tl_standby_min],
            subtasks: [datas[i].st_names]
        })
    }

    if (chartRef.current) {
        if (chartRef.current.chart) {
            console.log(chartRef.current.chart);
            chartRef.current.chart.destroy();
        }
    }

    //https://codesandbox.io/s/dazzling-flower-211p2?file=/src/MyChart.js
    var options = {
        plugins: {
            legend: {
                labels: {
                    generateLabels: chart => {
                        // Get the default label list
                        const original = Chart.overrides.pie.plugins.legend.labels.generateLabels;
                        const labelsOriginal = original.call(this, chart);

                        // Build an array of colors used in the datasets of the chart
                        var datasetColors = chart.data.datasets.map(function (e) {
                            return e.backgroundColor;
                        });
                        datasetColors = datasetColors.flat();

                        // Modify the color and hide state of each label
                        labelsOriginal.forEach(label => {
                            // There are twice as many labels as there are datasets. This converts the label index into the corresponding dataset index
                            label.datasetIndex = (label.index - label.index % 2) / 2;

                            // The hidden state must match the dataset's hidden state
                            label.hidden = !chart.isDatasetVisible(label.datasetIndex);

                            // Change the color to match the dataset
                            label.fillStyle = datasetColors[label.index];
                        });

                        return labelsOriginal;
                    }
                },
                onClick: (mouseEvent, legendItem, legend) => {
                    // toggle the visibility of the dataset from what it currently is
                    legend.chart.getDatasetMeta(
                        legendItem.datasetIndex
                    ).hidden = legend.chart.isDatasetVisible(legendItem.datasetIndex);
                    legend.chart.update();
                }

            },
            tooltip: {
                callbacks: {
                    label: (context) => {
                        const labelIndex = (context.datasetIndex * 2) + context.dataIndex;
                        const subtaskName = context.chart.data.datasets[context.datasetIndex].subtasks.join().replace(/,/g, ", ");;
                        return subtaskName ? context.chart.data.labels[labelIndex] + " w/ " + subtaskName + " : " + context.formattedValue + "min" : context.chart.data.labels[labelIndex] + " : " + context.formattedValue + "min";
                    }
                }
            }
        }

    }


    return (
        <Pie ref={chartRef} data={{ labels: labels, datasets: datasets }} options={options} redraw={true} />
    );
}