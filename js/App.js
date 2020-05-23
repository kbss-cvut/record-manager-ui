'use strict';

import React from "react";
import {IntlProvider} from "react-intl";
import {Route, Router} from "react-router-dom";
import MainView from "./components/MainView";
import {connect} from "react-redux";
import {history} from "./utils/Routing";

const App = (props) => (
    <IntlProvider {...props.intl}>
        <Router history={history} basename="/study-manager">
            <Route path='/' component={MainView}/>
        </Router>
    </IntlProvider>
);

export default connect((state) => {
    return {intl: state.intl}
})(App);
