import React from 'react'
import ReactDOM from 'react-dom'
import { RevisionList } from './components/RevisionList'

import { NavBar } from '../other/NavBar'

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
