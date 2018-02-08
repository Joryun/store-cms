
import React from "react"
import {
    HashRouter as Router,
    Route,
    Link,
    Redirect,
    Switch
} from 'react-router-dom';

import * as routeList from './configs/routeList.js';


/**
 * 封装自己的路由
 */
const router = () => {
    return (
        <Router>
            <Switch>
                {
                    routeList.mainRoute.map((item) => {
                        return (
                            <Route key={item.path} path={item.path} component={item.component} />
                        );
                    })
                }
            </Switch>
        </Router>
    );
};

export default router;