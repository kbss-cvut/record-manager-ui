'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import I18nWrapper from '../../i18n/I18nWrapper';
import injectIntl from '../../utils/injectIntl';
import Input from '../Input';
import Mask from '../Mask';
import UserValidator from '../../validation/UserValidator';

class User extends React.Component {
    static propTypes = {
        user: React.PropTypes.object,
        loading: React.PropTypes.bool,
        onSave: React.PropTypes.func.isRequired,
        onChange: React.PropTypes.func.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    _onChange = (e) => {
        var change = {};
        change[e.target.name] = e.target.value;
        this.props.onChange(change);
    };

    render() {
        if (this.props.loading) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        var user = this.props.user;
        return <Panel header={<h3>{this.i18n('user.panel-title')}</h3>} bsStyle='primary'>
            <form className='form-horizontal' style={{margin: '0.5em 0 0 0'}}>
                <div className='row'>
                    <div className='col-xs-6'>
                        <Input type='text' name='firstName' label={this.i18n('user.first-name')}
                               value={user.firstName}
                               labelClassName='col-xs-4' wrapperClassName='col-xs-8' onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <Input type='text' name='lastName' label={this.i18n('user.last-name')}
                               value={user.lastName}
                               labelClassName='col-xs-4' wrapperClassName='col-xs-8' onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <Input type='text' name='username' label={this.i18n('user.username')}
                               value={user.username}
                               labelClassName='col-xs-4' wrapperClassName='col-xs-8' onChange={this._onChange}/>
                    </div>
                    <div className='col-xs-6'>
                        <Input type='text' name='emailAddress' label={this.i18n('users.email')}
                               value={user.emailAddress}
                               labelClassName='col-xs-4' wrapperClassName='col-xs-8' onChange={this._onChange}/>
                    </div>
                </div>
                <div className='row'>
                    <div className='col-xs-6'>
                        <Input type='text' name='password' label={this.i18n('user.password')}
                               labelClassName='col-xs-4' readOnly={true} value={user.password}
                               wrapperClassName='col-xs-8'/>
                    </div>
                </div>
                <div style={{margin: '1em 0em 0em 0em', textAlign: 'center'}}>
                    <Button bsStyle='success' bsSize='small' ref='submit'
                            disabled={!UserValidator.isValid(user) || this.props.loading}
                            onClick={this.props.onSave}>{this.i18n('save')}</Button>
                    <Button bsStyle='link' bsSize='small' onClick={this.props.onCancel}>{this.i18n('cancel')}</Button>
                </div>
            </form>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(User));
