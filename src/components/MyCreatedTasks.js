import React from 'react';
import Task from '../../models/Task';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import TaskPreview from './TaskPreview'
import { Link } from 'react-router-dom';
class MyCreatedTasks extends React.Component {
    state = { tasks: null };

    componentDidMount() {
        let token = localStorage.getItem("auth-token");
        axios.get('/api/tasks/myCreatedTasks', { headers: { "x-auth-token": token } })
            .then(res => {
                res.data.sort((a, b) =>
                    ((a.status === "Open" && b.status === "In Progress") || (a.status === "Open" && b.status === "Closed") ||
                        (a.status === "In Progress" && b.status === "Closed")) ? -1 :
                        ((a.status === "Open" && b.status === "Open") || (a.status === "In Progress" && b.status === "In Progress") ||
                            (a.status === "Closed" && b.status === "Closed")) ? 0 :
                            ((a.status === "In Progress" && b.status === "Open") || (a.status === "Closed" && b.status === "Open") ||
                                (a.status === "Closed" && b.status === "In Progress")) ? 1 : null
                )
                this.setState({ tasks: res.data })
            })
    }
    render() {
        let token = localStorage.getItem("auth-token");
        if (this.state.tasks != null && token != '') {
            return (
                <div>
                 <p><a style={{color: "#a2b6fd", display: "inline", marginLeft: "300px"}}>Blue</a> tasks are open tasks.<a style={{color: "#00cd38", display:"inline" }}> Green </a>
                  tasks are in progress tasks.<a style={{color: "red", display: "inline"}}> Red</a> tasks are finished tasks.  </p>

                    <ul className="bugKinds">
                        <li><Link to="/tasks/myCreatedTasks" style={{backgroundColor: "white"}}>My Created Tasks</Link></li>
                        <li><Link to="/tasks">All Tasks</Link></li>
                        <li><Link to="/tasks/myAssignedTasks">My Assigned Tasks</Link></li>
                    </ul>
                    {this.state.tasks.map(task => {
                        return <TaskPreview key={task._id} {...task} />
                    })}
                </div>
            )
        }
        else if (token === '') {
            return <div>You need to log in to be able to see your tasks.
                <Link to="/login"> Log in</Link>
            </div>
        }
        else {
            return <div></div>
        }
    }
}

export default MyCreatedTasks;