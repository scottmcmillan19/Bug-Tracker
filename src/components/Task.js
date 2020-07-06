import React, { Component } from 'react';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router-dom';
import { FaTasks } from "react-icons/fa";
import { IconContext } from "react-icons";
import { FaCircle, FaStop, FaPlay, FaEdit } from "react-icons/fa";

class Task extends Component {

  // upon change, let state know that there has been a change
  editDescription = () => {
    this.setState({editDescription: true})
  }

  editAssignedTo = () => {
    this.setState({editAssignedTo: true})
  }

  editStatus = () => {
    this.setState({editStatus: true})
  }

  editPriority = () => {
    this.setState({editPriority: true})
  }

  editTask = () => {
    this.setState({ redirect: true })
  }

  // store new value of fields upon change in each handle fcn
  handlePriorityChange = (event) => {
    this.setState({newPriority: event.target.value})
  }

  handleDescriptionChange = (event) => {
    this.setState({newDescription: event.target.value})
  }

  handleSubmit = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/tasks/editInPlace/${this.state.task._id}`, this.state, {headers: {"x-auth-token": token}})
    .then(window.location.reload(false))
  }

  handleAssignedToChange = (event) => {
    let token = localStorage.getItem("auth-token");
    axios.get(`/api/users/getId/${event.target.value}`, {headers: {"x-auth-token": token}})
      .then(res => {
        this.setState({newAssignedToId: res.data})
      })
  }


  handleStatusChange = (event) => {
    this.setState({newStatus: event.target.value})
  }

  finishTask = () => {

    let token = localStorage.getItem("auth-token");
    axios.post(`/api/tasks/finishTask/${this.state.task._id}`, null, { headers: { "x-auth-token": token } })
      .then(this.setState({ finished: true }))

  }

  // change status to "in progress"
  updateTaskStatus = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/tasks/changeTaskStatus/${this.state.task._id}`, null, { headers: { "x-auth-token": token } })
      .then(window.location.reload(false))
  }

  state = { task: null, redirect: false, editStatus: false, newStatus: null, editPriority: false
  , newPriority: null, editDescription: false, newDescription: null, users: null, editAssignedTo: false, newAssignedToId: null }

  componentDidMount() {
    // get task info and user list
    let token = localStorage.getItem("auth-token");
    axios.get(`/api/tasks/${this.props.match.params.taskId}`, { headers: { "x-auth-token": token } })
      .then(res => {
        this.setState({ task: res.data, redirect: false });
        axios.get(`/api/users/${this.state.task.assignedToId}`, { headers: { "x-auth-token": token } })
          .then(res => {
            this.setState({ assignedToName: res.data[0].name })
            console.log(this.state.assignedToName)
          })
        axios.get(`/api/users/${this.state.task.reporterId}`, { headers: { "x-auth-token": token } })
          .then(res => {
            this.setState({ createdByName: res.data[0].name })
          })
          axios.get('/api/users', {headers: {"x-auth-token": token}})
          .then(res => {
            this.setState({users: res.data})
          })
  
      })
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/task/edit/${this.state.task._id}`} push={true} />
    }
    if (this.state.finished) {
      return <Redirect to="/tasks/finished" push={true} />
    }
    if (this.state.task != null) {
      let token = localStorage.getItem("auth-token");
      let decoded = jwtDecode(token);
      return (
        <div>
          {/* only allowed to edit status if you created task or are assigned to it */}
          {decoded.id === this.state.task.assignedToId && this.state.task.status === 'Open' ?
            <div className="homeParagraph"><br /><h3>Start working on this task?</h3>
              <button onClick={this.updateTaskStatus} className="yesNo">Start</button></div> : null}
          <div>
            <h3 className="bugTitle">{this.state.task.title}</h3>

            <br />
            <div className="bug">
              <table className="bugTables">
                <caption className="bugHeaders">Details</caption>
                <tbody>
                  <tr>
                    <th>Type:</th>
                    <td>Task&nbsp;&nbsp;
                      <IconContext.Provider value={{ color: "green" }}>
                        <FaTasks />
                      </IconContext.Provider>

                    </td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                    {this.state.editStatus && (decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId) ?  <form onSubmit={this.handleSubmit} id="status"><select defaultValue={this.state.task.status} onChange={this.handleStatusChange}><option>Open</option>
                      <option>In Progress</option><option>Closed</option></select>  <button className="doneEditing" form="status" type="submit">Done</button></form>: 
                      this.state.task.status}
                      {/* different icon depending on what status */}
                      {this.state.task.status === "In Progress" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "#00c536" }}>&nbsp;&nbsp;<FaCircle /></IconContext.Provider> : null}
                      {this.state.task.status === "Closed" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "red" }}>&nbsp;&nbsp;<FaStop /></IconContext.Provider> : null}
                      {this.state.task.status === "Open" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "blue" }}>&nbsp;&nbsp;<FaPlay /></IconContext.Provider> : null}
                      {this.state.editStatus ? null : <button className="editBtn" onClick={this.editStatus} >{decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ? <FaEdit/> : null}</button>}
                    </td>

                  </tr>
                  <tr>
                    <th>Priority:</th>
                    <td>
                      {this.state.editPriority && (decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId) ? <form onSubmit={this.handleSubmit} id="priority"><select defaultValue={this.state.task.priority} onChange={this.handlePriorityChange}>
                      <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      </select>  <button className="doneEditing" form="priority" type="submit">Done</button></form>: 
                      this.state.task.priority}
                      {this.state.editPriority ? null : <button className="editBtn" onClick={this.editPriority} >{decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ? <FaEdit/> : null}</button>}
                      </td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>
                      {this.state.editDescription && (decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId) ? <form onSubmit={this.handleSubmit} id="description"><input onChange={this.handleDescriptionChange} defaultValue={this.state.task.description}></input>
                      &nbsp;&nbsp;<button className="doneEditing" form="description" type="submit">Done</button>
                      </form> : this.state.task.description}
                      {this.state.editDescription ? null : <button className="editBtn" onClick={this.editDescription} >{decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ? <FaEdit/> : null}</button>}
                      </td>
                  </tr>
                </tbody>
              </table>
              <table className="bugTables">
                <caption className="bugHeaders">People</caption>
                <tbody>
                  <tr>
                    <th>Reporter:</th>
                    <td>{this.state.createdByName}</td>
                  </tr>
                  <tr>
                    <th>Assigned to:</th>
                    <td>
                    {this.state.editAssignedTo && (decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId) ? <form onSubmit={this.handleSubmit} id="assignedTo">
                        <select onChange={this.handleAssignedToChange} defaultValue={this.state.assignedToName}>
                          {this.state.users.map(user => {
                            return <option key={user._id}>{user.name}</option>
                          })}
                        </select><button className="doneEditing" form="assignedTo" type="submit">Done</button></form> : this.state.assignedToName}
                      
                      {this.state.editAssignedTo ? null : <button onClick={this.editAssignedTo} className="editBtn">{decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ? <FaEdit/> : null}</button>}

                      </td>
                  </tr>
                </tbody>
              </table>
              <table className="bugTables">
                <caption className="bugHeaders">Dates</caption>
                <tbody>
                  <tr>
                    <th>Date created:</th>
                    <td>{this.state.task.dateCreated}</td>
                  </tr>
                  <tr>
                    <th>Latest edit:</th>
                    <td>{this.state.task.dateModified}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {/* only allowed to edit or complete task if you made the task or are assigned it */}
            {decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ?
              <div><br /><button onClick={this.editTask} className="editButton">Edit Task</button></div> : null}
            {this.state.task.status === "In Progress" && (decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId) ? <button onClick={this.finishTask} className="finishButton">Complete Task</button> : null}
          </div>
        </div>
      );
    }

    else {
      return <div></div>
    }
  }
}

export default Task;