'use strict';

import React from "react";
import assign from "object-assign";
import Actions from "../../actions/Actions";
import Institution from "./Institution";
import EntityFactory from "../../utils/EntityFactory";
import injectIntl from "../../utils/injectIntl";
import I18nWrapper from "../../i18n/I18nWrapper";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import RouterStore from "../../stores/RouterStore";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import {connect} from "react-redux";
import {ACTION_FLAG, ACTION_STATUS} from "../../constants/DefaultConstants";
import {bindActionCreators} from "redux";
import {
    createInstitution, loadInstitution, loadInstitutionMembers, loadInstitutionPatients, unloadInstitution,
    updateInstitution
} from "../../actions";
import {canLoadInstitutionsPatients} from "../../utils/Utils";

class InstitutionController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            institution: this._isNew() ? EntityFactory.initNewInstitution() : null,
            loading: false,
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
            this.setState({loading: true});
            this.props.loadInstitution(institutionKey);
        }
        if (institutionKey) {
            this.props.loadInstitutionMembers(institutionKey);
            if (this.props.status === ACTION_STATUS.SUCCESS &&
                canLoadInstitutionsPatients(institutionKey, this.props.currentUser)) {
                this.props.loadInstitutionPatients(institutionKey);
            }
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved && nextProps.institutionLoaded.status !== ACTION_STATUS.PENDING
            && nextProps.institutionSaved.status === ACTION_STATUS.SUCCESS) {
            this.setState({saved: false});
            if (nextProps.institutionSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                this.props.loadInstitution(nextProps.institutionSaved.institution.key);
            } else {
                this.props.loadInstitution(this.state.institution.key);
            }
        }
        if (this.props.institutionLoaded.status === ACTION_STATUS.PENDING && nextProps.institutionLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({institution: nextProps.institutionLoaded.institution, loading: false});
        }
        if (this.props.institutionLoaded.status === ACTION_STATUS.PENDING && nextProps.institutionLoaded.status === ACTION_STATUS.ERROR) {
            this.setState({loading: false});
        }
    }

    componentWillUnmount() {
        this.props.unloadInstitution();
    }

    _onSave = () => {
        const institution = this.state.institution;
        this.setState({saved: true, showAlert: true});
        if (institution.isNew || (this._isNew() && this.props.institutionSaved.status === ACTION_STATUS.ERROR)) {
            delete institution.isNew;
            this.props.createInstitution(institution);
        } else {
            this.props.updateInstitution(institution);
        }
    };

    _onCancel = () => {
        const handlers = RouterStore.getViewHandlers(Routes.editInstitution.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.institutions);
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
        const {currentUser, institutionLoaded, institutionSaved, institutionMembers, institutionPatients} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange,
            onEditUser: this._onEditUser,
            onAddNewUser: this._onAddNewUser,
            onDelete: this._onDeleteUser
        };
        return <Institution handlers={handlers} institution={this.state.institution} members={institutionMembers.members || []}
                            patients={institutionPatients.patients || []} loading={this.state.loading} showAlert={this.state.showAlert}
                            currentUser={currentUser} institutionLoaded={institutionLoaded} institutionSaved={institutionSaved}
                            />;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(InstitutionController))));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        status: state.auth.status,
        institutionLoaded: state.institution.institutionLoaded,
        institutionSaved: state.institution.institutionSaved,
        institutionMembers: state.user.institutionMembers,
        institutionPatients: state.record.institutionPatients
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadInstitution: bindActionCreators(loadInstitution, dispatch),
        unloadInstitution: bindActionCreators(unloadInstitution, dispatch),
        createInstitution: bindActionCreators(createInstitution, dispatch),
        updateInstitution: bindActionCreators(updateInstitution, dispatch),
        loadInstitutionMembers: bindActionCreators(loadInstitutionMembers, dispatch),
        loadInstitutionPatients: bindActionCreators(loadInstitutionPatients, dispatch),
    }
}