import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from "../pages/Home";
import Register from "../pages/Register";

export default (props) => {
    return (
        <Switch>
            <Route path="/" component={Register} />
            {/* <Route path="/home" component={Home} /> */}
        </Switch>
    )
}