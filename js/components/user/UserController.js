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

class UserController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: this._isNew() ? UserFactory.initNewUser() : null,
            loading: false
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

    _onSave = () => {
        var user = this.state.user;
        if (user.isNew) {
            delete user.isNew;
            this.props.createUser(user, this._onSaveSuccess, this._onSaveError);
            //Actions.createUser(user, this._onSaveSuccess, this._onSaveError);
        } else {
            Actions.updateUser(user, this._onSaveSuccess, this._onSaveError);
        }
    };

    _onSaveSuccess = (username) => {
        this.props.showSuccessMessage(this.props.i18n('user.save-success'));
        Actions.loadUser(username ? username : this.props.params.username);
    };

    _onSaveError = (err) => {
        this.props.showErrorMessage(this.props.formatMessage('user.save-error', {error: err.message}));
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
        console.log("Saving property set to : ", this.props.userCreation);
        return <User onSave={this._onSave} onCancel={this._onCancel} onChange={this._onChange} user={this.state.user}
                     backToInstitution={this.institution !== null} loading={this.state.loading}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(UserController))));

function mapStateToProps(state) {
    return {
        userCreation: state.user.userCreation
    };
}

function mapDispatchToProps(dispatch) {
    return {
        createUser: bindActionCreators(createUser, dispatch)
    }
}