import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router-dom';
import history from './history';
import Hook from './components/Hook';

// starting the client-side rendering
ReactDOM.render(
  <Router history={history}>
      <Route path="/" component={Hook} />
  </Router>,
  document.getElementById('root')
);










