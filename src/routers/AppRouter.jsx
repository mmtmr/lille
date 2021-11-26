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
import { Login } from '../components/access/Login';
import { Register } from '../components/access/Register';
import { Dashboard } from '../components/dashboard/Dashboard';

import { toast } from "react-toastify";

toast.configure();

export const AppRouter = () => {

    const checkAuthenticated = async () => {
        try {
            const res = await fetch("/auth/verify", {
                method: "POST",
                headers: { jwt_token: localStorage.token, rt_token: localStorage.refreshToken }
            });
            const success = res.ok;
            return success;
        } catch (err) {
            console.error(err.message);
        }
    };

    useEffect(() => {
        checkAuthenticated()
            .then(success => {
                console.log(success);
                setIsAuthenticated(success);
                setIsLoading(false);
            })
    }, []);

    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const setAuth = boolean => {
        setIsAuthenticated(boolean);
    };

    return (
        <>

            <Router>
                <PublicRoute exact path="/login" component={Login} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                {/* <PublicRoute exact path="/register" component={Register} /> */}
                <ProtectedRoute exact path="/" component={Dashboard} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                <ProtectedRoute exact path="/calendar" component={Calendar} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                <ProtectedRoute exact path="/chart" component={ChartPanel} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                <ProtectedRoute exact path="/revision" component={RevisionList} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                <ProtectedRoute exact path="/task" component={TaskList} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                <ProtectedRoute exact path="/timelog" component={TimeLogList} isAuthenticated={isAuthenticated} isLoading={isLoading} setAuth={setAuth}/>
                {/* <ProtectedRoute component={Calendar} isAuthenticated={isAuthenticated} /> */}
            </Router>
        </>
    );
};