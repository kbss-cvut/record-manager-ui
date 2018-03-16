'use strict';

import React from 'react';
import assign from 'object-assign';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import User from './User';
import UserFactory from '../../utils/EntityFactory';
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import {createUser, loadInstitutions, loadUser, unloadSavedUser, unloadUser, updateUser} from "../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_FLAG, ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";

class UserController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this._isNew() ? UserFactory.initNewUser() : null,
            loading: false,
            saved: false,
            showAlert: false
        };
        this.institution = this._getPayload()
    }

    _isNew() {
        return !this.props.params.username;
    }

    componentWillMount() {
        if (!this.state.user) {
            this.setState({loading: true});
            this.props.loadUser(this.props.params.username);
        }
        if(this.institution) {
            this._onChange({institution: this.institution});
        }
        if(this.props.userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
            this.setState({showAlert: true});
            this.props.unloadSavedUser();
        }
    }

    componentWillUnmount() {
        this.props.unloadUser();
    }

    componentDidMount() {
        if(this.props.currentUser.role === ROLE.ADMIN && !this.props.institutionsLoaded.institutions) {
            this.props.loadInstitutions();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (this.state.saved && nextProps.userLoaded.status !== ACTION_STATUS.PENDING
            && nextProps.userSaved.status === ACTION_STATUS.SUCCESS) {
            if (nextProps.userSaved.actionFlag === ACTION_FLAG.CREATE_ENTITY) {
                Routing.transitionTo(Routes.editUser, {
                    params: {username: nextProps.userSaved.user.username},
                    handlers: {
                        onCancel: Routes.users
                    }
                });
            } else {
                this.setState({saved: false});
                this.props.loadUser(nextProps.userSaved.user.username);
            }
        }
        if (this.props.userLoaded.status === ACTION_STATUS.PENDING && nextProps.userLoaded.status === ACTION_STATUS.SUCCESS) {
            this.setState({user: nextProps.userLoaded.user, loading: false});
        }
        if (this.props.userLoaded.status === ACTION_STATUS.PENDING && nextProps.userLoaded.status === ACTION_STATUS.ERROR) {
            this.setState({loading: false});
        }
    }

    _onSave = () => {
        let user = this.state.user;
        this.setState({saved: true, showAlert: true});
        if (user.isNew || (this._isNew() && this.props.userSaved.status === ACTION_STATUS.ERROR)) {
            delete user.isNew;
            this.props.createUser(user);
        } else {
            this.props.updateUser(user);
        }
    };

    _onCancel = () => {
        const handlers = RouterStore.getViewHandlers(Routes.editUser.name);
        if (handlers && !this.institution) {
            Routing.transitionTo(handlers.onCancel);
        } else if (this.institution) {
            Routing.transitionTo(Routes.editInstitution, {params: {key: this.institution.key}});
        } else {
            Routing.transitionTo(this.props.currentUser.role === ROLE.ADMIN ? Routes.users : Routes.dashboard);
        }
    };

    _onChange = (change) => {
        const update = assign({}, this.state.user, change);
        this.setState({user: update});
    };

    _getPayload() {
        let payload = this._isNew() ? RouterStore.getTransitionPayload(Routes.createUser.name) :
                                      RouterStore.getTransitionPayload(Routes.editUser.name);
        this._isNew() ? RouterStore.setTransitionPayload(Routes.createUser.name, null) :
                        RouterStore.setTransitionPayload(Routes.editUser.name, null);
        return payload ? payload.institution : null;
    }

    render() {
        const {currentUser, userSaved, userLoaded, institutionsLoaded} = this.props;
        if (!currentUser) {
            return null;
        }
        const handlers = {
            onSave: this._onSave,
            onCancel: this._onCancel,
            onChange: this._onChange,
        };
        return <User user={this.state.user} handlers={handlers} backToInstitution={this.institution !== null}
                     loading={this.state.loading} userSaved={userSaved} showAlert={this.state.showAlert}
                     userLoaded={userLoaded} currentUser={currentUser}
                     institutions={institutionsLoaded.institutions || []}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(UserController)));

function mapStateToProps(state) {
    return {
        userSaved: state.user.userSaved,
        userLoaded: state.user.userLoaded,
        currentUser: state.auth.user,
        institutionsLoaded: state.institutions.institutionsLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: bindActionCreators(createUser, dispatch),
        updateUser: bindActionCreators(updateUser, dispatch),
        loadUser: bindActionCreators(loadUser, dispatch),
        unloadUser: bindActionCreators(unloadUser, dispatch),
        unloadSavedUser: bindActionCreators(unloadSavedUser, dispatch),
        loadInstitutions: bindActionCreators(loadInstitutions, dispatch)
    }
}