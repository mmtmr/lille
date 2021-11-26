import React from 'react';
import ReactDOM from 'react-dom';
import 'bootswatch/dist/vapor/bootstrap.css';
import "../public/calendar.css";
import "../public/task.css";
import "../public/fullbackground.css";
import "../public/login.css";
import "../public/dashboard.css";

import { App } from './App';


document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(<App />,  document.getElementById("root"));
})