'use strict';

import React from 'react';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import {connect} from "react-redux";
import PasswordChange from "./PasswordChange";
import assign from "object-assign";
import {Routes} from "../../utils/Routes";
import {transitionToWithOpts} from "../../utils/Routing";
import {bindActionCreators} from "redux";
import {ROLE} from "../../constants/DefaultConstants";
import {changePassword} from "../../actions/UserActions";

class PasswordChangeController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: {
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            },
            showAlert: false,
            valid: true
        };
    }

    _onChange = (change) => {
        const update = assign({}, this.state.password, change);
        this.setState({password: update});
    };

    _onSave = () => {
        if(this._validatePassword()){
            delete this.state.password.confirmPassword;
            this.props.changePassword(this.props.params.username, this.state.password);
            this.setState({showAlert: true, password: {}});
        }
    };

    _onCancel = () => {
        this.props.transitionToWithOpts(Routes.editUser, {params: {username: this.props.params.username}});
    };

    _validatePassword = () => {
        if (this.state.password.newPassword.length >= 4
                && this.state.password.newPassword === this.state.password.confirmPassword) {
            this.setState({valid: true});
            return true;
        }
        this.setState({valid: false, showAlert: false});
        return false;
    };

    render() {
        const { currentUser, passwordChange, params } = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN && currentUser.username !== params.username) {
            return null;
        }
        const handlers = {
            onCancel: this._onCancel,
            onSave: this._onSave,
            onChange: this._onChange
        };
        return <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={this.state.showAlert}
        valid={this.state.valid} passwordChange={passwordChange} params={params}/>;
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(PasswordChangeController)));

function mapStateToProps(state) {
    return {
        currentUser: state.auth.user,
        passwordChange: state.user.passwordChange
    };
}

function mapDispatchToProps(dispatch) {
    return {
        transitionToWithOpts: bindActionCreators(transitionToWithOpts, dispatch),
        changePassword: bindActionCreators(changePassword, dispatch),
    }
}