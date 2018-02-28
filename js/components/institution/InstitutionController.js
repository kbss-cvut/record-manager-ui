'use strict';

import React from "react";
import assign from "object-assign";
import Actions from "../../actions/Actions";
import Authentication from "../../utils/Authentication";
import Institution from "./Institution";
import InstitutionStore from "../../stores/InstitutionStore";
import EntityFactory from "../../utils/EntityFactory";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import RecordStore from "../../stores/RecordStore";
import RouterStore from "../../stores/RouterStore";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import UserStore from "../../stores/UserStore";
import {connect} from "react-redux";

class InstitutionController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            institution: this._isNew() ? EntityFactory.initNewInstitution() : null,
            members: [],
            patients: [],
            loading: false
        };
    }

    _isNew() {
        return !this.props.params.key;
    }

    componentWillMount() {
        var institutionKey = this.props.params.key;
        if (!this.state.institution) {
            Actions.loadInstitution(institutionKey);
            this.setState({loading: true});
        }
        if (institutionKey) {
            Actions.loadInstitutionMembers(institutionKey);
            if (Authentication.canLoadInstitutionsPatients(institutionKey)) {
                Actions.loadInstitutionPatients(institutionKey);
            }
        }
        this.unsubscribe = InstitutionStore.listen(this._onInstitutionLoaded);
        this.unsubscribeMembers = UserStore.listen(this._onMembersLoaded);
        this.unsubscribePatients = RecordStore.listen(this._onPatientsLoaded);
    }

    _onInstitutionLoaded = (data) => {
        if (data.action === Actions.loadInstitution) {
            this.setState({institution: data.data, loading: false});
        }
    };

    _onMembersLoaded = (data) => {
        if (data.action === Actions.loadInstitutionMembers && this.props.params.key === data.institutionKey) {
            this.setState({members: data.data});
        }
    };

    _onPatientsLoaded = (data) => {
        if (data.action === Actions.loadInstitutionPatients && this.props.params.key === data.institutionKey) {
            this.setState({patients: data.data});
        }
    };

    componentWillUnmount() {
        this.unsubscribe();
        this.unsubscribeMembers();
        this.unsubscribePatients();
    }

    _onSave = () => {
        var institution = this.state.institution;
        if (institution.isNew) {
            delete institution.isNew;
            Actions.createInstitution(institution, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateInstitution(institution, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = (newKey) => {
        this.props.showSuccessMessage(this.props.i18n('institution.save-success'));
        Actions.loadInstitution(newKey ? newKey : this.props.params.key);
    };

    _onSaveError = (err) => {
        this.props.showErrorMessage(this.props.formatMessage('institution.save-error', {error: err.message}));
    };

    _onCancel = () => {
        var handlers = RouterStore.getViewHandlers(Routes.editInstitution.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.institutions);
        }
    };

    _onChange = (change) => {
        var update = assign({}, this.state.institution, change);
        this.setState({institution: update});
    };

    _onDeleteUser = (user, institutionKey) => {
        Actions.deleteUser(user, () => Actions.loadInstitutionMembers(institutionKey));
    };

    _onEditUser = (user, institution) => {
        Routing.transitionTo(Routes.editUser, {
            params: {username: user.username},
            payload: {institution: institution}
        });
    };

    _onAddNewUser = (institution) => {
        Routing.transitionTo(Routes.createUser, {
            payload: {institution: institution}
        });
    };

    render() {
        const {currentUser} = this.props;
        if (!currentUser) {
            return null;
        }
        return <Institution onSave={this._onSave} onCancel={this._onCancel} onChange={this._onChange} onEditUser={this._onEditUser}
                            onAddNewUser={this._onAddNewUser} onDelete={this._onDeleteUser}
                            institution={this.state.institution} members={this.state.members} patients={this.state.patients}
                            loading={this.state.loading} currentUser={this.props.currentUser}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(InstitutionController))));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
    }
}