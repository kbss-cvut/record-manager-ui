'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import Mask from '../Mask';
import UserTable from './UserTable';
import {ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";

class Users extends React.Component {
    static propTypes = {
        users: React.PropTypes.array,
        handlers: React.PropTypes.object.isRequired
        handlers: React.PropTypes.object.isRequired,
        showAlert: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {users, showAlert} = this.props;
        if (!users.length) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        return <Panel header={this.i18n('users.panel-title')} bsStyle='primary'>
            <UserTable {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        onClick={this.props.handlers.onCreate}>{this.i18n('users.create-user')}</Button>
                {this.props.handlers.onBackToInstitution &&
                    <Button bsStyle='link' bsSize='small' onClick={this.props.handlers.onBackToInstitution}>
                    {this.i18n('users.back-to-institution')}</Button>
                }
            </div>
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(Users));
