/**
 Main entry point for the ReactJS frontend
 */

'use strict';

import {loadUserProfile} from "./actions/AuthActions";
import * as I18nStore from './stores/I18nStore';
import {addLocaleData} from 'react-intl';

let intlData = null;

function selectLocalization() {
    // Load react-intl locales
    if ('ReactIntlLocaleData' in window) {
        Object.keys(ReactIntlLocaleData).forEach(function (lang) {
            addLocaleData(ReactIntlLocaleData[lang]);
        });
    }
    const lang = navigator.language;
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
import {render} from 'react-dom';
import {Router, Route, IndexRoute, Redirect} from "react-router";
import {IntlProvider} from "react-intl";
import {applyMiddleware, compose, createStore} from "redux";
import rootReducer from "./reducers";
import {Provider} from "react-redux";
import thunk from "redux-thunk";

import {history} from "./utils/Routing";
import {Routes} from "./utils/Routes";

import Login from "./components/login/Login";
import InstitutionController from "./components/institution/InstitutionController";
import InstitutionsController from "./components/institution/InstitutionsController";
import DashboardController from "./components/dashboard/DashboardController";
import RecordController from "./components/record/RecordController";
import RecordsController from "./components/record/RecordsController";
import UsersController from "./components/user/UsersController";
import UserController from "./components/user/UserController";
import {execute} from "./utils/RoutingRules";
import PasswordReset from "./components/login/PasswordReset";
import MainView from "./components/MainView";
import requireAuth from './components/misc/hoc/RequireAuth';
import PasswordChangeController from "./components/user/PasswordChangeController";
import HistoryActions from "./components/history/HistoryList";
import HistoryAction from "./components/history/HistoryDetail";
import {errorLogger, historyLogger} from "./utils/HistoryLogger";
import Statistics from "./components/statistics/Statistics";
import PasswordToken from "./components/login/PasswordToken";
import Logout from "./components/login/Logout";

function onRouteEnter() {
    execute(this.path);
}

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
    rootReducer,
    composeEnhancers(
        applyMiddleware(thunk, historyLogger)
    )
);

window.onerror = (msg, source, line) => {
    errorLogger(msg, line, store);
    return false;
};

store.dispatch(loadUserProfile());

// Wrapping router in a React component to allow Intl to initialize
const App = () => (<Provider store={store}>
        <IntlProvider {...intlData}>
            <Router history={history}>
                <Route path='/' component={MainView}>
                    <IndexRoute component={requireAuth(DashboardController)}/>
                    <Route path={Routes.login.path} onEnter={onRouteEnter} component={Login}/>
                    <Route path={Routes.logout.path} onEnter={onRouteEnter} component={Logout}/>
                    <Route path={Routes.passwordReset.path} onEnter={onRouteEnter} component={PasswordReset}/>
                    <Route path={Routes.passwordToken.path} onEnter={onRouteEnter} component={PasswordToken}/>
                    <Route path={Routes.dashboard.path} onEnter={onRouteEnter}
                           component={requireAuth(DashboardController)}/>
                    <Route path={Routes.users.path} onEnter={onRouteEnter} component={requireAuth(UsersController)}/>
                    <Route path={Routes.createUser.path} onEnter={onRouteEnter}
                           component={requireAuth(UserController)}/>
                    <Route path={Routes.editUser.path} onEnter={onRouteEnter} component={requireAuth(UserController)}/>
                    <Route path={Routes.passwordChange.path} onEnter={onRouteEnter}
                           component={requireAuth(PasswordChangeController)}/>
                    <Route path={Routes.statistics.path} onEnter={onRouteEnter} component={requireAuth(Statistics)}/>
                    <Route path={Routes.institutions.path} onEnter={onRouteEnter}
                           component={requireAuth(InstitutionsController)}/>
                    <Route path={Routes.createInstitution.path} onEnter={onRouteEnter}
                           component={requireAuth(InstitutionController)}/>
                    <Route path={Routes.editInstitution.path} onEnter={onRouteEnter}
                           component={requireAuth(InstitutionController)}/>
                    <Route path={Routes.records.path} onEnter={onRouteEnter}
                           component={requireAuth(RecordsController)}/>
                    <Route path={Routes.createRecord.path} onEnter={onRouteEnter}
                           component={requireAuth(RecordController)}/>
                    <Route path={Routes.editRecord.path} onEnter={onRouteEnter}
                           component={requireAuth(RecordController)}/>
                    <Route path={Routes.historyActions.path} onEnter={onRouteEnter}
                           component={requireAuth(HistoryActions)}/>
                    <Route path={Routes.historyAction.path} onEnter={onRouteEnter}
                           component={requireAuth(HistoryAction)}/>
                    <Redirect from="*" to={Routes.dashboard.path}/>
                </Route>
            </Router>
        </IntlProvider>
    </Provider>
);

// Pass intl data to the top-level component
render(<App/>, document.getElementById('content'));
