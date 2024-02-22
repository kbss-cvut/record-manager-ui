'use strict';

import React from "react";
import {Alert, Button, Form, Card} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import Routes from "../../constants/RoutesConstants";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {transitionTo} from "../../utils/Routing";
import {login} from "../../actions/AuthActions";
import {LoaderSmall} from "../Loader";
import {deviceIsMobile, deviceIsSupported} from "../../utils/Utils";
import * as SupportedDevices from "../../constants/SupportedDevices";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            username: '',
            password: '',
            showAlert: false,
        }
    }

    componentDidMount() {
        this.usernameField.focus();
        this.setState({deviceSupported: deviceIsSupported()});
    }

    onChange = (e) => {
        let state = this.state;
        state[e.target.name] = e.target.value;
        state.alertVisible = false;
        this.setState(state);
    };

    onKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.login();
        }
    };

    login = () => {
        this.props.login(this.state.username, this.state.password);
        this.setState({showAlert: true});
    };

    onForgotPassword = () => {
        transitionTo(Routes.passwordReset)
    };

    getSupportedBrowsersLinks() {
        return SupportedDevices.SUPPORTED_BROWSERS_LINKS.map((browser, index) => {
            return <span key={browser.name}>
        {browser.linkMobile && browser.linkDesktop ?
            <a href={deviceIsMobile() ? browser.linkMobile : browser.linkDesktop} target="_blank"
               key="0">{browser.name}</a> : <span>{browser.name}</span>}
                {index <= SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 3 && <span>, </span>}
                {index === SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 2 && <span>{this.i18n('or')} </span>}
                {index === SupportedDevices.SUPPORTED_BROWSERS_LINKS.length - 1 && <span>.</span>}
      </span>
        });
    }

    render() {
        return (
            <Card variant='info' className="login-panel">
                <Card.Header className="text-light bg-primary" as="h6">{this.i18n('login.title')}</Card.Header>
                <Card.Body>
                    {!this.state.deviceSupported &&
                    <div>
                        <Alert className={`alert-browser-support`} variant="warning">
                            {this.i18n('Your browser is not fully supported! Some parts of web may not work properly.')}<br/>
                            {this.i18n('We recommend using the latest version of ')}
                            {this.getSupportedBrowsersLinks()}
                        </Alert>
                    </div>}
                    {this.state.showAlert && this.props.error &&
                    <div>
                        <AlertMessage type={ALERT_TYPES.DANGER} alertPosition={'top'}
                                      message={this.i18n('login.error')}/>

                    </div>}
                    <Form>
                        <HorizontalInput type='text' name='username' ref={(input) => {
                            this.usernameField = input;
                        }}
                                         label={this.i18n('login.username')} value={this.state.username}
                                         onChange={this.onChange} labelWidth={4} onKeyPress={this.onKeyPress}
                                         inputWidth={8}/>
                        <HorizontalInput type='password' name='password' label={this.i18n('login.password')}
                                         value={this.state.password}
                                         onChange={this.onChange} labelWidth={4} onKeyPress={this.onKeyPress}
                                         inputWidth={8}/>
                        <div className="login-forgot-password-block">
                            <Button variant='link' className='login-forgot-password' size='sm'
                                    onClick={this.onForgotPassword}>{this.i18n('login.forgot-password')}</Button>
                        </div>
                        <div>
                            <Button className="mt-2" variant='success' size='block' onClick={this.login}
                                    disabled={this.props.isLogging}>
                                {this.i18n('login.submit')}{this.props.isLogging && <LoaderSmall/>}
                            </Button>
                        </div>
                    </Form>
                </Card.Body>
            </Card>
        )
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(withI18n(Login)));

function mapStateToProps(state) {
    return {
        isLogging: state.auth.isLogging,
        status: state.auth.status,
        error: state.auth.error
    };
}

function mapDispatchToProps(dispatch) {
    return {
        login: bindActionCreators(login, dispatch),
    }
}