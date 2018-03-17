'use strict';

import React from "react";
import Routes from "../../utils/Routes";
import {transitionToWithOpts} from "../../utils/Routing";
import Users from "./Users";
import MessageWrapper from "../misc/hoc/MessageWrapper";
import {connect} from "react-redux";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {bindActionCreators} from "redux";
import {deleteUser, loadUsers} from "../../actions";
import {ROLE} from "../../constants/DefaultConstants";

class UsersController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        this.props.loadUsers();
    }

    _onEditUser = (user) => {
        this.props.transitionToWithOpts(Routes.editUser, {
            params: {username: user.username},
            handlers: {
                onCancel: Routes.users
            }
        });
    };

    _onAddUser = () => {
        this.props.transitionToWithOpts(Routes.createUser, {
            handlers: {
                onSuccess: Routes.users,
                onCancel: Routes.users
            }
        });
    };

    _onDeleteUser = (user) => {
        this.props.deleteUser(user);
        this.setState({showAlert: true});
    };

    render() {
        const {currentUser, usersLoaded, userDeleted} = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN) {
            return null;
        }
        const handlers = {
            onEdit: this._onEditUser,
            onCreate: this._onAddUser,
            onDelete: this._onDeleteUser,
        };
        return <Users users={usersLoaded.users || []} showAlert={this.state.showAlert} userDeleted={userDeleted}
                      handlers={handlers} status={usersLoaded.status}/>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(MessageWrapper(UsersController))));

function mapStateToProps(state) {
    return {
        userDeleted: state.user.userDeleted,
        usersLoaded: state.users.usersLoaded,
        currentUser: state.auth.user
    };
}

function mapDispatchToProps(dispatch) {
    return {
        deleteUser: bindActionCreators(deleteUser, dispatch),
        loadUsers: bindActionCreators(loadUsers, dispatch),
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch)
    }
}