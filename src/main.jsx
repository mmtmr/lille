import React from 'react';
import ReactDOM from 'react-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootswatch/dist/vapor/bootstrap.css';
import 'react-bootstrap-table-next/dist/react-bootstrap-table2.min.css';
import "../public/calendar.css";
import "../public/task.css";
import "../public/fullbackground.css";
import "../public/login.css";
import "../public/dashboard.css";

import { App } from './App';


document.addEventListener('DOMContentLoaded', function () {
    ReactDOM.render(<App />,  document.getElementById("root"));
})