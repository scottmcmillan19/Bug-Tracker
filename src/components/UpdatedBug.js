import React from 'react';
import {Link} from 'react-router-dom';

class Updated extends React.Component {
    render() {
        return (
            <div>
                <br/><br/>
                <div className="bugCreated">Your bug has been updated. You can see your updated bug by going to the <Link to="/bugs">Bug List.</Link></div>
            </div>
        )
    }
}

export default Updated;