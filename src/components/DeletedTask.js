import React from 'react';
import {Link } from 'react-router-dom';
class DeletedTask extends React.Component {
    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Your task has been deleted. You can see your existing tasks by going to the <Link to="/tasks">Task List.</Link></div>
            </div>
        )
    }
}

export default DeletedTask;