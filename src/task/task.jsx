import React from 'react'
import ReactDOM from 'react-dom'
import { TaskList } from './components/TaskList'
import { NavBar } from '../other/NavBar'


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
