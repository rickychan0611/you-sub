import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

import Home from "../pages/Home";
import View from "../pages/View";
import Register from "../pages/Register";

export default (props) => {
    return (
        <Switch>
            <Route exact path="/" component={Home} />
            <Route exact path="/home" component={Home} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/view" component={View} />
        </Switch>
    )
}