'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';

import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import Mask from '../Mask';
import UserTable from './UserTable';
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";

class Users extends React.Component {
    static propTypes = {
        users: React.PropTypes.array,
        handlers: React.PropTypes.object.isRequired,
        userDeleted: React.PropTypes.object,
        showAlert: React.PropTypes.bool.isRequired
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {users, showAlert, userDeleted} = this.props;
        if (!users.length) {
            return <Mask text={this.i18n('please-wait')}/>;
        }
        return <Panel header={this.i18n('users.panel-title')} bsStyle='primary'>
            <UserTable {...this.props}/>
            <div>
                <Button bsStyle='primary'
                        onClick={this.props.handlers.onCreate}>{this.i18n('users.create-user')}</Button>
            </div>
            {showAlert && userDeleted.status === ACTION_STATUS.ERROR &&
            <AlertMessage type={ALERT_TYPES.DANGER}
                          message={this.props.formatMessage('user.delete-error', {error: this.props.userDeleted.error.message})}/>}
            {showAlert && userDeleted.status === ACTION_STATUS.SUCCESS &&
            <AlertMessage type={ALERT_TYPES.SUCCESS} message={this.props.i18n('user.delete-success')}/>}
        </Panel>;
    }
}

export default injectIntl(I18nWrapper(Users));
