'use strict';

import React from "react";
import {Alert, Button, Form, Card} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import {connect} from "react-redux";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import {LoaderSmall} from "../Loader";
import {bindActionCreators} from "redux";
import {changePasswordToken, validateToken} from "../../actions/AuthActions";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";
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
        this.props.validateToken(this.props.match.params.token);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.validTokenStatus === ACTION_STATUS.ERROR) {
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
        if (this._passwordValid()) {
            this.setState({showAlert: true, newPassword: '', confirmPassword: ''});
            this.props.changePasswordToken(this.state.newPassword, this.props.match.params.token);
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
        return <Card variant='info' className="login-panel">
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('login.reset-password')}</Card.Header>
            <Card.Body>
                <Form>
                    {!this.state.valid &&
                    <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={'top'}
                                  message={this.i18n('user.password-non-valid')}/>}
                    {this.state.showAlert && passwordChange.status === ACTION_STATUS.ERROR &&
                    <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={'top'}
                                  message={this.props.formatMessage('user.password-change-error', {error: this.i18n(passwordChange.error.message)})}/>}
                    {this.state.showAlert && passwordChange.status === ACTION_STATUS.SUCCESS &&
                    <AlertMessage type={ALERT_TYPES.SUCCESS} alertPosition={'top'}
                                  message={this.i18n('login.token-password-success')}/>}
                    <HorizontalInput
                        labelWidth={3} inputWidth={8}
                        type='password' name='newPassword' label={this.i18n('user.password-new')}
                        onChange={this.onChange} onKeyPress={this.onKeyPress}
                        value={this.state.newPassword}/>
                    <HorizontalInput
                        labelWidth={3} inputWidth={8}
                        type='password' name='confirmPassword' label={this.i18n('user.password-confirm')}
                        onChange={this.onChange} onKeyPress={this.onKeyPress}
                        value={this.state.confirmPassword}/>
                    <div className="login-buttons">
                        <Button variant='success' onClick={this.onSave}
                                disabled={this.props.passwordChange.status === ACTION_STATUS.PENDING || this.props.passwordChange.status === ACTION_STATUS.SUCCESS}>{this.i18n('login.reset-password')}
                            {this.props.passwordChange.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
                        </Button>
                        <Button variant='link'
                                onClick={() => transitionTo(Routes.login)}>{this.i18n('login.back-to-login')}</Button>
                    </div>
                </Form>
            </Card.Body>
        </Card>
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(PasswordReset)));

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