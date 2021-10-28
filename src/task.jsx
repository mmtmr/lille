import React from 'react'
import ReactDOM from 'react-dom'
import 'bootswatch/dist/vapor/bootstrap.css';
import "../public/task.css";
import { TaskList } from './components/task/TaskList'
import { NavBar } from './components/common/NavBar'


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
