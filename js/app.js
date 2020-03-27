/**
 Main entry point for the ReactJS frontend
 */

'use strict';

import {loadUserProfile} from "./actions/AuthActions";
import * as I18nStore from './stores/I18nStore';
//import {addLocaleData} from 'react-intl';
import enLang from './i18n/en';
import csLang from './i18n/cs';

let intlData = null;

function selectLocalization() {
    // Load react-intl locales
    /*if ('ReactIntlLocaleData' in window) {
        Object.keys(ReactIntlLocaleData).forEach(function (lang) {
            addLocaleData(ReactIntlLocaleData[lang]);
        });
    }*/
    const lang = navigator.language;
    // if (lang && lang === 'cs' || lang === 'cs-CZ' || lang === 'sk' || lang === 'sk-SK') {
    //     intlData = csLang;
    // } else {
    //     intlData = enLang;
    // }

    if (LANGUAGE === 'cs') {
        intlData = csLang;
    } else {
        intlData = enLang;
    }
}

selectLocalization();
I18nStore.setMessages(intlData.messages);

// Have the imports here, so that the I18nStore is initialized before any of the components which might need it
import React from "react";
import {render} from 'react-dom';
import {Router, Redirect, Route, Switch} from 'react-router-dom';
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
import {LANGUAGE} from '../config';

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
                <Route path='/' component={MainView}/>
            </Router>
        </IntlProvider>
    </Provider>
);

export const unauthRoutes = <Switch>
    <Route exact path={Routes.passwordToken.path} component={PasswordToken}/>
    <Route exact path={Routes.passwordReset.path} component={PasswordReset}/>
    <Route exact path={Routes.login.path} component={Login}/>
    <Redirect from="*" to={Routes.login.path}/>
</Switch>;

export const authRoutes = (<Switch>
    <Route exact path={Routes.logout.path} component={Logout}/>
    <Route exact path={Routes.users.path}
           component={requireAuth(UsersController)}/>
    <Route exact path={Routes.createUser.path}
           component={requireAuth(UserController)}/>
    <Route exact path={Routes.editUser.path}
           component={requireAuth(UserController)}/>
    <Route exact path={Routes.passwordChange.path}
           component={requireAuth(PasswordChangeController)}/>
    <Route exact path={Routes.statistics.path}
           component={requireAuth(Statistics)}/>
    <Route exact path={Routes.institutions.path}
           component={requireAuth(InstitutionsController)}/>
    <Route exact path={Routes.createInstitution.path}
           component={requireAuth(InstitutionController)}/>
    <Route exact path={Routes.editInstitution.path}
           component={requireAuth(InstitutionController)}/>
    <Route exact path={Routes.records.path}
           component={requireAuth(RecordsController)}/>
    <Route exact path={Routes.createRecord.path}
           component={requireAuth(RecordController)}/>
    <Route exact path={Routes.editRecord.path}
           component={requireAuth(RecordController)}/>
    <Route exact path={Routes.historyActions.path}
           component={requireAuth(HistoryActions)}/>
    <Route exact path={Routes.historyAction.path}
           component={requireAuth(HistoryAction)}/>
    <Route exact path={Routes.dashboard.path}
           component={requireAuth(DashboardController)}/>
    <Redirect from="*" to={'/'}/>
</Switch>);

// Pass intl data to the top-level component
render(<App/>, document.getElementById('content'));
