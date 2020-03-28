'use strict';

import React from "react";
import {IntlProvider} from "react-intl";
import {Route, Router} from "react-router-dom";
import MainView from "./components/MainView";
import {connect} from "react-redux";

const App = (props) => (
    <IntlProvider {...props.intl}>
        <Router history={props.history}>
            <Route path='/' component={MainView}/>
        </Router>
    </IntlProvider>
);

export default connect((state) => {
    return {intl: state.intl}
})(App);
