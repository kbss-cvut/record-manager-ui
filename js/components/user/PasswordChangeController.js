'use strict';

import React from 'react';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import {connect} from "react-redux";
import PasswordChange from "./PasswordChange";
import {Routes} from "../../utils/Routes";
import {transitionToWithOpts} from "../../utils/Routing";
import {bindActionCreators} from "redux";
import {ROLE} from "../../constants/DefaultConstants";
import {changePassword} from "../../actions/UserActions";
import * as UserFactory from "../../utils/EntityFactory";

class PasswordChangeController extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: UserFactory.initNewPassword(),
            showAlert: false,
            valid: true
        };
    }

    _onChange = (change) => {
        const update = {...this.state.password, ...change};
        this.setState({password: update});
    };

    _onSave = (sendEmail = true) => {
        if(this._passwordValid()){
            delete this.state.password.confirmPassword;
            this.props.changePassword(this.props.match.params.username, this.state.password, sendEmail);
            this.setState({showAlert: true, password: UserFactory.initNewPassword()});
        }
    };

    _onCancel = () => {
        this.props.transitionToWithOpts(Routes.editUser, {params: {username: this.props.match.params.username}});
    };

    _passwordValid = () => {
        if (this.state.password.newPassword.length >= 4
                && this.state.password.newPassword === this.state.password.confirmPassword) {
            this.setState({valid: true});
            return true;
        }
        this.setState({valid: false, showAlert: false});
        return false;
    };

    render() {
        const { currentUser, passwordChange, match } = this.props;
        if (!currentUser || currentUser.role !== ROLE.ADMIN && currentUser.username !== match.params.username) {
            return null;
        }
        const handlers = {
            onCancel: this._onCancel,
            onSave: this._onSave,
            onChange: this._onChange
        };
        return <PasswordChange handlers={handlers} currentUser={currentUser} showAlert={this.state.showAlert}
        valid={this.state.valid} passwordChange={passwordChange} params={params} password={this.state.password}/>;
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