import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { WelcomeBar } from '../components/common/WelcomeBar';

export const PublicRoute = ({ component: Component, ...restOfProps }) => {

    const checkAuthenticated = async () => {
        try {
            const res = await fetch("/auth/verify", {
                method: "POST",
                headers: { jwt_token: localStorage.token }
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
        <Route
            {...restOfProps}
            render={(props) =>
                !isAuthenticated ?
                    <>
                        <WelcomeBar />
                        <Component {...props} setAuth={setAuth} />
                    </>
                    : (isLoading ? 'Loading...' : <Redirect to="/calendar" />)
            }
        />
    );
}
