import React from 'react';
import {Link } from 'react-router-dom';
class FinishedTask extends React.Component {
    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Congratulations on finishing your task. You can see your existing tasks by going to the <Link to="/tasks">Task List.</Link></div>
            </div>
        )
    }
}

export default FinishedTask;