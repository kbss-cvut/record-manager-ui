'use strict';

import React from "react";
import assign from "object-assign";
import Actions from "../../actions/Actions";
import Institution from "./Institution";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import {Routes} from "../../utils/Routes";
import {transitionTo, transitionToWithOpts} from "../../utils/Routing";
import {connect} from "react-redux";
import {ACTION_FLAG, ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";
import {bindActionCreators} from "redux";
import {
    unloadSavedInstitution} from "../../actions/InstitutionActions";
import {canLoadInstitutionsPatients} from "../../utils/Utils";
import {loadInstitutionMembers} from "../../actions/UserActions";
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

    _isNew() {
        return !this.props.params.key;
    }

    componentWillMount() {
        const institutionKey = this.props.params.key;
        if (!this.state.institution) {
            this.props.loadInstitution(institutionKey);
        }
        if (institutionKey) {
            this.props.loadInstitutionMembers(institutionKey);
            if (this.props.status === ACTION_STATUS.SUCCESS && canLoadInstitutionsPatients(institutionKey, this.props.currentUser)) {
                this.props.loadRecords(null, institutionKey);
            }
        }
        if(this.props.institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
            this.setState({showAlert: true});
            this.props.unloadSavedInstitution();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved && nextProps.institutionLoaded.status !== ACTION_STATUS.PENDING
            && nextProps.institutionSaved.status === ACTION_STATUS.SUCCESS) {
            if (nextProps.institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                this.props.transitionToWithOpts(Routes.editInstitution, {
                    params: {key: nextProps.institutionSaved.institution.key},
                    handlers: {
                        onCancel: Routes.institutions
                    }
                });
            } else {
                this.setState({saved: false});
                this.props.loadInstitution(this.state.institution.key);
            }
        }
        if (this.props.institutionLoaded.status === ACTION_STATUS.PENDING && nextProps.institutionLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({institution: nextProps.institutionLoaded.institution});
        }
    }

    componentWillUnmount() {
        this.props.unloadInstitution();
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
        } else if (this.props.currentUser.role === ROLE.ADMIN){
            transitionTo(Routes.institutions);
        } else {
            transitionTo(Routes.dashboard);
        }
    };

    _onChange = (change) => {
        const update = assign({}, this.state.institution, change);
        this.setState({institution: update});
    };

    _onDeleteUser = (user, institutionKey) => {
        Actions.deleteUser(user, () => Actions.loadInstitutionMembers(institutionKey));
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
        const {currentUser, institutionLoaded, institutionSaved, institutionMembers, recordsLoaded} = this.props;
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
        return <Institution handlers={handlers} institution={this.state.institution} institutionMembers={institutionMembers}
                            recordsLoaded={recordsLoaded} showAlert={this.state.showAlert} currentUser={currentUser}
                            institutionLoaded={institutionLoaded} institutionSaved={institutionSaved}
                            />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(InstitutionController)));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        status: state.auth.status,
        institutionLoaded: state.institution.institutionLoaded,
        institutionSaved: state.institution.institutionSaved,
        institutionMembers: state.user.institutionMembers,
        recordsLoaded: state.records.recordsLoaded,
        viewHandlers: state.router.viewHandlers
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
        transitionToWithOpts:bindActionCreators(transitionToWithOpts, dispatch)
    }
}