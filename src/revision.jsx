import React from 'react'
import ReactDOM from 'react-dom'
import 'bootswatch/dist/vapor/bootstrap.css';
import "../public/fullbackground.css";
import { RevisionList } from './components/revision/RevisionList'
import { NavBar } from './components/common/NavBar'

ReactDOM.render(
  <NavBar />,
  document.body.appendChild(document.createElement('header'))
)

document.addEventListener('DOMContentLoaded', function () {
  ReactDOM.render(
    <RevisionList />,
    document.body.appendChild(document.createElement('div'))
  )
})
