'use strict';

import Dashboard from "./Dashboard";
import React from 'react';
import injectIntl from '../../utils/injectIntl';
import UserStore from '../../stores/UserStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";

class DashboardController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName: UserStore.getCurrentUser() ? UserStore.getCurrentUser().firstName : ''
        };
    }

    onUserLoaded(user) {
        this.setState({firstName: user.firstName});
    }

    _showUsers = () => {
        Routing.transitionTo(Routes.users);
    };

    _showInstitutions = () => {
        Routing.transitionTo(Routes.institutions);
    };

    _showRecords = () => {
        Routing.transitionTo(Routes.records);
    };

    _createRecord = () => {
        {/*TODO bug on cancel it doesnt return to dashboard but to patient records */}
        Routing.transitionTo(Routes.createRecord, {
            handlers: {
                onSuccess: Routes.records,
                onCancel: Routes.dashboard
            }
        });
    };

    render() {
        const handlers = {
            showUsers: this._showUsers,
            showInstitutions: this._showInstitutions,
            showRecords: this._showRecords,
            createRecord: this._createRecord
        };
        return (
        <div>
            <Dashboard userFirstName={this.state.firstName} handlers={handlers}/>
        </div>
        );
    }
}


export default injectIntl(I18nWrapper(MessageWrapper(DashboardController)));
