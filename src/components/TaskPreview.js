import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Bug from './Bug';
class TaskPreview extends Component {
  state = {redirect: null}
  renderTask = () => {
    this.setState({redirect: true});
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/task/${this.props._id}`} push={true}/>
    }
    else {
      if (this.props.status === "Open") {
        return (
          <div onClick={this.renderTask}>
            <div className="link BugPreview">
              <div className="bug-name">
                {this.props.title}
              </div>
              <div className="bug-description">
                {this.props.description}
              </div>
            </div>
          </div>
        );
  
      }
      else if (this.props.status === "In Progress") {
        return (
          <div onClick={this.renderTask}>
            <div className="link InProgressBugPreview">
              <div className="bug-name">
                {this.props.title}
              </div>
              <div className="bug-description">
                {this.props.description}
              </div>
            </div>
          </div>
        );
  
      }
      else {
        return (
          <div onClick={this.renderTask}>
            <div className="link ClosedBugPreview">
              <div className="bug-name">
                {this.props.title}
              </div>
              <div className="bug-description">
                {this.props.description}
              </div>
            </div>
          </div>
        );
  
      }
    }
  }
}

export default TaskPreview;