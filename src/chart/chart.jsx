import React from 'react'
import ReactDOM from 'react-dom'
import { ChartPanel } from './components/ChartPanel'

import { NavBar } from '../other/NavBar'
import { SideBar } from '../other/SideBar'

ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)
ReactDOM.render(
  <SideBar />,
  document.body.appendChild(document.createElement('div'))
)
document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <ChartPanel />,
    document.body.appendChild(document.createElement('div'))
  )
})