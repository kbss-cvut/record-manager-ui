'use strict';

import React from "react";
import Institution from "./Institution";
import {injectIntl} from "react-intl";
import withI18n from "../../i18n/withI18n";
import {Routes} from "../../utils/Routes";
import {transitionTo, transitionToWithOpts} from "../../utils/Routing";
import {connect} from "react-redux";
import {ACTION_FLAG, ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";
import {bindActionCreators} from "redux";
import {
    unloadSavedInstitution
} from "../../actions/InstitutionActions";
import {canLoadInstitutionsPatients} from "../../utils/Utils";
import {deleteUser, loadInstitutionMembers, unloadInstitutionMembers} from "../../actions/UserActions";
import {
    createInstitution, loadInstitution, unloadInstitution,
    updateInstitution
} from "../../actions/InstitutionActions";
import * as EntityFactory from "../../utils/EntityFactory";
import {loadRecords} from "../../actions/RecordsActions";
import omit from 'lodash/omit';

class InstitutionController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            institution: this._isNew() ? EntityFactory.initNewInstitution() : null,
            saved: false,
            showAlert: false
        };
    }

    componentDidMount() {
        const institutionKey = this.props.match.params.key;

        if (!this.state.institution) {
            this.props.loadInstitution(institutionKey);
        }
        if (institutionKey) {
            this.props.loadInstitutionMembers(institutionKey);
            if (this.props.status === ACTION_STATUS.SUCCESS && canLoadInstitutionsPatients(institutionKey, this.props.currentUser)) {
                this.props.loadRecords(null, institutionKey);
            }
        }
        if (this.props.institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY && this.props.institutionSaved.status === ACTION_STATUS.SUCCESS) {
            this.setState({showAlert: true});
            this.props.unloadSavedInstitution();
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        const {institutionLoaded, institutionSaved, transitionToWithOpts} = this.props;

        if (prevProps.institutionLoaded.status === ACTION_STATUS.PENDING && institutionLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({institution: institutionLoaded.institution});
        }

        if (this.state.saved && institutionLoaded.status !== ACTION_STATUS.PENDING
            && institutionSaved.status === ACTION_STATUS.SUCCESS) {
            if (institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                transitionToWithOpts(Routes.editInstitution, {
                    params: {key: institutionSaved.institution.key},
                    handlers: {
                        onCancel: Routes.institutions
                    }
                });
            } else {
                this.setState({saved: false});
                loadInstitution(this.state.institution.key);
            }
        }
    }

    componentWillUnmount() {
        this.props.unloadInstitution();
        this.props.unloadInstitutionMembers();
    }

    _isNew() {
        return !this.props.match.params.key;
    }

    _onSave = () => {
        const institution = this.state.institution;
        this.setState({saved: true, showAlert: true});
        if (institution.isNew || (this._isNew() && this.props.institutionSaved.status === ACTION_STATUS.ERROR)) {
            this.props.createInstitution(omit(institution, 'isNew'));
        } else {
            this.props.updateInstitution(institution);
        }
    };

    _onCancel = () => {
        const handlers = this.props.viewHandlers[Routes.editInstitution.name];
        if (handlers) {
            transitionTo(handlers.onCancel);
        } else if (this.props.currentUser.role === ROLE.ADMIN) {
            transitionTo(Routes.institutions);
        } else {
            transitionTo(Routes.dashboard);
        }
    };

    _onChange = (change) => {
        const update = {...this.state.institution, ...change};
        this.setState({institution: update});
    };

    _onDeleteUser = (user) => {
        this.props.deleteUser(user, this.state.institution);
    };

    _onEditUser = (user, institution) => {
        this.props.transitionToWithOpts(Routes.editUser, {
            params: {username: user.username},
            payload: {institution: institution}
        });
    };

    _onEditPatient = (patient) => {
        this.props.transitionToWithOpts(Routes.editRecord, {params: {key: patient.key}});
    };

    _onAddNewUser = (institution) => {
        this.props.transitionToWithOpts(Routes.createUser, {
            payload: {institution: institution}
        });
    };

    render() {
        const {currentUser, institutionLoaded, institutionSaved, institutionMembers, recordsLoaded, userDeleted} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange,
            onEditUser: this._onEditUser,
            onAddNewUser: this._onAddNewUser,
            onEditPatient: this._onEditPatient,
            onDelete: this._onDeleteUser
        };
        return <Institution handlers={handlers} institution={this.state.institution}
                            institutionMembers={institutionMembers}
                            recordsLoaded={recordsLoaded} showAlert={this.state.showAlert} currentUser={currentUser}
                            institutionLoaded={institutionLoaded} institutionSaved={institutionSaved}
                            userDeleted={userDeleted}
        />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(InstitutionController)));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        status: state.auth.status,
        institutionLoaded: state.institution.institutionLoaded,
        institutionSaved: state.institution.institutionSaved,
        institutionMembers: state.user.institutionMembers,
        recordsLoaded: state.records.recordsLoaded,
        viewHandlers: state.router.viewHandlers,
        userDeleted: state.user.userDeleted
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadInstitution: bindActionCreators(loadInstitution, dispatch),
        unloadInstitution: bindActionCreators(unloadInstitution, dispatch),
        unloadSavedInstitution: bindActionCreators(unloadSavedInstitution, dispatch),
        createInstitution: bindActionCreators(createInstitution, dispatch),
        updateInstitution: bindActionCreators(updateInstitution, dispatch),
        loadInstitutionMembers: bindActionCreators(loadInstitutionMembers, dispatch),
        loadRecords: bindActionCreators(loadRecords, dispatch),
        deleteUser: bindActionCreators(deleteUser, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch),
        unloadInstitutionMembers: bindActionCreators(unloadInstitutionMembers, dispatch)
    }
}