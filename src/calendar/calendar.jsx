import React from 'react'
import ReactDOM from 'react-dom'
import "./calendar.css";
import Calendar from './components/Calendar'
import { NavBar } from '../other/NavBar'

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
