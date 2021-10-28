import React from 'react'
import ReactDOM from 'react-dom'
import "bootswatch/dist/vapor/bootstrap.css"
import "../public/calendar.css";
import Calendar from './components/calendar/Calendar'
import { NavBar } from './components/common/NavBar'

ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)
document.addEventListener('DOMContentLoaded', function() {
    ReactDOM.render(
      <Calendar />,
      document.body.appendChild(document.createElement('div'))
    )
  })
