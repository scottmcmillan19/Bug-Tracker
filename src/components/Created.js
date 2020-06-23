import React from 'react';
import {Link } from 'react-router-dom';
class Created extends React.Component {
    
    render() {
         return (
            <div>
                <br/><br/>
                <div className="bugCreated">Your data has been created. You can see your new data by going to the <Link to="/bugs">Bug List</Link> or the <Link to="/tasks">Task List</Link></div>
            </div>
        )
    }
}

export default Created;