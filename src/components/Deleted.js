import React from 'react';
import {Link } from 'react-router-dom';
class Deleted extends React.Component {
    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Your bug has been deleted. You can see your existing bugs by going to the <Link to="/bugs">Bug List.</Link></div>
            </div>
        )
    }
}

export default Deleted;