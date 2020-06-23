import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BugPreview from './BugPreview';
import Bug from './Bug';
import axios from 'axios';
import * as api from '../api';
import { Router, Route, Link, Switch } from 'react-router-dom';
import TaskPreview from './TaskPreview';

class TaskList extends Component {

  render() {
    let token = localStorage.getItem("auth-token");
    if (token != '' && this.props.tasks != null) {
      return (
        <div>
          <br/>
            <p><a style={{color: "#a2b6fd", display: "inline", marginLeft: "300px"}}>Blue</a> tasks are open tasks.<a style={{color: "#00cd38", display:"inline" }}> Green </a>
            tasks are in progress tasks.<a style={{color: "red", display: "inline"}}> Red</a> tasks are finished tasks.  </p>
          <ul className="bugKinds">
            <li><Link to="/tasks/myCreatedTasks">My Created Tasks</Link></li>
            <li><Link to="/tasks" style={{backgroundColor: "white"}}>All Tasks</Link></li>
            <li><Link to="/tasks/myAssignedTasks">My Assigned Tasks</Link></li>
          </ul>
          {
        this.props.tasks.map(task => (
          <TaskPreview key={task._id} {...task} />
        ))
          }
        </div>
    )
    }
    else if (token === ''){
      return <div>
        You need to be logged in to see the task list.
        <Link to="/login"> Log in</Link>
        </div>

    }
    else {
      return <div></div>
    }
  }
  
}

TaskList.propTypes = {
  tasks: PropTypes.array
}

export default TaskList;