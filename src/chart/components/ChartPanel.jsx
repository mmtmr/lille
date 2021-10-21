import React, { useState, useEffect } from 'react';
import Container from 'react-bootstrap/Container'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import Tabs from 'react-bootstrap/Tabs'
import Tab from 'react-bootstrap/Tab'
import { useFetch } from './hooks/useFetch';

import 'bootswatch/dist/vapor/bootstrap.min.css'
import '../chart.css';

import { BarChartForm } from './BarChartForm';
import { BarChartGraph } from './BarChartGraph';
import { LineChartForm } from './LineChartForm';
import { LineChartGraph } from './LineChartGraph';
import { ScatterChartForm } from './ScatterChartForm';
import { ScatterChartGraph } from './ScatterChartGraph';
import { PieChartForm } from './PieChartForm';
import { PieChartGraph } from './PieChartGraph';
import { BoxPlotForm } from './BoxPlotForm';
import { BoxPlotGraph } from './BoxPlotGraph';
import { defaults } from 'react-chartjs-2';
defaults.aspectRatio = 1.5;
defaults.responsive = true;

export const ChartPanel = () => {
    const [barChart, setBarChart] = useState(); //Compare Between Multiple Tasks
    const [lineChart, setLineChart] = useState(); //Compare Between Multiple Subtask
    const [scatterChart, setScatterChart] = useState(); //Task Over Time with no RegressionLine
    const [pieChart, setPieChart] = useState(); //Daily Overview
    const [boxPlot, setBoxPlot] = useState(); //Compare between Multiple Task or Multiple Subtask
    const [heatMap, setHeatMap] = useState(); //Frequency of Subtask
    const [selectedTask, setSelectedTask] = useState();
    const [selectedSubtask, setSelectedSubtask] = useState();
    const [selectedTimeLog, setSelectedTimeLog] = useState();

    const log = useFetch("/api/timelog");
    const task = useFetch("/api/task");

    const handleSelect = () => { setSelectedTask(); setSelectedSubtask(); setSelectedTimeLog(); setBarChart(); setLineChart(); setScatterChart(); setPieChart(); setBoxPlot();};

    useEffect(() => {
        var chart=null;
        if (barChart) {
            chart = barChart;
        } else if (scatterChart) {
            chart = scatterChart;
        } else if (boxPlot) {
            chart = boxPlot;
        }
        if (chart) {
            const filterTask = chart.tsk_ids.map((tsk_id) => { return task.find(tsk => { return tsk.tsk_id === parseInt(tsk_id) }); })
            setSelectedTask(filterTask);
            const filterTimeLog = chart.tsk_ids.map((tsk_id) => { return log.filter(tl => { return tl.tsk_id === parseInt(tsk_id) }); }).flat().filter((tl) => {
                return new Date(new Date(tl.tl_date) - new Date(tl.tl_date).getTimezoneOffset() * 60000).getTime() >= new Date(new Date(chart.start) - new Date(chart.start).getTimezoneOffset() * 60000).getTime() &&
                    new Date(new Date(tl.tl_date) - new Date(tl.tl_date).getTimezoneOffset() * 60000).getTime() <= new Date(new Date(chart.end) - new Date(chart.end).getTimezoneOffset() * 60000).getTime()
            })
            setSelectedTimeLog(filterTimeLog);
        }
    }, [barChart, scatterChart, boxPlot]);

    useEffect(() => {
        if (lineChart) {
            const filterTask = task.find((tsk) => { return tsk.tsk_id === lineChart.tsk_id });
            setSelectedTask(filterTask);

            var filterSubtask = lineChart.st_ids.map((st_id) => { return filterTask.subtask.find(st => { return st.st_id === parseInt(st_id) }); }).filter(st => { return st !== undefined })

            //var filterTimeLog = lineChart.st_ids.map((st_id) => { return log.filter(lg => { return lg.subtask.find(st => { return st.st_id === parseInt(st_id) }); }) }).flat().filter(tl => { return tl !== undefined }).filter((v,i,a)=>a.findIndex(t=>(t.st_id === v.st_id))===i)
            var filterTimeLog=log.filter(lg=>{return lg.subtask.some(st=> lineChart.st_ids.includes(st.st_id))}).flat().filter(tl => { return tl !== undefined });

            if (lineChart.st_ids.includes(0)) {
                filterSubtask.push({ st_id: 0, st_name: "None" });
                filterTimeLog.push(...log.filter(lg => { return lg.subtask.length === 0 && lg.tsk_id === lineChart.tsk_id }));
            }

            filterTimeLog = filterTimeLog.filter(tl => {
                return new Date(new Date(tl.tl_date) - new Date(tl.tl_date).getTimezoneOffset() * 60000).getTime() >= new Date(new Date(lineChart.start) - new Date(lineChart.start).getTimezoneOffset() * 60000).getTime() &&
                    new Date(new Date(tl.tl_date) - new Date(tl.tl_date).getTimezoneOffset() * 60000).getTime() <= new Date(new Date(lineChart.end) - new Date(lineChart.end).getTimezoneOffset() * 60000).getTime()
            });

            setSelectedSubtask(filterSubtask);
            setSelectedTimeLog(filterTimeLog);

        }

    }, [lineChart]);

    useEffect(() => {
        if (pieChart) {
            const filterTimeLog = log.filter(tl => { return new Date(new Date(tl.tl_date) - new Date(tl.tl_date).getTimezoneOffset() * 60000).toLocaleDateString() === new Date(new Date(pieChart.tl_date) - new Date(pieChart.tl_date).getTimezoneOffset() * 60000).toLocaleDateString() }).filter(tl => { return tl !== undefined })
            setSelectedTimeLog(filterTimeLog);
        }

    }, [pieChart]);
    return (
        <>
            <Container className="full-height">
                <Row>
                    <Col xs={3}>
                        <Tabs defaultActiveKey="bar" onSelect={handleSelect}>
                            <Tab eventKey="bar" title="Bar" >
                                <BarChartForm
                                    task={task}
                                    onSubmit={(selectedType, selectedTaskID, startDate, endDate) => setBarChart({ type: selectedType, tsk_ids: selectedTaskID, start: startDate, end: endDate })} />
                            </Tab>
                            <Tab eventKey="line" title="Line" >
                                <LineChartForm
                                    task={task}
                                    onSubmit={(selectedType, selectedTaskID, selectedSubtaskID, startDate, endDate) => setLineChart({ type: selectedType, tsk_id: selectedTaskID, st_ids: selectedSubtaskID, start: startDate, end: endDate })} />
                            </Tab>
                            <Tab eventKey="scatter" title="Scatter" >
                                <ScatterChartForm
                                    task={task}
                                    onSubmit={(selectedType, selectedTaskID, startDate, endDate) => setScatterChart({ type: selectedType, tsk_ids: selectedTaskID, start: startDate, end: endDate })} />
                            </Tab>
                            <Tab eventKey="pie" title="Pie" >
                                <PieChartForm
                                    onSubmit={(date) => setPieChart({ tl_date: date })} />
                            </Tab>
                            <Tab eventKey="box" title="Box" >
                                <BoxPlotForm
                                    task={task}
                                    onSubmit={(selectedType, selectedTaskID, startDate, endDate) => setBoxPlot({ type: selectedType, tsk_ids: selectedTaskID, start: startDate, end: endDate })} />
                            </Tab>
                        </Tabs>
                    </Col>
                    <Col xs={2} />
                    <Col>
                        <br />

                        {
                            barChart &&
                            selectedTask &&
                            selectedTimeLog &&
                            <BarChartGraph
                                selectedTimeLog={selectedTimeLog}
                                selectedTask={selectedTask}
                                selectedType={barChart.type}
                            />
                        }

                        {
                            lineChart &&
                            selectedSubtask &&
                            selectedTask &&
                            selectedTimeLog &&
                            <LineChartGraph
                                selectedTimeLog={selectedTimeLog}
                                selectedSubtask={selectedSubtask}
                                selectedType={lineChart.type}
                            />
                        }


                        {
                            scatterChart &&
                            selectedTask &&
                            selectedTimeLog &&
                            <ScatterChartGraph
                                selectedTimeLog={selectedTimeLog}
                                selectedTask={selectedTask}
                                selectedType={scatterChart.type}
                            />
                        }
                        {
                            pieChart &&
                            selectedTimeLog &&
                            <PieChartGraph
                                selectedTimeLog={selectedTimeLog}
                            />
                        }
                        {
                            boxPlot &&
                            selectedTask &&
                            selectedTimeLog &&
                            <BoxPlotGraph
                                selectedTimeLog={selectedTimeLog}
                                selectedTask={selectedTask}
                                selectedType={boxPlot.type}
                            />
                        }

                    </Col>
                </Row>
            </Container>
        </>

    );

};