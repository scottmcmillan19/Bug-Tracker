import React from 'react';
import Bug from '../../models/Bug';
import jwtDecode from 'jwt-decode';
import axios from 'axios';
import BugPreview from './BugPreview'
import { Link } from 'react-router-dom';
class MyAssignedBugs extends React.Component {
    state = { bugs: null };

    componentDidMount() {
        let token = localStorage.getItem("auth-token");
        axios.get('/api/myAssignedBugs', { headers: { "x-auth-token": token } })
            .then(res => {
                res.data.sort((a, b) =>
                    ((a.status === "Open" && b.status === "In Progress") || (a.status === "Open" && b.status === "Closed") ||
                        (a.status === "In Progress" && b.status === "Closed")) ? -1 :
                        ((a.status === "Open" && b.status === "Open") || (a.status === "In Progress" && b.status === "In Progress") ||
                            (a.status === "Closed" && b.status === "Closed")) ? 0 :
                            ((a.status === "In Progress" && b.status === "Open") || (a.status === "Closed" && b.status === "Open") ||
                                (a.status === "Closed" && b.status === "In Progress")) ? 1 : null
                )
                this.setState({ bugs: res.data })
            })
    }
    render() {
        let token = localStorage.getItem("auth-token");
        if (token != '' && this.state.bugs != null) {
            return (
                <div>
                 <p><a style={{color: "#a2b6fd", display: "inline", marginLeft: "300px"}}>Blue</a> bugs are open bugs.<a style={{color: "#00cd38", display:"inline" }}> Green </a>
                 bugs are in progress bugs.<a style={{color: "red", display: "inline"}}> Red</a> bugs are finished bugs.  </p>

                    <ul className="bugKinds">
                        <li><Link to="/bugs/myCreatedBugs">My Created Bugs</Link></li>
                        <li><Link to="/bugs">All Bugs</Link></li>
                        <li><Link to="bugs/myAssignedBugs" style={{backgroundColor: "white"}}>My Assigned Bugs</Link></li>
                    </ul>
                    {this.state.bugs.map(bug => {
                        return <BugPreview key={bug._id} {...bug} />
                    })}
                </div>
            )
        }
        else if (token === '') {
            return <div>You need to log in to be able to see your bugs.
                <Link to="/login"> Log in</Link>
            </div>
        }
        else {
            return <div></div>
        }
    }
}

export default MyAssignedBugs;