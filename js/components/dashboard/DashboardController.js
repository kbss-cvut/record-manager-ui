'use strict';

import Dashboard from "./Dashboard";
import React from 'react';
import injectIntl from '../../utils/injectIntl';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {connect} from "react-redux";

class DashboardController extends React.Component {
    constructor(props) {
        super(props);
    }

    _showUsers = () => {
        Routing.transitionTo(Routes.users);
    };

    _showMyProfile = () => {
        Routing.transitionTo(Routes.editUser, {
            params: {username: this.props.currentUser.username}
        });
    };

    _showInstitutions = () => {
        Routing.transitionTo(Routes.institutions);
    };

    _showMyInstitution = () => {
        Routing.transitionTo(Routes.editInstitution, {
            params: {key: this.props.currentUser.institution.key}
        });
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
            createRecord: this._createRecord,
            showMyInstitution: this._showMyInstitution,
            showMyProfile: this._showMyProfile
        };
        return (
        <div>
            <Dashboard currentUser={this.props.currentUser} handlers={handlers}/>
        </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(DashboardController))));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}