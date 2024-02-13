'use strict';

import React from "react";
import Routes from "../../constants/RoutesConstants";
import {transitionToWithOpts} from "../../utils/Routing";
import Users from "./Users";
import {connect} from "react-redux";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import {bindActionCreators} from "redux";
import {loadUsers} from "../../actions/UsersActions";
import {ROLE} from "../../constants/DefaultConstants";
import {deleteUser} from "../../actions/UserActions";
import {trackPromise} from "react-promise-tracker";

class UsersController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showAlert: false
        };
    }

    componentDidMount() {
        trackPromise(this.props.loadUsers(), "users");
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
        return <Users usersLoaded={usersLoaded} showAlert={this.state.showAlert} userDeleted={userDeleted}
                      handlers={handlers}/>;

    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(UsersController)));

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