import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import PropTypes from 'prop-types';
import BugPreview from './BugPreview';
import { Link } from 'react-router-dom';

class BugList extends Component {
  render() {
    let token = localStorage.getItem("auth-token");
    if (token != '' && this.props.bugs != null) {
      return (
        <div>
          <br/>
          <p><a style={{color: "#a2b6fd", display: "inline", marginLeft: "300px"}}>Blue</a> bugs are open bugs.<a style={{color: "#00cd38", display:"inline" }}> Green </a>
            bugs are in progress bugs. <a style={{color: "red", display: "inline"}}>Red</a> bugs are finished bugs. </p>
          {/* navigation for different types of bugs */}
          <ul className="bugKinds">
            <li><Link to="/bugs/myCreatedBugs">My Created Bugs</Link></li>
            <li><Link to="/bugs" style={{backgroundColor: "white"}}>All Bugs</Link></li>
            <li><Link to="/bugs/myAssignedBugs">My Assigned Bugs</Link></li>
          </ul>
          {
            // give a preview of each bug
        this.props.bugs.map(bug => (
          <BugPreview key={bug._id} {...bug} />
        ))
          }
        </div>
    )
    }
    else if (token === '') {
      return <div>
        You need to be logged in to see the bug list.
        <Link to="/login"> Log in</Link>
        </div>
    }
    else {
      return <div></div>
    }
  }
  
}

BugList.propTypes = {
  bugs: PropTypes.array
}

export default BugList;