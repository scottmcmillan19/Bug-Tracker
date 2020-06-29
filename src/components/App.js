import React from 'react';
import BugList from './BugList';
import Bug from './Bug';
import * as api from '../api';
import CreateNewData from './CreateNewData';
import axios from 'axios';
import { Route, Link } from 'react-router-dom';
import Home from './Home';
import Login from './Login';
import Register from './Register';
import UserContext from '../context/UserContext';
import MyCreatedBugs from './MyCreatedBugs';
import MyAssignedBugs from './MyAssignedBugs';
import EditBug from './EditBug';
import Created from './Created';
import Deleted from './Deleted';
import Updated from './Updated';
import TaskList from './TaskList';
import Task from './Task';
import MyCreatedTasks from './MyCreatedTasks';
import MyAssignedTasks from './MyAssignedTasks';
import EditTask from './EditTask';
import DeletedTask from './DeletedTask';
import UpdatedTask from './UpdatedTask';
import FinishedBug from './FinishedBug';
import FinishedTask from './FinishedTask';

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      bugs: null
    }

  }

  componentDidMount() {
    // fetching the bugs and sorting them by status
    api.fetchBugList().then(res => {
      res.sort((a, b) => 
            ((a.status === "Open" && b.status === "In Progress") || (a.status === "Open" && b.status === "Closed") ||
            (a.status === "In Progress" && b.status === "Closed")) ? -1 :
            ((a.status === "Open" && b.status === "Open") || (a.status === "In Progress" && b.status === "In Progress") ||
            (a.status === "Closed" && b.status === "Closed")) ? 0 :
            ((a.status === "In Progress" && b.status === "Open") || (a.status === "Closed" && b.status === "Open") || 
            (a.status === "Closed" && b.status === "In Progress")) ? 1 : null
          ) 
      this.setState({ bugs: res })
    })
    
    let token = localStorage.getItem("auth-token");
    axios.get('/api/tasks', {headers: {"x-auth-token": token}})
      .then(res => {
        // fetching task list and sorting by status
        res.data.sort((a, b) => 
            ((a.status === "Open" && b.status === "In Progress") || (a.status === "Open" && b.status === "Closed") ||
            (a.status === "In Progress" && b.status === "Closed")) ? -1 :
            ((a.status === "Open" && b.status === "Open") || (a.status === "In Progress" && b.status === "In Progress") ||
            (a.status === "Closed" && b.status === "Closed")) ? 0 :
            ((a.status === "In Progress" && b.status === "Open") || (a.status === "Closed" && b.status === "Open") || 
            (a.status === "Closed" && b.status === "In Progress")) ? 1 : null
          ) 
        this.setState({tasks: res.data})
      })
  }

  // on logout, set token to null
  logout = () => {
    var setUserData = this.props.setUserData;
    setUserData({
      token: undefined,
      user: undefined
    })
    localStorage.setItem("auth-token", "");
    window.location.reload(false);
  }

  render() {
    var userData = this.props.userData;
    var setUserData = this.props.setUserData;
    return (
      <div>
        <UserContext.Provider value={{ userData, setUserData }}>
          <ul className="ul_navbar">
            <li><Link to="/">Home</Link></li>
            <li><Link to="/createNewData">Create New Data</Link></li>
            <li><Link to="/bugs">Bugs</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            {userData.user ?
              (
                <li><Link onClick={this.logout} to="/logout">Logout</Link></li>
              ) : (
                <>
                  <li><Link to="/register">Register</Link></li>
                  <li><Link to="/login">Login</Link></li>
                </>
              )
            }
          </ul>
          <Route exact path="/" component={Home} />
          <Route exact path="/createNewData" render={(props) => <CreateNewData {...props} bugs={this.state.bugs} />} />
          <Route exact path="/bugs" render={(props) => <BugList {...props} bugs={this.state.bugs} first={true}/>} />
          <Route exact path="/bug/:bugId" component={Bug} />
          <Route path="/bug/edit/:bugId" component={EditBug}/>
          <Route path="/login" component={Login} />
          <Route path="/register" component={Register} />
          <Route path="/bugs/myCreatedBugs" component={MyCreatedBugs} />
          <Route path="/bugs/myAssignedBugs" component={MyAssignedBugs}/>
          <Route path="/createNewData/created" component={Created}/>
          <Route path="/bugs/edit/deleted" component={Deleted}/>
          <Route path="/bugs/edit/updated" component={Updated}/>
          <Route exact path="/tasks" render={(props) => <TaskList {...props} tasks={this.state.tasks} />}/>
          <Route exact path="/task/:taskId" component={Task}/> 
          <Route path="/tasks/myCreatedTasks" component={MyCreatedTasks}/>
          <Route path="/tasks/myAssignedTasks" component={MyAssignedTasks}/>
          <Route path="/task/edit/:taskId" component={EditTask}/>
          <Route path="/tasks/edit/deleted" component={DeletedTask}/>
          <Route path="/tasks/edit/updated" component={UpdatedTask}/>
          <Route path="/bugs/finished" component={FinishedBug}/>
          <Route path="/tasks/finished" component={FinishedTask}/>
        </UserContext.Provider>
      </div>
    )
  }
}

export default App;