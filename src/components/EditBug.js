import React, { Component } from 'react';
import axios from 'axios';
import { Redirect } from 'react-router-dom';
import {FaTrashAlt} from "react-icons/fa";

class EditBug extends Component {

    deleteBug = () => {
        let token = localStorage.getItem("auth-token");
        axios.post(`/api/bugs/delete/${this.props.match.params.bugId}`, null, { headers: { "x-auth-token": token } })
            .then(res => {
                this.setState({ bug: null, deleted: true })
            })

    }

    constructor() {
        super();
        // make functions accessible from "this"
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAssignedToChange = this.handleAssignedToChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleReproduceChange = this.handleReproduceChange.bind(this);
    }

    state = {
        title: null, description: null, assignedToId: null,
        priority: null, reporterId: null, status: null, dateCreated: null, redirect: false, deleted: false, reproduce: null
    }

    componentDidMount() {
        let token = localStorage.getItem("auth-token");
        axios.get(`/api/bugs/${this.props.match.params.bugId}`, { headers: { "x-auth-token": token } })
            .then(res => {
                this.setState({
                    title: res.data.title, description: res.data.description, assignedToId: res.data.assignedToId,
                    priority: res.data.priority, reporterId: res.data.reporterId, status: res.data.status, dateCreated: res.data.dateCreated, id: res.data._id, reproduce: res.data.reproduce
                });
            })
        axios.get('/api/users', {headers: {"x-auth-token": token}})
            .then(res => {
                this.setState({ users: res.data })
            })
    }

    // store the new values of the fields with each edit function
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
        axios.post(`/api/bugs/editBug/${this.state.id}`, this.state, { headers: { "x-auth-token": token } })
            .then(this.setState({ redirect: true }))

    }

    handleReproduceChange(event) {
        this.setState({ reproduce: event.target.value })
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
            return <Redirect to="/bugs/edit/deleted" />
        }
        if (this.state.redirect) {
            return <Redirect to={"/bugs/edit/updated"} />
        }
        else {
            if (this.state.users != null) {
                return (
                    <div>
                        {/* form for editing the bug and changing the values of fields */}
                        <form onSubmit={this.handleSubmit} id="editBug">
                            <label className="label" htmlFor="editBug">Title</label>
                            <input onChange={this.handleTitleChange} className="input" type="text" id="title" name="title" defaultValue={this.state.title}></input>
                            <label className="label" htmlFor="editBug">Description</label>
                            <input onChange={this.handleDescriptionChange} className="input" type="text" id="title" name="description" defaultValue={this.state.description}></input>
                            <label className="label" htmlFor="createNewBug">Enter how to reproduce the bug (if data is bug)</label>
                            <input onChange={this.handleReproduceChange} className="input" type="text" id="title" name="description" defaultValue={this.state.reproduce}></input>
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
                            <button form="editBug" type="submit" className="button">Update Bug</button>
                        </form>
                        <br /><button onClick={this.deleteBug} className="editButton">Delete Bug <FaTrashAlt/></button>
                    </div>
                )
            }
            else {
                return <div></div>
            }
        }
    }
}

export default EditBug;