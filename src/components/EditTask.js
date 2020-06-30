import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {FaTrashAlt} from "react-icons/fa";

class EditTask extends Component {

    deleteTask = () => {
        let token = localStorage.getItem("auth-token");
        axios.post(`/api/tasks/delete/${this.props.match.params.taskId}`, null, { headers: { "x-auth-token": token } })
            .then(res => {
                this.setState({ task: null, deleted: true })
            })
    }

    state = {
        title: null, description: null, assignedToId: null,
        priority: null, reporterId: null, status: null, dateCreated: null, redirect: false, deleted: false
    }

    componentDidMount() {
        let token = localStorage.getItem("auth-token");
        axios.get(`/api/tasks/${this.props.match.params.taskId}`, { headers: { "x-auth-token": token } })
            .then(res => {
                this.setState({
                    title: res.data.title, description: res.data.description, assignedToId: res.data.assignedToId,
                    priority: res.data.priority, reporterId: res.data.reporterId, status: res.data.status, dateCreated: res.data.dateCreated, id: res.data._id
                });
            })
        axios.get('/api/users', {headers: {"x-auth-token": token}})
            .then(res => {
                this.setState({ users: res.data })
            })
    }

    // stores the new values of each field upon change for each edit fcn
    handleTitleChange = (event) => {
        var date = new Date();
        var currDate = date.getMonth() + '/' + date.getDate() + '/' + date.getFullYear();
        this.setState({ dateCreated: currDate })
        this.setState({ title: event.target.value })
        console.log(this.state.title)
    }

    handleSubmit = (event) => {
        event.preventDefault();
        let token = localStorage.getItem("auth-token");
        axios.post(`/api/tasks/editTask/${this.state.id}`, this.state, { headers: { "x-auth-token": token } })
            .then(this.setState({ redirect: true }))

    }


    handleDescriptionChange = (event) => {
        this.setState({ description: event.target.value })
    }

    handleAssignedToChange = (event) => {
        this.setState({ assignedTo: event.target.value })
    }

    handlePriorityChange = (event) => {
        this.setState({ priority: event.target.value })
    }

    handleStatusChange = (event) => {
        this.setState({ status: event.target.value })
    }


    render() {
        if (this.state.deleted) {
            return <Redirect to="/tasks/edit/deleted" />
        }
        if (this.state.redirect) {
            return <Redirect to={"/tasks/edit/updated"} />
        }
        else {
            if (this.state.users != null) {
                return (
                    <div>
                        {/* form for editing a task */ }
                        <form onSubmit={this.handleSubmit} id="editBug">
                            <label className="label" htmlFor="editBug">Title</label>
                            <input onChange={this.handleTitleChange} className="input" type="text" id="title" name="title" defaultValue={this.state.title}></input>
                            <label className="label" htmlFor="editBug">Description</label>
                            <input onChange={this.handleDescriptionChange} className="input" type="text" id="title" name="description" defaultValue={this.state.description}></input>
                            <label className="label" htmlFor="editBug">Assigned to Id</label>
                            <select onChange={this.handleAssignedToChange} className="select" id="assignedTo" name="assignedTo">
                                {this.state.users.map(user => {
                                    return <option key={user._id} value={user.name}>{user.name}</option>
                                })}
                            </select>
                            <label className="label" htmlFor="editBug">Priority</label>
                            <select onChange={this.handlePriorityChange} className="select" id="priority" name="priority">
                                {this.state.priority === '1' ? <option value="1" selected>1 (lowest)</option> : <option value="1">1 (lowest)</option>}
                                {this.state.priority === '2' ? <option value="2" selected>2</option> : <option value="2">2</option>}
                                {this.state.priority === '3' ? <option value="3" selected>3</option> : <option value="3">3</option>}
                                {this.state.priority === '4' ? <option value="4" selected>4</option> : <option value="4">4</option>}
                                {this.state.priority === '5' ? <option value="5" selected>5 (highest)</option> : <option value="5">5 (highest)</option>}
                            </select>
                            <label className="label" htmlFor="editBug">Status</label>
                            <select onChange={this.handleStatusChange} className="select" id="status" name="status">
                                <option value="Open">Open</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                            <button form="editBug" type="submit" className="button">Update Task</button>
                        </form>
                        <br /><button onClick={this.deleteTask} className="editButton">Delete Task <FaTrashAlt/></button>
                    </div>
                )
            }
            else {
                return <div></div>
            }
        }
    }
}

export default EditTask;