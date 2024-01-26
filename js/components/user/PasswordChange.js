import React from "react";
import {Button, Card} from "react-bootstrap";
import withI18n from "../../i18n/withI18n";
import {injectIntl} from "react-intl";
import HorizontalInput from "../HorizontalInput";
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import UserValidator from "../../validation/UserValidator";
import {LoaderSmall} from "../Loader";
import HelpIcon from "../HelpIcon";
import PropTypes from "prop-types";
import {isAdmin} from "../../utils/SecurityUtils";

class PasswordChange extends React.Component {
    static propTypes = {
        handlers: PropTypes.object.isRequired,
        currentUser: PropTypes.object.isRequired,
        passwordChange: PropTypes.object.isRequired,
        match: PropTypes.object.isRequired,
        password: PropTypes.object.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    _onChange = (e) => {
        let change = {};
        change[e.target.name] = e.target.value;
        this.props.handlers.onChange(change);
    };

    _onSave() {
        this.props.handlers.onSave(this.props.currentUser.username === this.props.match.params.username);
    }

    _onSaveWithEmail() {
        this.props.handlers.onSave();
    }

    render() {
        const {handlers, currentUser, valid, passwordChange, match, password} = this.props;

        return <Card variant='primary'>
            <Card.Header className="text-light bg-primary" as="h6">{this.i18n('user.password-change')}</Card.Header>
            <Card.Body>
                <form>
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
                    <div className="mt-3 text-center">
                        {isAdmin(currentUser) &&
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
                </form>
            </Card.Body>
        </Card>;
    }
}

export default injectIntl(withI18n(PasswordChange));
