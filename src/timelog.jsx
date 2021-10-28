import React from 'react'
import ReactDOM from 'react-dom'
import 'bootswatch/dist/vapor/bootstrap.css';
import "../public/fullbackground.css";
import { TimeLogList } from './components/timelog/TimeLogList'
import { NavBar } from './components/common/NavBar'

ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <TimeLogList />,
    document.body.appendChild(document.createElement('div'))
  )
})
