'use strict';

import React from "react";
import {Button, Panel} from "react-bootstrap";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import UserValidator from "../../validation/UserValidator";

class PasswordChange extends React.Component {
    static propTypes = {
        handlers: React.PropTypes.object.isRequired,
        currentUser: React.PropTypes.object.isRequired,
        showAlert: React.PropTypes.bool.isRequired,
        passwordChange: React.PropTypes.object.isRequired,
        params: React.PropTypes.object.isRequired,
        password: React.PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.formatMessage = this.props.formatMessage;
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    render() {
        const { handlers, currentUser, showAlert, valid, passwordChange, params, password} = this.props;
        return <Panel header={<span>{this.i18n('user.password-change')}</span>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                {currentUser.username === params.username &&
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='password' name='currentPassword' label={this.i18n('user.password-current')}
                                         labelWidth={3} inputWidth={8} value={password.currentPassword} onChange={this._onChange}/>
                    </div>
                </div>
                }
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='password' name='newPassword' label={this.i18n('user.password-new')}
                                         labelWidth={3} inputWidth={8} value={password.newPassword} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='password' name='confirmPassword' label={this.i18n('user.password-confirm')}
                                         labelWidth={3} inputWidth={8} value={password.confirmPassword} onChange={this._onChange}/>
                    </div>
                </div>
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    <Button bsStyle='success' bsSize='small' ref='submit' onClick={handlers.onSave}
                            disabled={!UserValidator.isPasswordValid(password) || passwordChange.status === ACTION_STATUS.PENDING}>
                        {this.i18n('save')}{passwordChange.status === ACTION_STATUS.PENDING && <div className="loader"></div>}
                    </Button>
                    <Button bsStyle='link' bsSize='small' onClick={handlers.onCancel} >
                        {this.i18n('cancel')}
                    </Button>
                </div>
                {!valid &&
                <AlertMessage type={ALERT_TYPES.DANGER} message={this.props.i18n('user.password-non-valid')}/>}
                {showAlert && passwordChange.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('user.password-change-error', {error: this.props.passwordChange.error.message})}/>}
                {showAlert && passwordChange.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.props.i18n('user.password-change-success')}/>}
            </form>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(PasswordChange));
