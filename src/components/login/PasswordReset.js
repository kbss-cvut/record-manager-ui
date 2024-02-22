'use strict';

import React from "react";
import {Button, Form, Card} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import {transitionTo} from "../../utils/Routing";
import Routes from "../../constants/RoutesConstants";
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
        if (this.state.showAlert) {
            switch (this.props.status) {
                case ACTION_STATUS.SUCCESS:
                    return <AlertMessage type={ALERT_TYPES.SUCCESS} alertPosition={'top'}
                                         message={this.i18n('login.reset-password-success')}/>;
                case ACTION_STATUS.ERROR:
                    return <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={'top'}
                                         message={this.i18n('login.reset-password-error')}/>;
            }
        }
        return null;
    }

    render() {
        return (<Card variant='info' className="login-panel">
                <Card.Header className="text-light bg-primary"
                             as="h6">{this.i18n('login.forgot-your-password')}</Card.Header>
                <Card.Body>
                    <Form>
                        {this.renderAlert()}
                        <HorizontalInput
                            labelWidth={3} inputWidth={8}
                            type='email' name='email'
                            ref={(input) => {
                                this.emailField = input;
                            }}
                            label={this.i18n('login.email')} value={this.state.email}
                            onChange={this.onChange} onKeyPress={this.onKeyPress}
                        />
                        <div className="login-buttons">
                            <Button variant='success' onClick={this.resetPassword} size="sm"
                                    disabled={this.props.status === ACTION_STATUS.PENDING || !Utils.validateEmail(this.state.email)}>
                                {this.i18n('login.reset-password')}{this.props.status === ACTION_STATUS.PENDING &&
                            <LoaderSmall/>}
                            </Button>
                            <Button variant='link' size="sm"
                                    onClick={() => transitionTo(Routes.login)}>{this.i18n('login.back-to-login')}</Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(PasswordReset)));

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