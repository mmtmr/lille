import React from 'react'
import ReactDOM from 'react-dom'
import { TaskList } from './components/TaskList'
import { NavBar } from '../other/NavBar'
import { SideBar } from '../other/SideBar'


ReactDOM.render(
  <SideBar />,
  document.body.appendChild(document.createElement('div'))
)
ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)
document.addEventListener('DOMContentLoaded', function () {

  ReactDOM.render(
    <TaskList />,
    document.body.appendChild(document.createElement('div'))
  )
})
