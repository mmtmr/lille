import React from 'react'
import ReactDOM from 'react-dom'
import 'bootswatch/dist/vapor/bootstrap.css';
import "../public/fullbackground.css";
import { ChartPanel } from './components/chart/ChartPanel'
import { NavBar } from './components/common/NavBar'
ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <ChartPanel />,
    document.body.appendChild(document.createElement('div'))
  )
})