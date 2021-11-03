import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Redirect } from 'react-router-dom';
import { ProtectedRoute } from './ProtectedRoute';
import { PublicRoute } from './PublicRoute';
import { Calendar } from '../components/calendar/Calendar';
import { CalendarPage } from '../components/calendar/CalendarPage';
import { ChartPanel } from '../components/chart/ChartPanel';
import { RevisionList } from '../components/revision/RevisionList';
import { TaskList } from '../components/task/TaskList';
import { TimeLogList } from '../components/timelog/TimeLogList';
import { Login } from '../components/welcome/Login';
import { Register } from '../components/welcome/Register';
import { Dashboard } from '../components/welcome/Dashboard';

import { toast } from "react-toastify";

toast.configure();

export const AppRouter = () => {

    return (
        <>

            <Router>

                <PublicRoute exact path="/login" component={Login} />
                {/* <PublicRoute exact path="/register" component={Register} /> */}
                <ProtectedRoute exact path="/dashboard" component={Dashboard} />
                <ProtectedRoute exact path="/calendar" component={Calendar} />
                <ProtectedRoute exact path="/chart" component={ChartPanel} />
                <ProtectedRoute exact path="/revision" component={RevisionList} />
                <ProtectedRoute exact path="/task" component={TaskList} />
                <ProtectedRoute exact path="/timelog" component={TimeLogList} />
                {/* <ProtectedRoute component={Calendar} isAuthenticated={isAuthenticated} /> */}
            </Router>
        </>
    );
};