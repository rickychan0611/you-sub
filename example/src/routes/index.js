import React from 'react';
import { Route, Switch } from 'react-router-dom';

import Home from "../pages/Home";

export default (props) => {
    return (
        <Switch>
            <Route path="/" component={Home} />
        </Switch>
    )
}