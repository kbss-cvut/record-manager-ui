'use strict';

import React from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import PasswordToken from '../components/login/PasswordToken';
import PasswordReset from '../components/login/PasswordReset';
import Login from '../components/login/Login';
import Logout from '../components/login/Logout';
import requireAuth from '../components/misc/hoc/RequireAuth';
import UsersController from '../components/user/UsersController';
import UserController from '../components/user/UserController';
import PasswordChangeController from '../components/user/PasswordChangeController';
import Statistics from '../components/statistics/Statistics';
import InstitutionsController from '../components/institution/InstitutionsController';
import InstitutionController from '../components/institution/InstitutionController';
import RecordsController from '../components/record/RecordsController';
import RecordController from '../components/record/RecordController';
import HistoryActions from '../components/history/HistoryList';
import HistoryAction from '../components/history/HistoryDetail';
import DashboardController from '../components/dashboard/DashboardController';
import Routes from '../constants/RoutesConstants';

export const unauthRoutes = (
    <Switch>
        <Route exact path={Routes.passwordToken.path} component={PasswordToken}/>
        <Route exact path={Routes.passwordReset.path} component={PasswordReset}/>
        <Route exact path={Routes.login.path} component={Login}/>
        <Redirect from="*" to={Routes.login.path}/>
    </Switch>);

export const authRoutes = (
    <Switch>
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
               render={routeProps => (
                   <RecordController {...routeProps}/>
               )}>
        </Route>
        <Route exact path={Routes.editRecord.path}
               render={routeProps => (
                   <RecordController {...routeProps}/>
               )}>
        </Route>
        <Route exact path={Routes.historyActions.path}
               component={requireAuth(HistoryActions)}/>
        <Route exact path={Routes.historyAction.path}
               component={requireAuth(HistoryAction)}/>
        <Route exact path={Routes.dashboard.path}
               component={requireAuth(DashboardController)}/>
        <Redirect from="*" to={'/'}/>
    </Switch>
);