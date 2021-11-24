import React from 'react';
import { AppRouter } from './routers/AppRouter';
import {ToastContainer} from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
export const App=()=>(
        <>
        <AppRouter />
        <ToastContainer autoClose={5000} theme="dark"/>
        </>
)