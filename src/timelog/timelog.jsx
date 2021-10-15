import React from 'react'
import ReactDOM from 'react-dom'
import { TimeLogList } from './components/TimeLogList'

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
    <TimeLogList />,
    document.body.appendChild(document.createElement('div'))
  )
})
