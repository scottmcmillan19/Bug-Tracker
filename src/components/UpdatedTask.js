import React from 'react';
import {Link} from 'react-router-dom';

class UpdatedTask extends React.Component {
    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Your task has been updated. You can see your updated task by going to the <Link to="/tasks">Task List.</Link></div>
            </div>
        )
    }
}

export default UpdatedTask;