'use strict';

import React from "react";
import {Button, Form, Panel} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import {transitionTo} from "../../utils/Routing";
import {Routes} from "../../utils/Routes";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {passwordReset} from "../../actions/AuthActions";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import {LoaderSmall} from "../Loader";
import * as Utils from "../../utils/Utils";
import AlertMessage from "../AlertMessage";

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            email: '',
            showAlert: false
        }
    }

    componentDidMount() {
        this.emailField.focus();
    }

    onChange = (e) => {
        let state = this.state;
        state[e.target.name] = e.target.value;
        this.setState(state);
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.resetPassword();
        }
    };

    resetPassword = () => {
        this.setState({showAlert: true});
        this.props.passwordReset(this.state.email);
    };

    renderAlert() {
        return this.state.showAlert && this.props.status === ACTION_STATUS.SUCCESS ?
            <AlertMessage type={ALERT_TYPES.SUCCESS} alertPosition={'top'}
                          message={this.i18n('login.reset-password-alert')}/> : null;
    }

    render() {
        return(<Panel header={<span>{this.i18n('login.forgot-your-password')}</span>} bsStyle='info' className="login-panel">
            <Form horizontal>
                {this.renderAlert()}
                <HorizontalInput type='email' name='email' ref={(input) => { this.emailField = input; }}
                       label={this.i18n('login.email')} value={this.state.email}
                       onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                       inputWidth={9}/>
                <div className="login-buttons">
                    <Button bsStyle='success' onClick={this.resetPassword}
                            disabled={this.props.status === ACTION_STATUS.PENDING || !Utils.validateEmail(this.state.email)}>
                        {this.i18n('login.reset-password')}{this.props.status === ACTION_STATUS.PENDING && <LoaderSmall />}
                    </Button>
                    <Button bsStyle='link'
                            onClick={() => transitionTo(Routes.login)}>{this.i18n('login.back-to-login')}</Button>
                </div>
            </Form>
        </Panel>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(I18nWrapper(PasswordReset)));

function mapStateToProps(state) {
    return {
        status: state.auth.passwordResetStatus
    };
}

function mapDispatchToProps(dispatch) {
    return {
        passwordReset: bindActionCreators(passwordReset, dispatch)
    }
}