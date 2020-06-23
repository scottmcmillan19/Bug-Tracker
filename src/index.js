import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, Switch } from 'react-router-dom';
import App from './components/App';
import history from './history';
import UserContext from './context/UserContext';
import Hook from './components/Hook';


ReactDOM.render(
  <Router history={history}>
      <Route path="/" component={Hook} />
  </Router>,
  document.getElementById('root')
);










