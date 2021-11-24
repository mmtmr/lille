import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { WelcomeBar } from '../components/common/WelcomeBar';

export const PublicRoute = ({ component: Component,isAuthenticated, isLoading, setAuth, ...restOfProps }) => {

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
