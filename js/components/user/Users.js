'use strict';

import React from 'react';
import {Button, Panel} from 'react-bootstrap';
import injectIntl from '../../utils/injectIntl';
import I18nWrapper from '../../i18n/I18nWrapper';
import UserTable from './UserTable';
import {ACTION_STATUS, ALERT_TYPES} from "../../constants/DefaultConstants";
import AlertMessage from "../AlertMessage";
import {LoaderPanel} from "../Loader";

class Users extends React.Component {
    static propTypes = {
        usersLoaded: React.PropTypes.object,
        handlers: React.PropTypes.object.isRequired,
        userDeleted: React.PropTypes.object,
        showAlert: React.PropTypes.bool.isRequired,
    };

    constructor(props) {
        super(props);
        this.i18n = this.props.i18n;
    }

    render() {
        const {usersLoaded, showAlert, userDeleted} = this.props;
        if(!usersLoaded.users && (!usersLoaded.status || usersLoaded.status === ACTION_STATUS.PENDING)) {
            return <LoaderPanel header={this.i18n('users.panel-title')}/>;
        } else if(usersLoaded.status === ACTION_STATUS.ERROR) {
            return <AlertMessage type={ALERT_TYPES.DANGER}
                                 message={this.props.formatMessage('users.loading-error', {error: usersLoaded.error.message})}/>
        }
        return <Panel header={this.i18n('users.panel-title')} bsStyle='primary'>
            <UserTable users={usersLoaded.users}{...this.props}/>
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
