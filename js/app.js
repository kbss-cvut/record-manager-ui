/**
 Main entry point for the ReactJS frontend
 */

'use strict';

var I18nStore = require('./stores/I18nStore');
var addLocaleData = require('react-intl').addLocaleData;

var intlData = null;

function selectLocalization() {
    // Load react-intl locales
    if ('ReactIntlLocaleData' in window) {
        Object.keys(ReactIntlLocaleData).forEach(function (lang) {
            addLocaleData(ReactIntlLocaleData[lang]);
        });
    }
    var lang = navigator.language;
    // if (lang && lang === 'cs' || lang === 'cs-CZ' || lang === 'sk' || lang === 'sk-SK') {
    //     intlData = require('./i18n/cs');
    // } else {
    //     intlData = require('./i18n/en');
    // }
    intlData = require('./i18n/en');
}

selectLocalization();
I18nStore.setMessages(intlData.messages);

// Have the imports here, so that the I18nStore is initialized before any of the components which might need it
import React from "react";
import ReactDOM from "react-dom";
import {Router, Route, IndexRoute} from "react-router";
import {IntlProvider} from "react-intl";

import {history} from "./utils/Routing";
import Routes from "./utils/Routes";
import Actions from "./actions/Actions";

import Login from "./components/login/Login";
import MainView from "./components/MainView";
import ClinicController from "./components/clinic/ClinicController";
import ClinicsController from "./components/clinic/ClinicsController";
import DashboardController from "./components/dashboard/DashboardController";
import RecordController from "./components/record/RecordController";
import RecordsController from "./components/record/RecordsController";
import UsersController from "./components/user/UsersController";
import UserController from "./components/user/UserController";
import RoutingRules from "./utils/RoutingRules";


function onRouteEnter() {
    RoutingRules.execute(this.path);
}

// Wrapping router in a React component to allow Intl to initialize
var App = React.createClass({
    render: function () {
        return <IntlProvider {...intlData}>
            <Router history={history}>
                <Route path='/' component={MainView}>
                    <IndexRoute component={DashboardController}/>
                    <Route path={Routes.login.path} onEnter={onRouteEnter} component={Login}/>
                    <Route path={Routes.dashboard.path} onEnter={onRouteEnter} component={DashboardController}/>
                    <Route path={Routes.users.path} onEnter={onRouteEnter} component={UsersController}/>
                    <Route path={Routes.createUser.path} onEnter={onRouteEnter} component={UserController}/>
                    <Route path={Routes.editUser.path} onEnter={onRouteEnter} component={UserController}/>
                    <Route path={Routes.clinics.path} onEnter={onRouteEnter} component={ClinicsController}/>
                    <Route path={Routes.createClinic.path} onEnter={onRouteEnter} component={ClinicController}/>
                    <Route path={Routes.editClinic.path} onEnter={onRouteEnter} component={ClinicController}/>
                    <Route path={Routes.records.path} onEnter={onRouteEnter} component={RecordsController}/>
                    <Route path={Routes.createRecord.path} onEnter={onRouteEnter} component={RecordController}/>
                    <Route path={Routes.editRecord.path} onEnter={onRouteEnter} component={RecordController}/>
                </Route>
            </Router>
        </IntlProvider>;
    }
});

Actions.loadCurrentUser();

// Pass intl data to the top-level component
ReactDOM.render(<App/>, document.getElementById('content'));
