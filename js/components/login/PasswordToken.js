'use strict';

import React from "react";
import {Alert, Button, Form, Panel} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {connect} from "react-redux";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import {LoaderSmall} from "../Loader";
import {bindActionCreators} from "redux";
import {changePasswordToken, validateToken} from "../../actions/AuthActions";
import {transitionTo} from "../../utils/Routing";
import {Routes} from "../../utils/Routes";
import AlertMessage from "../AlertMessage";

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            newPassword: '',
            confirmPassword: '',
            valid: true,
            showAlert: false
        }
    }

    componentDidMount() {
        this.props.validateToken(this.props.params.token);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.validTokenStatus === ACTION_STATUS.ERROR) {
            transitionTo(Routes.login);
        }
    }

    onChange = (e) => {
        let state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onSave();
        }
    };

    onSave = () => {
        if(this._passwordValid) {
            this.setState({showAlert: true, newPassword: '', confirmPassword: ''});
            this.props.changePasswordToken(this.state.newPassword, this.props.params.token);
        }
    };

    _passwordValid() {
        if (this.state.newPassword.length >= 4
            && this.state.newPassword === this.state.confirmPassword) {
            this.setState({valid: true});
            return true;
        }
        this.setState({valid: false, showAlert: false});
        return false;
    }

    render() {
        const {validTokenStatus, passwordChange} = this.props;
        if (!validTokenStatus || validTokenStatus === ACTION_STATUS.PENDING) {
            return null;
        }
        return <Panel header={<span>{this.i18n('login.reset-password')}</span>} bsStyle='info' className="login-panel">
                <Form horizontal>
                    {!this.state.valid &&
                    <AlertMessage type={ALERT_TYPES.DANGER} message={this.i18n('user.password-non-valid')}/>}
                    {this.state.showAlert && passwordChange.status === ACTION_STATUS.ERROR &&
                    <AlertMessage type={ALERT_TYPES.DANGER}
                                  message={this.props.formatMessage('user.password-change-error', {error: this.i18n(passwordChange.error.message)})}/>}
                    {this.state.showAlert && passwordChange.status === ACTION_STATUS.SUCCESS &&
                    <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('user.login.token-password-success')}/>}
                    <HorizontalInput type='password' name='newPassword' label={this.i18n('user.password-new')}
                                     onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                                     inputWidth={9} value={this.state.newPassword}/>
                    <HorizontalInput type='password' name='confirmPassword' label={this.i18n('user.password-confirm')}
                                     onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                                     inputWidth={9} value={this.state.confirmPassword}/>
                    <div className="login-buttons">
                        <Button bsStyle='success' onClick={this.onSave}
                                disabled={this.props.passwordChange.status === ACTION_STATUS.PENDING || this.props.passwordChange.status === ACTION_STATUS.SUCCESS}>{this.i18n('login.reset-password')}
                            {this.props.passwordChange.status === ACTION_STATUS.PENDING && <LoaderSmall />}
                        </Button>
                    </div>
                </Form>
            </Panel>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(PasswordReset)));

function mapStateToProps(state) {
    return {
        validTokenStatus: state.auth.validTokenStatus,
        passwordChange: state.auth.passwordChange
    };
}

function mapDispatchToProps(dispatch) {
    return {
        validateToken: bindActionCreators(validateToken, dispatch),
        changePasswordToken: bindActionCreators(changePasswordToken, dispatch)
    }
}