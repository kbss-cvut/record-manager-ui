'use strict';

import React from "react";
import {IntlProvider} from "react-intl";
import {Route, Router} from "react-router-dom";
import MainView from "./components/MainView";
import {connect} from "react-redux";
import {history} from "./utils/Routing";
import {BASENAME} from "../config";

const App = (props) => (
    <IntlProvider {...props.intl}>
        <Router history={history} basename={BASENAME}>
            <Route path='/' component={MainView}/>
        </Router>
    </IntlProvider>
);

export default connect((state) => {
    return {intl: state.intl}
})(App);
