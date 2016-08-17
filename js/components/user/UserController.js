'use strict';

import React from 'react';
import assign from 'object-assign';

import Actions from '../../actions/Actions';
import User from './User';
import UserFactory from '../../utils/UserFactory';
import UserStore from '../../stores/UserStore';
import RouterStore from '../../stores/RouterStore';
import Routes from '../../utils/Routes';
import Routing from '../../utils/Routing';

export default class UserController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this._isNew() ? UserFactory.initNewUser() : null,
            loading: false
        };
    }

    _isNew() {
        return !this.props.params.username;
    }

    componentWillMount() {
        if (!this.state.user) {
            Actions.loadUser(this.props.params.username);
            this.setState({loading: true});
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

    _onSave = () => {
        var user = this.state.user;
        if (user.isNew) {
            delete user.isNew;
            Actions.createUser(user, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateUser(user, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = () => {

    };

    _onSaveError = () => {

    };

    _onCancel = () => {
        var handlers = RouterStore.getViewHandlers(Routes.editUser.name);
        if (handlers) {
            Routing.transitionTo(handlers.onCancel);
        } else {
            Routing.transitionTo(Routes.users);
        }
    };

    _onChange = (change) => {
        var update = assign({}, this.state.user, change);
        this.setState({user: update});
    };

    render() {
        return <User onSave={this._onSave} onCancel={this._onCancel} onChange={this._onChange} user={this.state.user}
                     loading={this.state.loading}/>;
    }
}
