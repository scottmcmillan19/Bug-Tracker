import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router-dom';
import { FaTasks } from "react-icons/fa";
import { IconContext } from "react-icons";
import { FaCircle, FaStop, FaPlay, FaEdit } from "react-icons/fa";
class Task extends Component {

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

  updateTask = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/tasks/updateTask/${this.state.task._id}`, null, { headers: { "x-auth-token": token } })
      .then(window.location.reload(false))
  }

  state = { task: null, redirect: false, editStatus: false, newStatus: null, editPriority: false
  , newPriority: null, editDescription: false, newDescription: null, users: null, editAssignedTo: false, newAssignedToId: null }
  componentDidMount() {
    let token = localStorage.getItem("auth-token");
    axios.get(`/api/tasks/${this.props.match.params.taskId}`, { headers: { "x-auth-token": token } })
      .then(res => {
        this.setState({ task: res.data, redirect: false });
        axios.get(`/api/users/${this.state.task.assignedToId}`, { headers: { "x-auth-token": token } })
          .then(res => {
            this.setState({ assignedToName: res.data[0].name })
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
          {decoded.id === this.state.task.assignedToId && this.state.task.status === 'Open' ?
            <div className="homeParagraph"><br /><h3>Start working on this task?</h3>
              <button onClick={this.updateTask} className="yesNo">Start</button></div> : null}
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
                    {this.state.editStatus ?  <form onSubmit={this.handleSubmit} id="status"><select defaultValue={this.state.task.status} onChange={this.handleStatusChange}><option>Open</option>
                      <option>In Progress</option><option>Closed</option></select>  <button className="doneEditing" form="status" type="submit">Done</button></form>: 
                      this.state.task.status}

                      {this.state.task.status === "In Progress" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "#00c536" }}>&nbsp;&nbsp;<FaCircle /></IconContext.Provider> : null}
                      {this.state.task.status === "Closed" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "red" }}>&nbsp;&nbsp;<FaStop /></IconContext.Provider> : null}
                      {this.state.task.status === "Open" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "blue" }}>&nbsp;&nbsp;<FaPlay /></IconContext.Provider> : null}
                      {this.state.editStatus ? null : <button className="editBtn" onClick={this.editStatus} ><FaEdit/></button>}
                    </td>

                  </tr>
                  <tr>
                    <th>Priority:</th>
                    <td>
                      {this.state.editPriority ? <form onSubmit={this.handleSubmit} id="priority"><select defaultValue={this.state.task.priority} onChange={this.handlePriorityChange}>
                        <option>1</option>
                      <option>2</option>
                      <option>3</option>
                      <option>4</option>
                      <option>5</option>
                      </select>  <button className="doneEditing" form="priority" type="submit">Done</button></form>: 
                      this.state.task.priority}
                      {this.state.editPriority ? null : <button className="editBtn" onClick={this.editPriority} ><FaEdit/></button>}
                      </td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>
                      {this.state.editDescription ? <form onSubmit={this.handleSubmit} id="description"><input onChange={this.handleDescriptionChange} defaultValue={this.state.task.description}></input>
                      &nbsp;&nbsp;<button className="doneEditing" form="description" type="submit">Done</button>
                      </form> : this.state.task.description}
                      {this.state.editDescription ? null : <button className="editBtn" onClick={this.editDescription} ><FaEdit/></button>}
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
                    {this.state.editAssignedTo ? <form onSubmit={this.handleSubmit} id="assignedTo">
                        <select onChange={this.handleAssignedToChange} defaultValue={this.state.assignedToName}>
                          {this.state.users.map(user => {
                            return <option key={user._id}>{user.name}</option>
                          })}
                        </select><button className="doneEditing" form="assignedTo" type="submit">Done</button></form> : this.state.assignedToName}
                      
                      {this.state.editAssignedTo ? null : <button onClick={this.editAssignedTo} className="editBtn"><FaEdit/></button>}

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
            {/* <table>
              <tbody>
                <tr>
                  <th>Name</th>
                  <td>{this.state.task.title}</td>
                </tr>
                <tr>
                  <th>Description</th>
                  <td>{this.state.task.description}</td>
                </tr>
                <tr>
                  <th>Assigned To Id</th>
                  <td>{this.state.task.assignedToId}</td>
                </tr>
                <tr>
                  <th>Priority</th>
                  <td>{this.state.task.priority}</td>
                </tr>
                <tr>
                  <th>Status</th>
                  <td>{this.state.task.status}</td>
                </tr>
                <tr>
                  <th>Reporter Id</th>
                  <td>{this.state.task.reporterId}</td>
                </tr>
                <tr>
                  <th>Date Created</th>
                  <td>{this.state.task.dateCreated}</td>
                </tr>
              </tbody>
            </table> */}
            {decoded.id === this.state.task.assignedToId || decoded.id === this.state.task.reporterId ?
              <div><br /><button onClick={this.editTask} className="editButton">Edit Task</button></div> : null}
            {this.state.task.status === "In Progress" ? <button onClick={this.finishTask} className="finishButton">Complete Task</button> : null}
          </div>
        </div>
      );
    }

    else {
      return <div></div>
    }
  }
}


// Bug.propTypes = {
//   _id: PropTypes.string.isRequired,
//   description: PropTypes.string.isRequired,
//   bugListClick: PropTypes.func.isRequired,
// };

export default Task;