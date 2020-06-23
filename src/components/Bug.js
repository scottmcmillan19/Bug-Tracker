import React, { Component } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import jwtDecode from 'jwt-decode';
import { Redirect } from 'react-router-dom';
import {FaBug} from "react-icons/fa";
import {IconContext} from "react-icons";
import {FaCircle, FaStop, FaPlay, FaEdit} from "react-icons/fa";
class Bug extends Component {

  constructor() {
    super();
        this.editStatus = this.editStatus.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.editPriority = this.editPriority.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.editReproduce = this.editReproduce.bind(this);
        this.handleReproduceChange = this.handleReproduceChange.bind(this);
        this.editDescription = this.editDescription.bind(this);
  }

  handleSubmit = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/bugs/editInPlace/${this.state.bug._id}`, this.state, {headers: {"x-auth-token": token}})
    .then(window.location.reload(false))
  }

  editPriority = () => {
    this.setState({editPriority: true})
  }

  editStatus = () => {
    this.setState({editStatus: true})
  }

  editDescription = () => {
    this.setState({editDescription: true})
  }

  editAssignedTo = () => {
    this.setState({editAssignedTo: true})
  }


  editReproduce = () => {
    this.setState({editReproduce: true})
  }

  editBug = () => {
    this.setState({redirect: true})
  }

  handleStatusChange = (event) => {
    this.setState({newStatus: event.target.value})
  }

  handleReproduceChange = (event) => {
    this.setState({newReproduce: event.target.value})
  }

  handlePriorityChange = (event) => {
    this.setState({newPriority: event.target.value})
  }

  handleDescriptionChange = (event) => {
    this.setState({newDescription: event.target.value})
  }

  handleAssignedToChange = (event) => {
    let token = localStorage.getItem("auth-token");
    axios.get(`/api/users/getId/${event.target.value}`, {headers: {"x-auth-token": token}})
      .then(res => {
        this.setState({newAssignedToId: res.data})
      })
  }




  updateBug = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/bugs/updateBug/${this.state.bug._id}`, null, {headers: {"x-auth-token": token}} )
    .then(window.location.reload(false))
  }

  finishBug = () => {
    let token = localStorage.getItem("auth-token");
    axios.post(`/api/bugs/finishBug/${this.state.bug._id}`, null, {headers: {"x-auth-token": token}})
    .then(this.setState({finished: true}))
  }
       
  state = { bug: null, redirect: false, finished: false, assignedToName: null,
     createdByName: null, editStatus: false, newStatus: null, editPriority: false, newPriority: null, editReproduce: false,
    newReproduce: null, editDescription: false, newDescription: null, editAssignedTo: false, users: null, newAssignedToId: null }
  componentDidMount() {
    let token = localStorage.getItem("auth-token");
    axios.get(`/api/bugs/${this.props.match.params.bugId}`, { headers: { "x-auth-token": token } })
      .then(res => {
        this.setState({ bug: res.data, redirect: false });
        axios.get(`/api/users/${this.state.bug.assignedToId}`, {headers: {"x-auth-token": token} })
        .then(res => {
          this.setState({assignedToName: res.data[0].name})
        })
        axios.get(`/api/users/${this.state.bug.reporterId}`, {headers: {"x-auth-token": token}})
        .then(res => {
          this.setState({createdByName: res.data[0].name})
        })
      })
      axios.get('/api/users', {headers: {"x-auth-token": token}})
        .then(res => {
          this.setState({users: res.data})
        })
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/bug/edit/${this.state.bug._id}`} push={true}/>
    }
    if (this.state.finished) {
      return <Redirect to="/bugs/finished" push={true}/>
    }
    if (this.state.bug != null) {
      let token = localStorage.getItem("auth-token");
      let decoded = jwtDecode(token);
        return (
          <div>
            <h3 className="bugTitle">{this.state.bug.title}</h3>
            {decoded.id === this.state.bug.assignedToId && this.state.bug.status === 'Open' ? 
            <div className="homeParagraph"><br/><h3>Start working on this bug?</h3>
            <button onClick={this.updateBug}className="yesNo">Start</button></div> : null}
            <br/>
            <div className="bug">
              <table className="bugTables">
              <caption className="bugHeaders">Details</caption>
                <tbody>
                  <tr>
                    <th>Type:</th>
                    <td>Bug&nbsp;&nbsp;  
                      <IconContext.Provider value={{color: "red"}}>
                      <FaBug/>
                      </IconContext.Provider>
                      </td>
                  </tr>
                  <tr>
                    <th>Status:</th>
                    <td>
                      {this.state.editStatus ?  <form onSubmit={this.handleSubmit} id="status"><select defaultValue={this.state.bug.status} onChange={this.handleStatusChange}><option>Open</option>
                      <option>In Progress</option><option>Closed</option></select>  <button className="doneEditing" form="status" type="submit">Done</button></form>: 
                      this.state.bug.status}
                      {this.state.bug.status === "In Progress" && !this.state.editStatus ? 
                      <IconContext.Provider value={{color: "#00c536"}}>&nbsp;&nbsp;<FaCircle/></IconContext.Provider> : null}
                      {this.state.bug.status === "Closed" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "red" }}>&nbsp;&nbsp;<FaStop /></IconContext.Provider> : null}
                      {this.state.bug.status === "Open" && !this.state.editStatus ?
                        <IconContext.Provider value={{ color: "blue" }}>&nbsp;&nbsp;<FaPlay /></IconContext.Provider> : null}
                        {this.state.editStatus ? null : <button  onClick={this.editStatus} className="editBtn"><FaEdit/></button>}
                      
                      </td>
                  </tr>
                  <tr>
                    <th>Priority:</th>
                    <td>
                      {this.state.editPriority ? <form onSubmit={this.handleSubmit} id="priority">
                        <select onChange={this.handlePriorityChange} defaultValue={this.state.bug.priority}>
                          <option>1</option>
                          <option>2</option>
                          <option>3</option>
                          <option>4</option>
                          <option>5</option>
                        </select>&nbsp;&nbsp;<button className="doneEditing" form="priority" type="submit">Done</button></form> : this.state.bug.priority}
                      {this.state.editPriority ? null : <button  onClick={this.editPriority} className="editBtn"><FaEdit/></button>}
                      </td>
                  </tr>
                  <tr>
                    <th>How to reproduce this bug:</th>
                    <td>
                      {this.state.editReproduce ? <form onSubmit={this.handleSubmit} id="reproduce"><input onChange={this.handleReproduceChange} defaultValue={this.state.bug.reproduce}></input>
                      &nbsp;&nbsp;<button className="doneEditing" form="reproduce" type="submit">Done</button></form> : this.state.bug.reproduce}
                      {this.state.editReproduce ? null : <button onClick={this.editReproduce} className="editBtn"><FaEdit/></button>}
                      </td>
                  </tr>
                  <tr>
                    <th>Description:</th>
                    <td>
                      {this.state.editDescription ? <form onSubmit={this.handleSubmit} id="description"><input onChange={this.handleDescriptionChange} defaultValue={this.state.bug.description}></input>
                      &nbsp;&nbsp;<button className="doneEditing" form="description" type="submit">Done</button>
                      </form> : this.state.bug.description}
                      {this.state.editDescription ? null : <button onClick={this.editDescription} className="editBtn"><FaEdit/></button>}
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
                    <td>{this.state.bug.dateCreated}</td>
                  </tr>
                  <tr>
                    <th>Latest edit:</th>
                    <td>{this.state.bug.dateModified}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            {decoded.id === this.state.bug.assignedToId || decoded.id === this.state.bug.reporterId ?
            <div><br/><button onClick={this.editBug} className="editButton">Edit Bug</button>
             </div> : null}
             {this.state.bug.status === "In Progress" ? <button onClick={this.finishBug} className="finishButton">Complete Bug</button> : null}
            
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

export default Bug;