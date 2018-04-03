import React from 'react';
import ReactDOM from 'react-dom';
import {
    hashHistory,
    browserHistory,
    Route,
    Router,
    IndexRoute
}  from 'react-router';

import App from './components/app';
import Home from './components/home';
import './styles/bootstrap.min.css';
import './styles/app.css';

const Components=(
    <Router history={hashHistory}>
        <Route path="/" component={App}>
            <IndexRoute component={Home}/>
        </Route>
    </Router>
);

ReactDOM.render(Components, document.getElementById('app'));
