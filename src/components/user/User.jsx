import React from "react";
import {Button, Card} from "react-bootstrap";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import HorizontalInput from "../HorizontalInput";
import UserValidator from "../../validation/UserValidator";
import {ACTION_STATUS, ROLE} from "../../constants/DefaultConstants";
import {getRole, processInstitutions} from "../../utils/Utils";
import * as Vocabulary from "../../constants/Vocabulary";
import {LoaderCard, LoaderSmall} from "../Loader";
import HelpIcon from "../HelpIcon";
import PropTypes from "prop-types";
import {FaRandom} from 'react-icons/fa';
import {isUsingOidcAuth} from "../../utils/OidcUtils";
import {isAdmin} from "../../utils/SecurityUtils";

class User extends React.Component {
    static propTypes = {
        user: PropTypes.object,
        handlers: PropTypes.object.isRequired,
        backToInstitution: PropTypes.bool,
        userSaved: PropTypes.object,
        userLoaded: PropTypes.object,
        currentUser: PropTypes.object,
        institutions: PropTypes.array,
        invitationSent: PropTypes.object,
        invitationDelete: PropTypes.object,
        invited: PropTypes.bool,
        impersonation: PropTypes.object,
        impersonated: PropTypes.bool,
        deletedInvitation: PropTypes.bool,
        i18n: PropTypes.func.isRequired
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

    _passwordChangeButton() {
        const {user, currentUser, handlers} = this.props;
        if (user.isNew || (currentUser.username !== user.username && !isAdmin(currentUser))) {
            return null;
        } else {
            return <Button style={{margin: '0 0.3em 0 0'}} variant='primary' size='sm' ref='submit'
                           onClick={handlers.onPasswordChange}>{this.i18n('user.password-change')}</Button>;
        }
    }

    _redirectToKeycloakButton() {
        const {user, currentUser, handlers} = this.props;
        if (user.isNew || (currentUser.username !== user.username)) {
            return null;
        } else {
            return <Button style={{margin: '0 0.3em 0 0'}} variant='primary' size='sm' ref='submit'
                           onClick={handlers.onKeycloakRedirect}>{this.i18n('user.edit')}</Button>;
        }
    }

    _sendInvitationButton() {
        const {user, handlers, currentUser, invitationSent, invitationDelete} = this.props;
        if (user.isInvited === false && isAdmin(currentUser)) {
            return <h4 className="invite-to-study-text content-center"
                       style={{margin: '0 0 15px 0'}}>{this.i18n('user.invite-to-study-text')}
                <Button variant='warning' size='sm' ref='submit'
                        disabled={invitationSent.status === ACTION_STATUS.PENDING
                        || invitationDelete.status === ACTION_STATUS.PENDING}
                        onClick={() => handlers.sendInvitation()}>
                    {this.i18n('user.invite-to-study')}{invitationSent.status === ACTION_STATUS.PENDING &&
                <LoaderSmall/>}
                </Button>
                <Button variant='link' size='sm' onClick={handlers.deleteInvitationOption}
                        disabled={invitationSent.status === ACTION_STATUS.PENDING
                        || invitationDelete.status === ACTION_STATUS.PENDING}>
                    {this.i18n('user.delete-invitation-option')}{invitationDelete.status === ACTION_STATUS.PENDING &&
                <LoaderSmall/>}
                </Button>
            </h4>;
        } else {
            return null;
        }
    }

    _impersonateButton() {
        const {user, currentUser, handlers, impersonation} = this.props;
        if (!user.isNew && isAdmin(currentUser) && getRole(user) !== ROLE.ADMIN) {
            return <Button style={{margin: '0 0.3em 0 0'}} variant='danger' size='sm' ref='submit'
                           disabled={impersonation.status === ACTION_STATUS.PENDING}
                           onClick={handlers.impersonate}>
                {this.i18n('user.impersonate')}{impersonation.status === ACTION_STATUS.PENDING &&
            <LoaderSmall/>}
            </Button>;
        } else {
            return null;
        }
    }

    _saveAndSendEmailButton() {
        const {user, currentUser, userSaved} = this.props;
        if (!user.isNew && isAdmin(currentUser) && currentUser.username !== user.username) {
            return <Button style={{margin: '0 0.3em 0 0'}} variant='success' size='sm' ref='submit'
                           disabled={!UserValidator.isValid(user) || userSaved.status === ACTION_STATUS.PENDING}
                           onClick={() => this._onSaveAndSendEmail()} className="d-inline-flex"
                           title={this.i18n('required')}>{this.i18n('save-and-send-email')}
                {!UserValidator.isValid(user) && <HelpIcon text={this.i18n('required')} className="align-self-center"/>}
                {userSaved.status === ACTION_STATUS.PENDING && <LoaderSmall/>}
            </Button>
        } else {
            return null;
        }
    }

    _onSaveAndSendEmail() {
        this.props.handlers.onSave();
        this.setState({savedWithEmail: true});
    }

    _onSave() {
        this.props.handlers.onSave(this.props.currentUser.username === this.props.user.username);
        this.setState({savedWithEmail: false});
    }

    render() {
        const {userSaved, currentUser, user, handlers} = this.props;

        if (!user) {
            return <LoaderCard header={<span>{this.i18n('user.panel-title')}</span>}/>;
        }

        const generateButton = user.isNew &&
            <Button variant="link" className="p-0 button-random" size='sm'
                    onClick={handlers.generateUsername}>
                <FaRandom/>
            </Button>;

        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('user.panel-title')}</Card.Header>
            <Card.Body>
                <form>
                    {this._sendInvitationButton()}
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='text' name='firstName' label={`${this.i18n('user.first-name')}*`}
                                             disabled={currentUser.role !== ROLE.ADMIN && currentUser.username !== user.username
                                                 || isUsingOidcAuth()}
                                             value={user.firstName} labelWidth={3} inputWidth={8}
                                             onChange={this._onChange}/>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='text' name='lastName' label={`${this.i18n('user.last-name')}*`}
                                             disabled={!isAdmin(currentUser) && currentUser.username !== user.username
                                                 || isUsingOidcAuth()}
                                             value={user.lastName} labelWidth={3} inputWidth={8}
                                             onChange={this._onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='text' name='username' label={`${this.i18n('user.username')}*`}
                                             disabled={!user.isNew || isUsingOidcAuth()} labelWidth={3} inputWidth={8}
                                             value={user.username} onChange={this._onChange}
                                             iconRight={user.isNew ? generateButton : null}/>
                        </div>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='email' name='emailAddress' label={`${this.i18n('users.email')}*`}
                                             disabled={!isAdmin(currentUser) && currentUser.username !== user.username
                                                 || isUsingOidcAuth()}
                                             value={user.emailAddress} labelWidth={3} inputWidth={8}
                                             onChange={this._onChange}/>
                        </div>
                    </div>
                    <div className='row'>
                        {isAdmin(currentUser) &&
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='select' name='institution'
                                             label={`${this.i18n('institution.panel-title')}*`}
                                             onChange={this._onInstitutionSelected}
                                             disabled={!isAdmin(currentUser)}
                                             value={user.institution ? user.institution.uri : ''}
                                             labelWidth={3} inputWidth={8}>
                                {this._generateInstitutionsOptions()}
                            </HorizontalInput>
                        </div>
                        }
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='select' name='role' label={`${this.i18n('user.role')}*`}
                                             onChange={this._onAdminStatusChange}
                                             disabled={!isAdmin(currentUser) || isUsingOidcAuth()}
                                             value={user.types && getRole(user)}
                                             labelWidth={3} inputWidth={8}>
                                {this._generateRolesOptions()}
                            </HorizontalInput>
                        </div>
                    </div>
                    {user.isNew &&
                    <div className='row'>
                        <div className='col-12 col-sm-6'>
                            <HorizontalInput type='text' name='password' label={this.i18n('user.password')}
                                             readOnly={true} value={user.password} labelWidth={3} inputWidth={8}
                            />
                        </div>
                    </div>
                    }
                    <div className="buttons-line-height mt-3 text-center">
                        {this._impersonateButton()}
                        {isUsingOidcAuth() ?
                            this._redirectToKeycloakButton() :
                            this._passwordChangeButton()}
                        {this._saveAndSendEmailButton()}
                        {(isAdmin(currentUser) || currentUser.username === user.username) &&
                        <Button variant='success' size='sm' ref='submit' className="action-button"
                                disabled={!UserValidator.isValid(user) || userSaved.status === ACTION_STATUS.PENDING}
                                onClick={() => this._onSave()}
                                title={this.i18n('required')}>
                            {this.i18n('save')}
                            {!UserValidator.isValid(user) &&
                            <HelpIcon className="align-self-center" text={this.i18n('required')}/>}
                            {userSaved.status === ACTION_STATUS.PENDING &&
                            <LoaderSmall/>}
                        </Button>
                        }
                        <Button variant='link' size='sm' className="action-button" onClick={handlers.onCancel}>
                            {this.i18n(this.props.backToInstitution ? 'users.back-to-institution' : 'cancel')}
                        </Button>
                    </div>
                </form>
            </Card.Body>
        </Card>;
    }
}

export default injectIntl(withI18n(User));
