import React, { useState, useEffect } from "react";
import { Redirect, Route } from "react-router-dom";
import { NavBar } from '../components/common/NavBar';

export const ProtectedRoute = ({ component: Component, isAuthenticated, isLoading, setAuth, ...restOfProps }) => {
    return (
            <Route
                {...restOfProps}
                render={(props) => isAuthenticated ?
                    <>
                        <NavBar setAuth={setAuth} />
                        <Component {...props} />
                    </>
                    : (isLoading ? 'Loading...' : <Redirect to="/login" />)
                }
            />
    );
}