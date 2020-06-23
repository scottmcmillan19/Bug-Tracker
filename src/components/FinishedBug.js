import React from 'react';
import {Link } from 'react-router-dom';
import Axios from 'axios';
class FinishedBug extends React.Component {

    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Congratulations on solving your bug. You can see your existing bugs by going to the <Link to="/bugs">Bug List.</Link></div>
            </div>
        )
    }
}

export default FinishedBug;