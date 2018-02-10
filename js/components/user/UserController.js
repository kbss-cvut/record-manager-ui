'use strict';

import React from 'react';
import assign from 'object-assign';

import Actions from '../../actions/Actions';
import Authentication from '../../utils/Authentication';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import MessageWrapper from "../misc/hoc/MessageWrapper";
import User from './User';
import UserFactory from '../../utils/EntityFactory';
import UserStore from '../../stores/UserStore';
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';
import {createUser, updateUser} from "../../actions";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ACTION_TYPE} from "../../constants/DefaultConstants";

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
            Actions.loadUser(this.props.params.username);
            this.setState({loading: true});
        }
        if(this.institution) {
            this._onChange({institution: this.institution});
        }
        this.unsubscribe = UserStore.listen(this._onUserLoaded);
    }

    _onUserLoaded = (data) => {
        if (data.action !== Actions.loadUser) {
            return;
        }
        this.setState({user: data.data, loading: false});
    };

    componentWillUnmount() {
        this.unsubscribe();
    }

    componentWillUpdate(nextProps) {
        if (this.state.saved && nextProps.userSaved.actionType === ACTION_TYPE.CREATE_USER && nextProps.userSaved.success) {
            this.setState({saved: false});
            Actions.loadUser(nextProps.userSaved.user.username);
        }
    }

    _onSave = () => {
        let user = this.state.user;
        this.setState({saved: true, showAlert: true});
        if (user.isNew || (this._isNew() && this.props.userSaved.error)) {
            delete user.isNew;
            this.props.createUser(user, ACTION_TYPE.CREATE_USER);
        } else {
            this.props.updateUser(user, ACTION_TYPE.UPDATE_USER);
        }
    };

    _onCancel = () => {
        const handlers = RouterStore.getViewHandlers(Routes.editUser.name);
        if (handlers && !this.institution) {
            Routing.transitionTo(handlers.onCancel);
        } else if (this.institution) {
            Routing.transitionTo(Routes.editInstitution, {params: {key: this.institution.key}});
        } else {
            Routing.transitionTo(Authentication.isAdmin() ? Routes.users : Routes.dashboard);
        }
    };

    _goToUsersProfile = () => {
        this.setState({saved: false});

        Routing.transitionTo(Routes.editUser, {
            params: {username: this.props.userSaved.user.username},
            handlers: {
                onCancel: Routes.users
            }
        });
    };

    _onChange = (change) => {
        var update = assign({}, this.state.user, change);
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
        return <User onSave={this._onSave} onCancel={this._onCancel} onChange={this._onChange} user={this.state.user}
                     backToInstitution={this.institution !== null} loading={this.state.loading}
                     userSaved={this.props.userSaved} showAlert={this.state.showAlert}
                     usernameDisabled={!(this.state.showAlert && this.props.userSaved.actionType === ACTION_TYPE.CREATE_USER && !this.props.userSaved.success)}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(UserController))));

function mapStateToProps(state) {
    return {
        userSaved: state.user.userSaved
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: bindActionCreators(createUser, dispatch),
        updateUser: bindActionCreators(updateUser, dispatch)
    }
}