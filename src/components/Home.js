import React from 'react';
import Header from './Header';
class Home extends React.Component {
    render() {
        return (
            <div>
                <Header message={'Bug Tracker'} />
                <br></br>
                <h3 className="title">Welcome to the Bug Tracker!</h3>
                <br></br>
                <p className="homeParagraph">In this app, you will be able to achieve the full functionality of an issue tracker for your company!<br/>
                You can create a new bug or task, describe it how you would like, and then look at the existing bug in the bugs tab, or the existing tasks in the tasks tab.
                </p>
            </div>
        )
    }
}

export default Home;