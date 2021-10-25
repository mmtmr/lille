import React from 'react'
import ReactDOM from 'react-dom'
import { TimeLogList } from './components/TimeLogList'

import { NavBar } from '../other/NavBar'

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
