'use strict';

import React from "react";
import Authentication from "../../utils/Authentication";
import Routes from "../../utils/Routes";
import Routing from "../../utils/Routing";
import Users from "./Users";
import * as RouterStore from "../../stores/RouterStore";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {connect} from "react-redux";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {bindActionCreators} from "redux";
import {loadUsers} from "../../actions";

class UsersController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            users: this.props.usersLoaded.users || [],
        };
        this.institution = this._getPayload();
    }

    componentDidMount() {
        this.props.loadUsers();
    }

    _onEditUser = (user) => {
        Routing.transitionTo(Routes.editUser, {
            params: {username: user.username},
            handlers: {
                onCancel: Routes.users
            }
        });
    };

    _onAddUser = () => {
        Routing.transitionTo(Routes.createUser, {
            handlers: {
                onSuccess: Routes.users,
                onCancel: Routes.users
            }
        });
    };

    _onDeleteUser = (user) => {
        Actions.deleteUser(user, Actions.loadAllUsers);
    };

    _getPayload() {
        let payload = RouterStore.getTransitionPayload(Routes.users.name);
        RouterStore.setTransitionPayload(Routes.users.name, null);
        return payload ? payload.institution : null;
    };

    _onBackToInstitution = () => {
        Routing.transitionTo(Routes.editInstitution, {params: {key: this.institution.key}});
    };

    render() {
        const {usersLoaded} = this.props;
        if (!Authentication.isAdmin()) {
            return null;
        }
        const handlers = {
            onEdit: this._onEditUser,
            onCreate: this._onAddUser,
            onDelete: this._onDeleteUser,
            onBackToInstitution: this.institution ? this._onBackToInstitution : null
        };
        return <Users users={usersLoaded.users || []} showAlert={this.state.showAlert} handlers={handlers}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(UsersController))));

function mapStateToProps(state) {
    return {
        usersLoaded: state.user.usersLoaded
    };
}

function mapDispatchToProps(dispatch) {
    return {
        loadUsers: bindActionCreators(loadUsers, dispatch)
    }
}