import React from 'react'
import ReactDOM from 'react-dom'
import { ChartPanel } from './components/ChartPanel'

import { NavBar } from '../other/NavBar'

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