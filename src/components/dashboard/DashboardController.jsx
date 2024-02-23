'use strict';

import Dashboard from "./Dashboard";
import React from 'react';
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {injectIntl} from "react-intl";
import Routes from '../../constants/RoutesConstants';
import {transitionTo, transitionToWithOpts} from '../../utils/Routing';
import withI18n from "../../i18n/withI18n";
import {loadFormTemplates} from "../../actions/FormTemplatesActions";
import {importRecords} from "../../actions/RecordsActions";

class DashboardController extends React.Component {
    constructor(props) {
        super(props);
    }

    _showUsers = () => {
        transitionTo(Routes.users);
    };

    _showMyProfile = () => {
        this.props.transitionToWithOpts(Routes.editUser, {
            params: {username: this.props.currentUser.username}
        });
    };

    _showInstitutions = () => {
        transitionTo(Routes.institutions);
    };

    _showMyInstitution = () => {
        this.props.transitionToWithOpts(Routes.editInstitution, {
            params: {key: this.props.currentUser.institution.key}
        });
    };

    _showRecords = (formTemplate) => {
        const opts = {};
        if (formTemplate) {
            opts.query = new Map([["formTemplate", formTemplate]]);
        }
        this.props.transitionToWithOpts(Routes.records, opts);
    };

    _showStatistics = () => {
        transitionTo(Routes.statistics);
    };

    _createRecord = () => {
        {/*TODO bug on cancel it doesnt return to dashboard but to patient records */
        }
        this.props.transitionToWithOpts(Routes.createRecord, {
            handlers: {
                onSuccess: Routes.records,
                onCancel: Routes.dashboard
            }
        });
    };

    _importRecords = (file) => {
        return this.props.importRecords(file);
    }

    componentDidMount() {
        this.props.loadFormTemplates();
    }

    render() {
        const handlers = {
            showUsers: this._showUsers,
            showInstitutions: this._showInstitutions,
            showRecords: this._showRecords,
            createRecord: this._createRecord,
            importRecords: this._importRecords,
            showMyInstitution: this._showMyInstitution,
            showMyProfile: this._showMyProfile,
            showStatistics: this._showStatistics
        };
        return (
            <div>
                <Dashboard currentUser={this.props.currentUser}
                           formTemplatesLoaded={this.props.formTemplatesLoaded}
                           handlers={handlers}/>
            </div>
        );
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(DashboardController)));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        formTemplatesLoaded: state.formTemplates.formTemplatesLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch),
        loadFormTemplates: bindActionCreators(loadFormTemplates, dispatch),
        importRecords: bindActionCreators(importRecords, dispatch)
    }
}