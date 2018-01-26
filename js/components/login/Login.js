'use strict';

import React from "react";
import {Alert, Button, Form, Panel} from "react-bootstrap";
import HorizontalInput from "../HorizontalInput";
import Authentication from "../../utils/Authentication";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import Mask from "../Mask";
import Input from "../Input";

class Login extends React.Component {
    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.state = {
            username: '',
            password: '',
            alertVisible: false,
            mask: false
        }
    }

    componentDidMount() {
        this.usernameField.focus();
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

    onLoginError = () => {
        this.setState({alertVisible: true, mask: false});
    };

    login = () => {
        Authentication.login(this.state.username, this.state.password, this.onLoginError);
        this.setState({mask: true});
    }

    /*
    register() {
        Routing.transitionTo(Routes.register);
    }*/


    renderAlert() {
        return this.state.alertVisible ? <Alert bsStyle='danger' bsSize='small'>
            <div>{this.i18n('login.error')}</div>
        </Alert> : null;
    }

    render() {
        const mask = this.state.mask ? (<Mask text={this.i18n('login.progress-mask')}/>) : null;
        return(<Panel header={<h3>{this.i18n('login.title')}</h3>} bsStyle='info' className="login-panel">
            {mask}
            <Form horizontal>
                {this.renderAlert()}
                <HorizontalInput type='text' name='username' ref={(input) => { this.usernameField = input; }}
                       label={this.i18n('login.username')} value={this.state.username}
                       onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                       inputWidth={9}/>
                <HorizontalInput type='password' name='password' label={this.i18n('login.password')}
                       value={this.state.password}
                       onChange={this.onChange} labelWidth={3} onKeyPress={this.onKeyPress}
                       inputWidth={9}/>
                <div className="login-forgot-password-block">
                    <Button bsStyle='link' className='login-forgot-password' bsSize='small'
                            disabled={this.state.mask}>Forgot password</Button>
                </div>
                <div className="login-button">
                    <Button bsStyle='success' bsSize='large' className='login-button-login' onClick={this.login}
                            disabled={this.state.mask}>{this.i18n('login.submit')}</Button>
                    {/*TODO i18n forgot password, click*/}
                </div>
            </Form>
        </Panel>
        )
    }
}

export default injectIntl(I18nWrapper(Login));
