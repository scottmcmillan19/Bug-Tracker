import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Router, Route, Link, Switch, Redirect } from 'react-router-dom';
import Bug from './Bug';
class BugPreview extends Component {
  state = {redirect: null}
  renderBug = () => {
    this.setState({redirect: true});
  }
  render() {
    if (this.state.redirect) {
      return <Redirect to={`/bug/${this.props._id}`} push={true}/>
    }
    if (this.props.status === "Open") {
      return (
        <div onClick={this.renderBug}>
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
        <div onClick={this.renderBug}>
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
        <div onClick={this.renderBug}>
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

export default BugPreview;