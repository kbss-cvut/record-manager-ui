'use strict';

import React from "react";
import {Button, Glyphicon, Panel} from "react-bootstrap";
import I18nWrapper from "../../i18n/I18nWrapper";
import injectIntl from "../../utils/injectIntl";
import HorizontalInput from "../HorizontalInput";
import UserValidator from "../../validation/UserValidator";
import AlertMessage from "../AlertMessage";
import {ACTION_STATUS, ALERT_TYPES, ROLE} from "../../constants/DefaultConstants";
import {getRole, processInstitutions} from "../../utils/Utils";
import * as Vocabulary from "../../constants/Vocabulary";
import {LoaderPanel, LoaderSmall} from "../Loader";

class User extends React.Component {
    static propTypes = {
        user: React.PropTypes.object,
        handlers: React.PropTypes.object.isRequired,
        backToInstitution: React.PropTypes.bool,
        userSaved: React.PropTypes.object,
        userLoaded: React.PropTypes.object,
        currentUser: React.PropTypes.object,
        showAlert: React.PropTypes.bool,
        institutions: React.PropTypes.array,
        invitationSent: React.PropTypes.object,
        invited: React.PropTypes.bool,
        impersonateObj: React.PropTypes.object,
        impersonated: React.PropTypes.bool
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

    _onInstitutionSelected = (e) => {
        const value = e.target.value,
            institution = this.props.institutions.find((item) => item.uri === value),
            change = {
                institution: institution
            };
        this.props.handlers.onChange(change);
    };

    _onAdminStatusChange = (e) => {
        const role = e.target.value;
        let types = this.props.user.types.slice();
        if (role === ROLE.ADMIN) {
            types.push(Vocabulary.ADMIN_TYPE);
        } else {
            types.splice(types.indexOf(Vocabulary.ADMIN_TYPE), 1);
        }
        this.props.handlers.onChange({types: types});
    };

    _generateInstitutionsOptions = () => {
        let options = [];
        const institutions = processInstitutions(this.props.institutions);
        const len = institutions.length;
        for (let i = 0; i < len; i++) {
            let option = institutions[i];
            options.push(<option key={'opt_' + option.value} value={option.value}>{option.label}</option>);
        }
        options.unshift(<option key='opt_default' value='' disabled style={{display: 'none'}}>
            {this.i18n('select.default')}
        </option>);
        return options;
    };

    _generateRolesOptions = () => {
        const roles = ROLE;
        return Object.keys(roles).map(key => {
            return <option key={roles[key]} value={roles[key]}>{roles[key]}</option>
        });
    };

    _passwordChange() {
        const {user, currentUser, handlers} = this.props;
        if (user.isNew || (currentUser.username !== user.username && currentUser.role !== ROLE.ADMIN)) {
            return null;
        } else {
            return <Button style={{margin: '0 0.3em 0 0'}} bsStyle='primary' bsSize='small' ref='submit'
                           onClick={handlers.onPasswordChange}>{this.i18n('user.password-change')}</Button>;
        }
    }

    _sendInvitationButton() {
        const {user, handlers, currentUser, invitationSent} = this.props;
        if (user.isInvited === "false" && currentUser.role === ROLE.ADMIN) {
            return <h4 className="content-center" style={{margin: '0 0 15px 0'}}>{this.i18n('user.invite-to-study-text')}
                <Button bsStyle='warning' bsSize='small' ref='submit'
                        disabled={invitationSent.status === ACTION_STATUS.PENDING}
                        onClick={() => handlers.sendInvitation()}>
                {this.i18n('user.invite-to-study')}{invitationSent.status === ACTION_STATUS.PENDING && <LoaderSmall />}
                </Button>
            </h4>;
        } else {
            return null;
        }
    }

    _impersonateButton() {
        const {user, currentUser, handlers, impersonateObj} = this.props;
        console.log(impersonateObj)
        return currentUser.role === ROLE.ADMIN && getRole(user) !== ROLE.ADMIN ?
            <Button style={{margin: '0 0.3em 0 0'}} bsStyle='danger' bsSize='small' ref='submit'
                    disabled={impersonateObj.status === ACTION_STATUS.PENDING}
                    onClick={handlers.impersonate}>
                {this.i18n('user.impersonate')}{impersonateObj.status === ACTION_STATUS.PENDING &&
            <LoaderSmall />}
            </Button> :
            null
    }

    render() {
        const {userSaved, userLoaded, currentUser, showAlert, user, handlers, invitationSent, invited, impersonateObj, impersonated} = this.props;
        if (!user && (!userLoaded.status || userLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={<span>{this.i18n('user.panel-title')}</span>} />;
        } else if (userLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('user.load-error', {error: userLoaded.error.message})}/>;
        }
        const generateButton = user.isNew &&
            <Button bsStyle='link' bsSize='small' onClick={handlers.generateUsername}>
                <Glyphicon glyph="random" />
            </Button>;

        return <Panel header={<span>{this.i18n('user.panel-title')}</span>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                {this._sendInvitationButton()}
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='firstName' label={this.i18n('user.first-name')}
                                         disabled={currentUser.role !== ROLE.ADMIN && currentUser.username !== user.username}
                                         value={user.firstName}
                                         labelWidth={3} inputWidth={8} onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='lastName' label={this.i18n('user.last-name')}
                                         disabled={currentUser.role !== ROLE.ADMIN && currentUser.username !== user.username}
                                         value={user.lastName}
                                         labelWidth={3} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='username' label={this.i18n('user.username')}
                                         disabled={!user.isNew}
                                         value={user.username} labelWidth={3} inputWidth={8} onChange={this._onChange}
                                         iconRight={user.isNew ? generateButton : null} />
                    </div>
                    <div className='col-xs-6'>
                        <HorizontalInput type='email' name='emailAddress' label={this.i18n('users.email')}
                                         disabled={currentUser.role !== ROLE.ADMIN && currentUser.username !== user.username}
                                         value={user.emailAddress}
                                         labelWidth={3} inputWidth={8} onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    {currentUser.role === ROLE.ADMIN &&
                        <div className='col-xs-6'>
                            <HorizontalInput type='select' name='institution' label={this.i18n('institution.panel-title')}
                                             onChange={this._onInstitutionSelected}
                                             disabled={currentUser.role !== ROLE.ADMIN}
                                             value={user.institution ? user.institution.uri : ''}
                                             labelWidth={3} inputWidth={8}>
                                {this._generateInstitutionsOptions()}
                            </HorizontalInput>
                        </div>
                    }
                    <div className='col-xs-6'>
                        <HorizontalInput type='select' name='role' label="Role"
                                         onChange={this._onAdminStatusChange}
                                         disabled={currentUser.role !== ROLE.ADMIN}
                                         value={user.types && getRole(user)}
                                         labelWidth={3} inputWidth={8}>
                            {this._generateRolesOptions()}
                        </HorizontalInput>
                    </div>
                </div>
                {user.isNew &&
                <div className='row'>
                    <div className='col-xs-6'>
                        <HorizontalInput type='text' name='password' label={this.i18n('user.password')}
                                         readOnly={true} value={user.password}
                                         labelWidth={3} inputWidth={8}/>
                    </div>
                </div>
                }
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    {this._impersonateButton()}
                    {this._passwordChange()}
                    {(currentUser.role === ROLE.ADMIN || currentUser.username === user.username) &&
                        <Button bsStyle='success' bsSize='small' ref='submit'
                                disabled={!UserValidator.isValid(user) || userSaved.status === ACTION_STATUS.PENDING}
                                onClick={handlers.onSave}>
                            {this.i18n('save')}{userSaved.status === ACTION_STATUS.PENDING &&
                        <LoaderSmall />}
                        </Button>
                    }
                    <Button bsStyle='link' bsSize='small' onClick={handlers.onCancel}>
                        {this.i18n(this.props.backToInstitution ? 'users.back-to-institution' : 'cancel')}
                    </Button>
                </div>
                {showAlert && userSaved.status === ACTION_STATUS.ERROR &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('user.save-error', {error: this.props.userSaved.error.message})}/>}
                {showAlert && userSaved.status === ACTION_STATUS.SUCCESS &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('user.save-success')}/>}
                {invitationSent.status === ACTION_STATUS.SUCCESS && invited &&
                <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.i18n('user.send-invitation-success')}/>}
                {invitationSent.status === ACTION_STATUS.ERROR && invited &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                    message={this.props.formatMessage('user.send-invitation-error', {error: invitationSent.error.message})}/>}
                {impersonateObj.status === ACTION_STATUS.ERROR && impersonated &&
                <AlertMessage type={ALERT_TYPES.DANGER}
                              message={this.props.formatMessage('user.impersonate-error', {error: impersonateObj.error.message})}/>}
            </form>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(User));
