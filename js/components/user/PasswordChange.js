'use strict';

import React from "react";
import {Button, Card} from "react-bootstrap";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import UserValidator from "../../validation/UserValidator";
import {LoaderSmall} from "../Loader";
import HelpIcon from "../HelpIcon";
import PropTypes from "prop-types";

class PasswordChange extends React.Component {
    static propTypes = {
        handlers: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        showAlert: PropTypes.bool.isRequired,
        passwordChange: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        password: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
        this.formatMessage = this.props.formatMessage;
        this.state = {savedWithEmail: false};
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    _onSave() {
        this.props.handlers.onSave(this.props.currentUser.username === this.props.match.params.username);
        this.setState({savedWithEmail: false});
    }

    _onSaveWithEmail() {
        this.props.handlers.onSave();
        this.setState({savedWithEmail: true});
    }

    render() {
        const {handlers, currentUser, showAlert, valid, passwordChange, match, password} = this.props;
        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('user.password-change')}</Card.Header>
            <Card.Body>
                <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                    {currentUser.username === match.params.username &&
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='password' name='currentPassword'
                                label={`${this.i18n('user.password-current')}*`}
                                value={password.currentPassword}
                                onChange={this._onChange}
                                labelWidth={4} inputWidth={8}/>
                        </div>
                    </div>
                    }
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='password' name='newPassword' label={`${this.i18n('user.password-new')}*`}
                                value={password.newPassword}
                                onChange={this._onChange}
                                labelWidth={4} inputWidth={8}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput
                                type='password' name='confirmPassword'
                                label={`${this.i18n('user.password-confirm')}*`}
                                value={password.confirmPassword}
                                onChange={this._onChange}
                                labelWidth={4} inputWidth={8}/>
                        </div>
                    </div>
                    <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                        {currentUser.role === ROLE.ADMIN &&
                        <Button style={{margin: '0 0.3em 0 0'}} variant='success' size='sm' ref='submit'
                                onClick={() => this._onSaveWithEmail()} className="d-inline-flex"
                                disabled={!UserValidator.isPasswordValid(password) || passwordChange.status === ACTION_STATUS.PENDING}>
                            {this.i18n('save-and-send-email')}
                            {!UserValidator.isPasswordValid(password) &&
                            <HelpIcon className="align-self-center" text={this.i18n('required')} glyph="help"/>}
                            {passwordChange.status === ACTION_STATUS.PENDING &&
                            <LoaderSmall/>}
                        </Button>
                        }
                        <Button variant='success' size='sm' ref='submit'
                                onClick={() => this._onSave()} className="d-inline-flex"
                                disabled={!UserValidator.isPasswordValid(password) || passwordChange.status === ACTION_STATUS.PENDING}>
                            {this.i18n('save')}
                            {!UserValidator.isPasswordValid(password) &&
                            <HelpIcon className="align-self-center" text={this.i18n('required')} glyph="help"/>}
                            {passwordChange.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
                        </Button>
                        <Button variant='link' size='sm' onClick={handlers.onCancel}>
                            {this.i18n('cancel')}
                        </Button>
                    </div>
                    {!valid &&
                    <AlertMessage type={ALERT_TYPES.DANGER} message={this.i18n('user.password-non-valid')}/>}
                    {showAlert && passwordChange.status === ACTION_STATUS.ERROR &&
                    <AlertMessage type={ALERT_TYPES.DANGER}
                                  message={this.props.formatMessage('user.password-change-error', {error: this.i18n(passwordChange.error.message)})}/>}
                    {showAlert && passwordChange.status === ACTION_STATUS.SUCCESS &&
                    <AlertMessage type={ALERT_TYPES.SUCCESS}
                                  message={this.i18n(this.state.savedWithEmail ? 'user.password-change-success-with-email' : 'user.password-change-success')}/>}
                </form>
            </Card.Body>
        </Card>;
    }
}

export default injectIntl(I18nWrapper(PasswordChange));
