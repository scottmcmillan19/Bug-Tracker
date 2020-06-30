import React, { Component, useContext } from 'react';
import axios from 'axios';
import {Link, Redirect } from 'react-router-dom';

class CreateNewBug extends Component {

    constructor() {
        super();
        // make it so you can access the functions with "this"
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleTitleChange = this.handleTitleChange.bind(this);
        this.handleDescriptionChange = this.handleDescriptionChange.bind(this);
        this.handleAssignedToChange = this.handleAssignedToChange.bind(this);
        this.handlePriorityChange = this.handlePriorityChange.bind(this);
        this.handleStatusChange = this.handleStatusChange.bind(this);
        this.handleTypeChange = this.handleTypeChange.bind(this);
        this.handleReproduceChange = this.handleReproduceChange.bind(this);
    }

    // get list of users
    componentDidMount() {
        let token = localStorage.getItem("auth-token");
        axios.get('api/users', {headers: {"x-auth-token": token}})
            .then(res => {
                this.setState({ type: 'Bug', title: '', description: '', assignedTo: 'Scott McMillan', priority: '1', status: 'Open', reporterId: '', dateCreated: '', users: res.data, reproduce: ''  })
            })
    }

    state = {redirect: false};

    handleSubmit(event) {
        event.preventDefault();
        let token = localStorage.getItem("auth-token");
        if (this.state.type === 'Bug') {
            axios.post('/api/bugs', this.state, {headers: {"x-auth-token": token}})
            .then(this.setState({redirect: true}))
        }
        else {
            axios.post('/api/tasks', this.state, {headers: {"x-auth-token": token}})
            .then(this.setState({redirect: true}))
        }
    }

    // stores the data in each field
    handleTitleChange(event) {
        var currDate = Date.now();
        this.setState({ dateCreated:  currDate})
        this.setState({ title: event.target.value })
    }

    handleTypeChange(event) {
        this.setState({ type: event.target.value })
    }


    handleDescriptionChange(event) {
        this.setState({ description: event.target.value })
    }

    handleReproduceChange(event) {
        this.setState({ reproduce: event.target.value })
    }

    handleAssignedToChange(event) {
        this.setState({ assignedTo: event.target.value })
    }

    handlePriorityChange(event) {
        this.setState({ priority: event.target.value })
    }

    handleStatusChange(event) {
        this.setState({ status: event.target.value })
    }

    handleReporterChange(event) {
        this.setState({ reporter: event.target.value })
    }

    render() {

        let token = localStorage.getItem("auth-token");
        if (this.state.redirect) {
            return <Redirect to="/createNewData/created" push={true}/>
        }
        if (this.props.bugs != null && this.state.users != null && token != '') {
            return (
                <div>
                    {/* form to enter each field */}
                    <form onSubmit={this.handleSubmit} id="createNewBug">
                        <label className="label" htmlFor="createNewBug">Choose type of data</label>
                        <select onChange={this.handleTypeChange} className="select" id="type" name="type">
                            <option value="Bug">Bug</option>
                            <option value="Task">Task</option>
                        </select>
                        <label className="label" htmlFor="createNewBug">Enter title of data</label>
                        <input onChange={this.handleTitleChange} className="input" type="text" id="title" name="title" placeholder="Add text here"></input>
                        <label className="label" htmlFor="createNewBug">Enter Description of data</label>
                        <input onChange={this.handleDescriptionChange} className="input" type="text" id="title" name="description" placeholder="Add text here"></input>
                        <label className="label" htmlFor="createNewBug">Enter how to reproduce the bug (if data is bug)</label>
                        <input onChange={this.handleReproduceChange} className="input" type="text" id="title" name="description" placeholder="Add text here"></input>

                        <label className="label" htmlFor="createNewBug">Enter who it is assigned to</label>
                        <select onChange={this.handleAssignedToChange} className="select" id="assignedTo" name="assignedTo">
                            {this.state.users.map(user => {
                                return <option key={user._id} value={user.name}>{user.name}</option>
                            })}
                        </select>
                        <label className="label" htmlFor="createNewBug">Enter priority of data</label>
                        <select onChange={this.handlePriorityChange} className="select" id="priority" name="priority">
                            <option selected="selected" value="1">1 (lowest)</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5 (highest)</option>
                        </select>
                        <label className="label" htmlFor="createNewBug">Enter status of data</label>
                        <select onChange={this.handleStatusChange} className="select" id="status" name="status">
                            <option selected="selected" value="Open">Open</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Closed">Closed</option>
                        </select>
                        <button form="createNewBug" type="submit" className="button">Add Datum</button>
                    </form>
                </div>
            );
        }
        else if (token === '') {
            return <div>You need to be logged in to create a new datum.
                <Link to="/login"> Log in</Link>
            </div>
        }
        else {
            return <div></div>
        }
    }
}


export default CreateNewBug;
